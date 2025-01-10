const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const Card = require("../models/card");
const Question = require("../models/question");
const CardInfo = require("../models/cardInfo");
const TestResult = require("../models/testResult");
const mongoose = require("mongoose");
const {
  isLoggedIn,
  isAdmin,
  validateSection,
  isEditor,
} = require("../utils/middleware");

//SHOW SECTIONS OF CATEGORY
router.get(
  "/category/:categoryId",
  catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId)
      .populate({
        path: "sections",
        populate: {
          path: "cards author", // <-- populate the cards array in each section
        },
      })
      .exec();

    if (!category) {
      req.flash("error", "Předmět neexistuje.");
      return res.status(404).redirect("/");
    }

    let knownCardsOfCategory = 0;

    if (req.user) {
      const CardInfo = require("../models/cardInfo");

      for (let section of category.sections) {
        const cardIds = section.cards.map((c) => c._id);

        // How many of these card IDs does the user know?
        const knownCount = await CardInfo.countDocuments({
          user: req.user._id,
          card: { $in: cardIds },
          known: true,
        });

        // Store this info so you can use it in your EJS
        section.knownCount = knownCount;
        knownCardsOfCategory += knownCount;
        section.leftToStudy = cardIds.length - knownCount;
        //how many percent of the cards the user already knows
        section.knownPercentage = Math.round(
          (knownCount / cardIds.length) * 100
        );
      }
    }

    let knownPercentageOfCategory = Math.round(
      (knownCardsOfCategory / category.numOfCards) * 100
    );

    if (isNaN(knownPercentageOfCategory)) {
      knownPercentageOfCategory = 0;
    }

    //if there is not user, set knownCount to 0
    if (!req.user) {
      category.sections.forEach((section) => {
        section.knownCount = 0;
        section.leftToStudy = section.cards.length;
        section.knownPercentage = 0;
      });
    }

    //asign name of category
    let title = "";
    if (category) {
      title = category.text;
    }

    let testResultsMap = {};

    if (req.user) {
      const testResults = await TestResult.find({
        user: req.user._id,
        category: category._id,
        showOnCategoryPage: true,
      })
        .sort({ date: -1 }) // Sort by most recent
        .exec();

      // Create a map of the latest test result for each section
      testResults.forEach((result) => {
        if (!testResultsMap[result.section]) {
          testResultsMap[result.section] = result;
        }
      });

      category.sections.forEach((section, index) => {
        // Add test result to the section
        if (testResultsMap[section._id]) {
          category.sections[index].lastTestResult =
            testResultsMap[section._id].percentage;
        }

        //check if the section is in the finishedQuestions array of the user - if so, mark it as finished
        let finishedQuestionsIndex = req.user.finishedQuestions.findIndex(
          (x) => {
            return x.toString() == section._id.toString();
          }
        );
        if (finishedQuestionsIndex > -1) {
          category.sections[index].isFinishedQuestions = true;
        }
      });
    }

    //get last test result for each section (percentage) and make an average, if the section has no test result, count is as 0
    let totalTestPercentage = 0;
    let testResultsCount = 0;
    category.sections.forEach((section) => {
      if (section.isPublic && section.testIsPublic) {
        if (section.lastTestResult) {
          totalTestPercentage += section.lastTestResult;
          testResultsCount++;
        } else {
          totalTestPercentage += 0;
          testResultsCount++;
        }
      }
    });
    if (testResultsCount > 0) {
      averageTestPercentage = Math.round(
        totalTestPercentage / testResultsCount
      );
    } else {
      averageTestPercentage = 0;
    }

    let proficiencyPercetage = Math.floor(
      (averageTestPercentage + knownPercentageOfCategory) / 2
    );
    //render category page
    res.status(200).render("category", {
      category,
      title,
      knownPercentageOfCategory: proficiencyPercetage,
    });
  })
);

//CATEGORY (create, edit, delete)
//create new Category - post ROUTE
router.post(
  "/category/new",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res, next) => {
    let { text, value, icon } = req.body;
    let user = req.user;
    const newCategory = new Category({
      name: value,
      sections: [],
      text,
      icon,
      author: req.user._id,
    });
    let savedCategory = await newCategory.save();
    user.createdCategories.push(savedCategory._id);
    await user.save();
    console.log(savedCategory);
    req.flash("successOverlay", "Předmět byl vytvořen.");
    res.status(201).redirect(`/admin/categories`);
  })
);

//edit Category - update in the DB
router.put(
  "/category/edit/:categoryId",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { categoryId } = req.params;
    let { text, icon } = req.body;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Kategorie nebyla nalezena.");
      return res.redirect("/admin/categories");
    }
    await Category.findByIdAndUpdate(categoryId, { text, icon });
    req.flash("successOverlay", "Změny byly uloženy.");
    res.status(201).redirect(`/admin/categories`);
  })
);

//remove Category - delete from DB
router.delete(
  "/category/remove/:categoryId",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Kategorie nebyla nalezena.");
      return res.redirect("/admin/categories");
    }
    if (foundCategory.sections.length === 0) {
      await Category.findByIdAndDelete(categoryId);
      req.flash("successOverlay", "Předmět byl odstraněn.");
    } else {
      req.flash(
        "error",
        "Kategorie obsahuje balíčky. Nejdříve odstraň balíčky, poté bude možné kategorii smazat."
      );
    }
    res.status(200).redirect("/admin/categories");
  })
);

//RESETING USER`S STATS (GET)
router.get(
  "/category/:categoryId/resetCards",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId).populate("sections");
    if (!category) {
      req.flash("error", "Předmět neexistuje.");
      return res.status(404).redirect("/");
    }
    const cardIds = category.sections
      .map((section) => section.cards)
      .flat()
      .map((card) => card._id);

    await CardInfo.deleteMany({
      user: req.user._id,
      card: { $in: cardIds },
    });

    req.flash("successOverlay", "Tvé kartičky byly smazány.");
    res.status(200).redirect(`/category/${req.params.categoryId}`);
  })
);

router.get(
  "/category/:categoryId/resetQuestions",
  isLoggedIn,
  async (req, res) => {
    const { categoryId } = req.params;
    console.log(categoryId);
    const category = await Category.findById(categoryId).populate("sections");
    if (!category) {
      req.flash("error", "Předmět neexistuje.");
      return res.status(404).redirect("/");
    }

    req.user.finishedQuestions = req.user.finishedQuestions.filter(
      (sectionId) =>
        !category.sections.map((section) => section._id).includes(sectionId)
    );

    //mark all testResults of this user for this category as not showOnCategoryPage
    await TestResult.updateMany(
      { user: req.user._id, category: category._id },
      { showOnCategoryPage: false }
    );

    await req.user.save();

    req.flash("successOverlay", "Tvé výsledky byly smazány.");
    res.status(200).redirect(`/category/${req.params.categoryId}`);
  }
);

//SECTIONS IN CATEGORY
//create new Section in Category
router.post(
  "/category/:categoryId/newSection",
  validateSection,
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    //create new Section and add it to Category
    let { name, isPremium, desc, jsonData } = req.body;
    //isPremium logic
    let isPremiumBoolean = false;
    if (isPremium === "premium") {
      isPremiumBoolean = true;
    }
    //create new section
    const newSection = new Section({
      name,
      categoryId: foundCategory._id,
      cards: [],
      questions: [],
      isPremium: isPremiumBoolean,
      shortDescription: desc,
      author: req.user._id,
    });
    const savedSection = await newSection.save();
    foundCategory.sections.push(savedSection._id);
    await foundCategory.save();

    //import cards and questions from JSON if JSON is provided
    if (jsonData) {
      let sectionData = JSON.parse(jsonData);
      //create cards
      for (let card of sectionData.cards) {
        let newCard = new Card({
          section: savedSection._id,
          pageA: card.pageA,
          pageB: card.pageB,
          categoryId: foundCategory._id,
          author: card.author,
          importedCardId: card._id,
        });
        let savedCard = await newCard.save();
        foundCategory.numOfCards++;
        savedSection.cards.push(savedCard._id);
      }
      //create questions
      for (let question of sectionData.questions) {
        let newQuestion = new Question({
          section: savedSection._id,
          category: foundCategory._id,
          categoryId: foundCategory._id,
          question: question.question,
          correctAnswers: [...question.correctAnswers],
          wrongAnswers: [...question.wrongAnswers],
          sourceCardForImport: question.sourceCard,
          author: question.author,
        });

        //find card with importedCardId equal to sourceCardForImport and save that card ID to question as sourceCard
        let foundCard = await Card.findOne({
          importedCardId: question.sourceCard,
        });
        if (foundCard) {
          newQuestion.sourceCard = foundCard._id;
        }

        let savedQuestion = await newQuestion.save();
        foundCategory.numOfQuestions++;
        savedSection.questions.push(savedQuestion._id);
      }
      await foundCategory.save();
      await savedSection.save();
    }

    req.flash("successOverlay", `Balíček ${savedSection.name} byl vytvořen.`);
    res.status(200).redirect(`/category/${savedSection.categoryId}`);
  })
);

//remove Section from Category and delete its Cards
router.delete(
  "/category/:categoryId/removeSection/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    const { categoryId, sectionId } = req.params;
    //delete Section ID from Category
    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    //remove sections from category array
    let updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId },
      { $pull: { sections: sectionId } }
    );
    if (!updatedCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    //delete Cards in Section
    await Card.deleteMany({ section: sectionId });
    //delete Questions in Section
    await Question.deleteMany({ section: sectionId });
    //delete Section
    const deletedSection = await Section.findByIdAndDelete(sectionId);
    const foundCategory = await Category.findById(categoryId);
    foundCategory.numOfCards =
      foundCategory.numOfCards - deletedSection.cards.length;
    foundCategory.numOfQuestions =
      foundCategory.numOfQuestions - deletedSection.questions.length;
    await foundCategory.save();

    //flash a redirect
    req.flash("successOverlay", "Balíček byl odstraněn.");
    res.status(200).redirect(`/category/${categoryId}`);
  })
);

//edit section RENDER
router.get(
  "/category/:categoryId/editSection/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    const foundSection = await Section.findById(req.params.sectionId);
    const foundCategory = await Category.findById(categoryId).populate(
      "sections"
    );
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Kategorie s tímto označením neexistuje");
    }
    res.render("sections/edit", {
      section: foundSection,
      category: foundCategory,
    });
  })
);

//edit section UPDATE
router.put(
  "/category/:categoryId/editSection/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    let { name, desc } = req.body;
    foundSection.name = name;
    foundSection.shortDescription = desc;
    await foundSection.save();
    req.flash("successOverlay", "Informace byly aktualizovány.");
    res
      .status(201)
      .redirect(
        `/category/${req.params.category}/editSection/${req.params.sectionId}`
      );
  })
);

//changing order of the sections
//UP
router.get(
  "/category/:categoryId/sectionUp/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { sectionId, categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    if (foundCategory.sections.includes(sectionId)) {
      let fromIndex = foundCategory.sections.indexOf(sectionId);
      if (fromIndex !== 0) {
        let toIndex = fromIndex--;
        let section = foundCategory.sections.splice(fromIndex, 1)[0];
        foundCategory.sections.splice(toIndex, 0, section);
        await foundCategory.save();
      }
    }
    res.status(200).redirect(`/category/${categoryId}`);
  })
);
//DOWN
router.get(
  "/category/:categoryId/sectionDown/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { sectionId, categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Kategorie s tímto názvem neexistuje");
    }
    if (foundCategory.sections.includes(sectionId)) {
      let fromIndex = foundCategory.sections.indexOf(sectionId);
      if (fromIndex < foundCategory.sections.length) {
        let toIndex = fromIndex++;
        let section = foundCategory.sections.splice(fromIndex, 1)[0];
        foundCategory.sections.splice(toIndex, 0, section);
        await foundCategory.save();
      }
    }
    res.status(200).redirect(`/category/${categoryId}`);
  })
);

//generate section data in JSON format based on sectionId
router.get(
  "/category/:categoryId/generateJSON/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const foundSection = await Section.findById(req.params.sectionId).populate(
      "cards questions"
    );
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }

    let sectionData = {
      cards: foundSection.cards,
      questions: foundSection.questions,
    };

    res.status(200).json(sectionData);
  })
);

module.exports = router;
