const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const Question = require("../models/question");
const Mistake = require("../models/mistake");
const TestResult = require("../models/testResult");
const mail = require("../mail/mail_inlege");
const {
  isLoggedIn,
  isEditor,
  validateQuestion,
} = require("../utils/middleware");
const { incrementEventCount } = require("../utils/helpers");

//RESTful routes for /questions
//show questions of section
router.get(
  "/category/:categoryId/section/:sectionId/test",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { user } = req;
    if (!user.isPremium && user.questionsSeenThisMonth > 50) {
      return res.redirect("/questions/reachedMonthlyLimit");
    }
    const { categoryId, sectionId } = req.params;
    const foundSection = await Section.findById(sectionId);
    const foundCategory = await Category.findById(categoryId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }
    foundSection.countStartedTest++;
    await foundSection.save();
    res.status(200).render("questions/show", {
      section: foundSection,
      category: foundCategory,
    });
  })
);

//show random set of questions of category
router.get(
  "/category/:categoryId/testRandom",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { user } = req;
    if (!user.isPremium && user.questionsSeenThisMonth > 50) {
      return res.redirect("/questions/reachedMonthlyLimit");
    }
    const { categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }
    let constructedSection = {
      category: foundCategory._id,
      _id: "random_test",
      name: `Sada náhodných otázek z předmětu ${foundCategory.text}`,
      questions: {
        length: 20,
      },
    };
    incrementEventCount("startRandomTest");
    res.status(200).render("questions/show", {
      section: constructedSection,
      category: foundCategory,
    });
  })
);

//render finished test page
router.get(
  "/category/:categoryId/section/:sectionId/testFinished",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;

    const correct = parseInt(req.query.correct) || 0;
    const wrong = parseInt(req.query.wrong) || 0;
    const skipped = parseInt(req.query.skipped) || 0;

    let { user } = req;
    const foundSection = await Section.findById(sectionId);
    const foundCategory = await Category.findById(categoryId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }

    const totalQuestions =
      parseInt(correct) + parseInt(wrong) + parseInt(skipped);
    const percentage = Math.round((correct / totalQuestions) * 100);

    // Save the test result
    await TestResult.create({
      user: user._id,
      category: categoryId,
      section: sectionId,
      testType: "section",
      score: { correct, wrong, skipped },
      percentage,
      totalQuestions,
    });

    let counters = {
      correct: parseInt(correct),
      wrong: parseInt(wrong),
      skipped: parseInt(skipped),
    };
    if (!user.isPremium && user.questionsSeenThisMonth > 50) {
      user.reachedQuestionsLimitDate = Date.now();
    }
    let step = 100 / (counters.correct + counters.wrong + counters.skipped);
    step = step.toFixed(2);
    foundSection.countFinishedTest++;
    user.finishedQuestions.push(sectionId);
    await user.save();
    await foundSection.save();
    res.status(200).render("questions/finished", {
      counters,
      step,
      section: foundSection,
      category: foundCategory,
    });
  })
);

//render finished test page - RANDOM TEST
router.get(
  "/category/:categoryId/testRandomFinished",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { categoryId } = req.params;

    const correct = parseInt(req.query.correct) || 0;
    const wrong = parseInt(req.query.wrong) || 0;
    const skipped = parseInt(req.query.skipped) || 0;

    let { user } = req;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }

    const totalQuestions =
      parseInt(correct) + parseInt(wrong) + parseInt(skipped);
    const percentage = Math.round((correct / totalQuestions) * 100);

    // Save the random test result
    await TestResult.create({
      user: user._id,
      category: categoryId,
      testType: "random",
      score: { correct, wrong, skipped },
      percentage,
      totalQuestions,
    });

    let counters = {
      correct: parseInt(correct),
      wrong: parseInt(wrong),
      skipped: parseInt(skipped),
    };
    if (!user.isPremium && user.questionsSeenThisMonth > 50) {
      user.reachedQuestionsLimitDate = Date.now();
      await user.save();
    }
    let step = 100 / (counters.correct + counters.wrong + counters.skipped);
    step = step.toFixed(2);
    res.status(200).render("questions/finishedRandom", {
      counters,
      step,
      category: foundCategory,
    });
  })
);

//new
router.get(
  "/category/:categoryId/section/:sectionId/question/new",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const category = await Category.findById(categoryId);
    const section = await Section.findById(sectionId);
    if (!category || !section) {
      req.flash("error", "Kategorie nebo balíček nebyl nalezen");
      return res.redirect("/");
    }
    res.status(200).render("questions/new", { category, section });
  })
);

//create
router.post(
  "/category/:categoryId/section/:sectionId/question",
  isLoggedIn,
  isEditor,
  validateQuestion,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const { question, correctAnswer, wrongAnswer1, wrongAnswer2 } = req.body;
    const { email } = req.user;
    const foundSection = await Section.findById(sectionId);
    const foundCategory = await Category.findById(categoryId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }
    let newQuestion = new Question({
      category: categoryId,
      categoryId: categoryId,
      section: sectionId,
      author: email,
      question,
      correctAnswers: [correctAnswer],
      wrongAnswers: [wrongAnswer1, wrongAnswer2],
    });
    const createdQuestion = await newQuestion.save();

    foundCategory.numOfQuestions++;
    await foundCategory.save();

    foundSection.questions.push(createdQuestion._id);
    await foundSection.save();

    req.flash("successOverlay", "Otázka byla vložena do databáze.");
    res
      .status(201)
      .redirect(`/category/${categoryId}/section/${sectionId}/question/new`);
  })
);

//edit
router.get(
  "/category/:categoryId/section/:sectionId/questions/:questionId/edit",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId, questionId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    const foundSection = await Section.findById(sectionId);
    const foundQuestion = await Question.findById(questionId).populate(
      "sourceCard"
    );

    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }
    if (!foundQuestion) {
      throw Error("Otázka s tímto ID neexistuje");
    }

    res.status(200).render("questions/edit", {
      category: foundCategory,
      section: foundSection,
      question: foundQuestion,
    });
  })
);

//update
router.patch(
  "/category/:categoryId/section/:sectionId/questions/:questionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId, questionId } = req.params;
    const { question, correctAnswer, wrongAnswer1, wrongAnswer2 } = req.body;
    let updatedQuestion = {
      question,
      correctAnswers: [correctAnswer],
      wrongAnswers: [wrongAnswer1, wrongAnswer2],
    };
    await Question.findByIdAndUpdate(questionId, updatedQuestion);
    req.flash("successOverlay", "Otázka byla upravena.");
    res.status(201).redirect(`/review/${sectionId}/showAll`);
  })
);

//destroy
router.delete(
  "/category/:categoryId/section/:sectionId/questions/:questionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId, questionId } = req.params;
    const { api } = req.query;
    const foundQuestion = await Question.findById(questionId);
    if (!foundQuestion) {
      throw Error("Otázka s tímto ID neexistuje");
    }
    await Section.findByIdAndUpdate(foundQuestion.section, {
      $pull: { questions: questionId },
    });
    await Question.findByIdAndDelete(questionId);
    const foundCategory = await Category.findById(categoryId);
    foundCategory.numOfQuestions--;
    await foundCategory.save();

    let connectedCard = await Card.findById(foundQuestion.sourceCard);
    if (connectedCard) {
      connectedCard.connectedQuestionId = null;
      await connectedCard.save();
    }

    if (api) {
      res.sendStatus(200);
    } else {
      res.status(201).redirect(`/review/${sectionId}/showAll`);
    }
  })
);

//destroy all questions in section
router.get(
  "/category/:categoryId/section/:sectionId/removeAll",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const foundSection = await Section.findById(sectionId);
    const foundCategory = await Category.findById(categoryId);
    if (!foundSection) {
      req.flash("error", "Balíček nebyl nalezen");
      return res.redirect("/");
    }
    if (!foundCategory) {
      req.flash("error", "Předmět nebyl nalezen");
      return res.redirect("/");
    }

    //delete Questions in Section from DB
    await Question.deleteMany({ section: sectionId });
    foundCategory.numOfQuestions =
      foundCategory.numOfQuestions - foundSection.questions.length;
    foundSection.questions = [];
    await foundCategory.save();
    await foundSection.save();

    //delete connected Questions in Cards
    await Card.updateMany(
      { section: sectionId },
      { $set: { connectedQuestionId: null } }
    );

    req.flash("successOverlay", "Všechny otázky z balíčku byly odstraněny");
    res.status(201).redirect(`/review/${sectionId}/showAll`);
  })
);

//publish Questions of Section
router.get(
  "/category/:categoryId/section/:sectionId/publishTest",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { sectionId } = req.params;
    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    foundSection.testIsPublic = true;
    await foundSection.save();
    res.status(200).redirect(`/category/${foundSection.category}`);
  })
);

//report mistake in question
//render form
router.get(
  "/category/:categoryId/section/:sectionId/questions/:questionId/reportMistake",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { questionId } = req.params;
    const foundQuestion = await Question.findById(questionId);
    if (!foundQuestion) {
      throw Error("Otázka s tímto ID neexistuje");
    }
    res.status(200).render(`questions/report`, { question: foundQuestion });
  })
);

//save error
router.post(
  "/category/:categoryId/section/:sectionId/questions/:questionId/reportMistake",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId, questionId } = req.params;
    const { reportMsg } = req.body;
    const newMistake = new Mistake({
      content: reportMsg,
      author: req.user.email,
      question: questionId,
    });
    await newMistake.save();
    res.status(201).render("questions/reportSubmited");
  })
);

//delete mistake
router.get(
  "/deleteMistakeReport/:mistakeId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { mistakeId } = req.params;
    const { thankUser } = req.query;
    const deletedMistake = await Mistake.findByIdAndRemove(mistakeId).populate(
      "question card"
    );

    if (thankUser && deletedMistake.question) {
      mail.sendThankYou(
        deletedMistake.author,
        deletedMistake.question.question,
        "question"
      );
      req.flash(
        "successOverlay",
        "Report odstraněn a uživateli zaslán e-mail s poděkováním."
      );
    } else if (thankUser && deletedMistake.card) {
      mail.sendThankYou(
        deletedMistake.author,
        deletedMistake.card.pageA,
        "card"
      );
      req.flash(
        "successOverlay",
        "Report odstraněn a uživateli zaslán e-mail s poděkováním."
      );
    } else {
      req.flash("successOverlay", "Report odstraněn.");
    }
    res.status(200).redirect(`/admin/mistakes`);
  })
);

//show reached monthly limit page
router.get(
  "/questions/reachedMonthlyLimit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { user } = req;
    user.reachedQuestionsLimitDate = Date.now();
    await user.save();
    res.status(200).render(`questions/reachedLimit`);
  })
);

module.exports = router;
