const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const Question = require("../models/question");
const Card = require("../models/card");
const TestResult = require("../models/testResult");
const {
  isLoggedIn,
  validateQuestion,
  isCategoryAuthor,
} = require("../utils/middleware");
const { incrementEventCount } = require("../utils/helpers");

//RESTful routes for /questions
//show questions of section
router.get(
  "/category/:categoryId/section/:sectionId/test",
  catchAsync(async (req, res) => {
    const { user } = req;
    const { categoryId, sectionId } = req.params;
    const { demo } = req.query;

    //if no user
    if (
      !user &&
      sectionId !== req.session.generatedSectionId &&
      sectionId !== process.env.DEMO_SECTION_ID
    ) {
      req.flash("error", "Pro pokračování se musíte přihlásit");
      return res.redirect("/auth/user/login");
    }

    const foundSection = await Section.findById(sectionId);
    const foundCategory = await Category.findById(categoryId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }

    //if user but not premium and reached limit
    if (
      user &&
      !user.isPremium &&
      user.questionsSeenThisMonth > 100 &&
      !foundSection.createdByTeacher
    ) {
      return res.redirect("/questions/reachedMonthlyLimit");
    }

    if (!demo) {
      let isAuthor = false;
      let isShared = false;
      //check if user isAuthor or if the category is shared with the user
      if (foundCategory.author && foundCategory.author.equals(user._id)) {
        isAuthor = true;
      }
      if (
        user.sharedCategories &&
        user.sharedCategories.includes(foundCategory._id)
      ) {
        isShared = true;
      }

      //refuse access if the category is not shared with the user and the user is not the author
      if (!isAuthor && !isShared && !user.admin) {
        req.flash("error", "K tomuto předmětu nemáš přístup.");
        return res.status(404).redirect("/");
      }
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
    const { categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje");
    }

    //get first section of the category
    const sectionId = foundCategory.sections[0];
    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Předmět neobsahuje žádné balíčky");
    }

    if (
      !user.isPremium &&
      user.questionsSeenThisMonth > 100 &&
      !foundSection.createdByTeacher
    ) {
      return res.redirect("/questions/reachedMonthlyLimit");
    }

    let constructedSection = {
      categoryId: foundCategory._id,
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
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;

    const correct = parseInt(req.query.correct) || 0;
    const wrong = parseInt(req.query.wrong) || 0;
    const skipped = parseInt(req.query.skipped) || 0;

    let { user } = req;

    if (user) {
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
      if (!user.isPremium && user.questionsSeenThisMonth > 100) {
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
    } else {
      res.status(200).render("questions/finishedDemo", {
        counters: {
          correct: parseInt(correct),
          wrong: parseInt(wrong),
          skipped: parseInt(skipped),
        },
        step: 100 / (parseInt(correct) + parseInt(wrong) + parseInt(skipped)),
        section: { name: "Test" },
        category: { text: "Test" },
      });
    }
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

    //get first section of the category
    const sectionId = foundCategory.sections[0];
    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Předmět neobsahuje žádné balíčky");
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
      createdByTeacher: foundSection.createdByTeacher,
    });

    let counters = {
      correct: parseInt(correct),
      wrong: parseInt(wrong),
      skipped: parseInt(skipped),
    };
    if (!user.isPremium && user.questionsSeenThisMonth > 100) {
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
  isCategoryAuthor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const { sourceCard } = req.query;

    let sourceCardData = null;
    if (sourceCard) {
      sourceCardData = await Card.findById(sourceCard);
    }
    const category = await Category.findById(categoryId);
    const section = await Section.findById(sectionId);
    if (!category || !section) {
      req.flash("error", "Předmět nebo balíček nebyl nalezen");
      return res.redirect("/");
    }
    res
      .status(200)
      .render("questions/new", { category, section, sourceCardData });
  })
);

//create
router.post(
  "/category/:categoryId/section/:sectionId/question",
  isLoggedIn,
  isCategoryAuthor,
  validateQuestion,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const { question, correctAnswer, wrongAnswer1, wrongAnswer2 } = req.body;
    const { sourceCard } = req.query;
    const { _id } = req.user;
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
      author: _id,
      question,
      correctAnswers: [correctAnswer],
      wrongAnswers: [wrongAnswer1, wrongAnswer2],
      sourceCard: sourceCard || null,
    });
    const createdQuestion = await newQuestion.save();

    if (sourceCard) {
      let connectedCard = await Card.findById(sourceCard);
      connectedCard.connectedQuestionId = createdQuestion._id;
      await connectedCard.save();
    }

    foundCategory.numOfQuestions++;
    await foundCategory.save();

    foundSection.questions.push(createdQuestion._id);
    await foundSection.save();

    if (sourceCard) {
      req.flash(
        "successOverlay",
        "Otázka byla vložena do databáze a propojena s kartičkou"
      );
      return res.status(201).redirect(`/review/${sectionId}/showAll`);
    }

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
  isCategoryAuthor,
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
  isCategoryAuthor,
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
  isCategoryAuthor,
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
  isCategoryAuthor,
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
