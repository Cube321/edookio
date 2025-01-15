const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Category = require("../models/category");
const CardInfo = require("../models/cardInfo");
const TestResult = require("../models/testResult");
const icons = require("../utils/icons");
const mongoose = require("mongoose");
const { isLoggedIn } = require("../utils/middleware");

//CATEGORIES ADMIN VIEW
//list all categorie ADMIN + helper
router.get(
  "/category/dashboard",
  isLoggedIn,
  catchAsync(async (req, res) => {
    //get all categories
    let categories = await Category.find({ author: req.user._id });
    //render view
    res.render("categories/categories", { categories, icons });
  })
);

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
  catchAsync(async (req, res, next) => {
    let { text, icon } = req.body;
    let user = req.user;
    const newCategory = new Category({
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
    res.status(201).redirect(`/`);
  })
);

//edit Category - update in the DB
router.put(
  "/category/edit/:categoryId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { categoryId } = req.params;
    let { text, icon } = req.body;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Předmět nebyl nalezen.");
      return res.redirect("/category/dashboard");
    }
    await Category.findByIdAndUpdate(categoryId, { text, icon });
    req.flash("successOverlay", "Změny byly uloženy.");
    res.status(201).redirect(`/category/dashboard`);
  })
);

//remove Category - delete from DB
router.delete(
  "/category/remove/:categoryId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Kategorie nebyla nalezena.");
      return res.redirect("/category/dashboard");
    }
    //delete all sections in the category
    for (let section of foundCategory.sections) {
      await Section.findByIdAndDelete(section);
    }
    //delete the category
    await Category.findByIdAndDelete(categoryId);
    req.flash("successOverlay", "Předmět byl odstraněn.");
    res.status(200).redirect("/category/dashboard");
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

module.exports = router;
