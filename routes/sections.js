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
  validateSection,
  isCategoryAuthor,
} = require("../utils/middleware");

//SECTIONS IN CATEGORY
//create new Section in Category
router.post(
  "/category/:categoryId/newSection",
  validateSection,
  isLoggedIn,
  isCategoryAuthor,
  catchAsync(async (req, res, next) => {
    const { categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    //create new Section and add it to Category
    let { name } = req.body;
    const user = req.user;

    let createdByTeacher = false;
    if (user && user.isTeacher) {
      createdByTeacher = true;
    }
    //create new section
    const newSection = new Section({
      name,
      categoryId: foundCategory._id,
      cards: [],
      questions: [],
      author: req.user._id,
      createdByTeacher,
    });
    const savedSection = await newSection.save();
    foundCategory.sections.push(savedSection._id);
    await foundCategory.save();

    req.flash("successOverlay", `Balíček ${savedSection.name} byl vytvořen.`);
    res.status(200).redirect(`/category/${savedSection.categoryId}`);
  })
);

//remove Section from Category and delete its Cards
router.delete(
  "/category/:categoryId/removeSection/:sectionId",
  isLoggedIn,
  isCategoryAuthor,
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

    let cardsLength = deletedSection.cards?.length || 0;
    let questionsLength = deletedSection.questions?.length || 0;

    foundCategory.numOfCards = foundCategory.numOfCards - cardsLength;
    foundCategory.numOfQuestions =
      foundCategory.numOfQuestions - questionsLength;
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
  isCategoryAuthor,
  catchAsync(async (req, res) => {
    const { categoryId } = req.params;

    //sanitize categoryId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw Error("Nesprávný formát ID předmětu");
    }

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
  isCategoryAuthor,
  catchAsync(async (req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    let { name } = req.body;
    foundSection.name = name;
    await foundSection.save();
    req.flash("successOverlay", "Informace byly aktualizovány.");
    res.status(201).redirect(`/category/${req.params.categoryId}`);
  })
);

//generate section data in JSON format based on sectionId
router.get(
  "/category/:categoryId/generateJSON/:sectionId",
  isLoggedIn,
  isCategoryAuthor,
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

//reset cards and questions of a particular section for a user
router.get(
  "/category/:categoryId/resetSection/:sectionId",
  isLoggedIn,
  async (req, res) => {
    const { categoryId, sectionId } = req.params;

    //validate with mongoose ObjectID
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      req.flash("error", "Předmět neexistuje (nesprávný formát ID).");
      res.redirect(`/`);
    }

    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      req.flash("error", "Balíček neexistuje (nesprávný formát ID).");
      res.redirect(`/category/${categoryId}`);
    }

    const category = await Category.findById(categoryId).populate("sections");
    if (!category) {
      req.flash("error", "Předmět neexistuje.");
      return res.status(404).redirect("/");
    }

    const section = category.sections.find(
      (section) => section._id.toString() === sectionId
    );

    if (!section) {
      req.flash("error", "Balíček neexistuje.");
      return res.status(404).redirect(`/category/${categoryId}`);
    }

    const cardIds = section.cards.map((card) => card._id);

    await CardInfo.deleteMany({
      user: req.user._id,
      card: { $in: cardIds },
    });

    //mark all testResults of this user for this category as not showOnCategoryPage
    await TestResult.updateMany(
      { user: req.user._id, category: category._id, section: section._id },
      { showOnCategoryPage: false }
    );

    req.flash("successOverlay", "Statistiky balíčku byly smazány");
    res.status(200).redirect(`/category/${categoryId}`);
  }
);

//push section in category up (move it up in the array)
router.get(
  "/category/:categoryId/pushSectionUp/:sectionId",
  isLoggedIn,
  isCategoryAuthor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    //find index of section in category
    const index = foundCategory.sections.indexOf(sectionId);
    if (index > 0) {
      //swap sections
      const temp = foundCategory.sections[index - 1];
      foundCategory.sections[index - 1] = foundCategory.sections[index];
      foundCategory.sections[index] = temp;
      await foundCategory.save();
    }
    req.flash("successOverlay", "Balíček byl přesunut nahoru.");
    res.status(200).redirect(`/category/${categoryId}`);
  })
);

//push section in category down (move it down in the array)
router.get(
  "/category/:categoryId/pushSectionDown/:sectionId",
  isLoggedIn,
  isCategoryAuthor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    //find index of section in category
    const index = foundCategory.sections.indexOf(sectionId);
    if (index < foundCategory.sections.length - 1) {
      //swap sections
      const temp = foundCategory.sections[index + 1];
      foundCategory.sections[index + 1] = foundCategory.sections[index];
      foundCategory.sections[index] = temp;
      await foundCategory.save();
    }
    req.flash("successOverlay", "Balíček byl přesunut dolů.");
    res.status(200).redirect(`/category/${categoryId}`);
  })
);

module.exports = router;
