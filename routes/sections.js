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
  isCategoryAuthor,
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
  isCategoryAuthor,
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

module.exports = router;
