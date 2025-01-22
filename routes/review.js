const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Question = require("../models/question");
const Card = require("../models/card");
const Category = require("../models/category");
const { isLoggedIn, isSectionAuthor } = require("../utils/middleware");

//show content of the section
router.get(
  "/review/:sectionId/showAll",
  isLoggedIn,
  isSectionAuthor,
  catchAsync(async (req, res) => {
    const { sectionId } = req.params;

    const foundSection = await Section.findById(sectionId)
      .populate({
        path: "cards",
        populate: { path: "connectedQuestionId" },
      })
      .populate({
        path: "questions",
        populate: { path: "sourceCard" },
      })
      .populate("author");

    if (!foundSection) {
      req.flash("error", "Balíček nebyl nalezen");
      return res.redirect("/");
    }

    // 1) Build the main "pairs" array from cards
    const pairs = foundSection.cards.map((card) => {
      return {
        card,
        question: card.connectedQuestionId || null,
      };
    });

    // 2) Figure out which questions are “already paired”
    //    A question is paired if it's the connectedQuestionId of a card.
    const pairedQuestionIds = pairs
      .filter((p) => p.question !== null)
      .map((p) => p.question._id.toString());

    // 3) Find orphaned questions => those that are not in pairedQuestionIds
    const orphanedQuestions = foundSection.questions.filter(
      (q) => !pairedQuestionIds.includes(q._id.toString())
    );

    const user = req.user;

    //check if there is any card in the section without connected question
    let containesCardWithoutQuestion = false;
    const cardsWithoutQuestion = pairs.filter((p) => p.question === null);
    if (cardsWithoutQuestion.length > 0) {
      containesCardWithoutQuestion = true;
    }

    res.status(200).render("review/showAll", {
      section: foundSection,
      pairs,
      orphanedQuestions,
      categoryId: foundSection.categoryId,
      containesCardWithoutQuestion,
      demo: false,
      generatedCategoryId: req.session?.generatedCategoryId,
      generatedSectionId: req.session?.generatedSectionId,
    });
  })
);

//show demo content of the section
router.get(
  "/demo/:sectionId/showAll",
  catchAsync(async (req, res) => {
    const { sectionId } = req.params;

    const foundSection = await Section.findById(sectionId)
      .populate({
        path: "cards",
        populate: { path: "connectedQuestionId" },
      })
      .populate({
        path: "questions",
        populate: { path: "sourceCard" },
      })
      .populate("author");

    if (!foundSection) {
      req.flash("error", "Balíček nebyl nalezen");
      return res.redirect("/");
    }

    // 1) Build the main "pairs" array from cards
    const pairs = foundSection.cards.map((card) => {
      return {
        card,
        question: card.connectedQuestionId || null,
      };
    });

    // 2) Figure out which questions are “already paired”
    //    A question is paired if it's the connectedQuestionId of a card.
    const pairedQuestionIds = pairs
      .filter((p) => p.question !== null)
      .map((p) => p.question._id.toString());

    // 3) Find orphaned questions => those that are not in pairedQuestionIds
    const orphanedQuestions = foundSection.questions.filter(
      (q) => !pairedQuestionIds.includes(q._id.toString())
    );

    //check if there is any card in the section without connected question
    let containesCardWithoutQuestion = false;
    const cardsWithoutQuestion = pairs.filter((p) => p.question === null);
    if (cardsWithoutQuestion.length > 0) {
      containesCardWithoutQuestion = true;
    }

    res.status(200).render("review/showAll", {
      section: foundSection,
      pairs,
      orphanedQuestions,
      categoryId: foundSection.categoryId,
      containesCardWithoutQuestion,
      demo: true,
    });
  })
);

//delete question api
router.post(
  "/review/:sectionId/deleteQuestion/:questionId",
  isLoggedIn,
  isSectionAuthor,
  catchAsync(async (req, res) => {
    const { sectionId, questionId } = req.params;

    const foundSection = await Section.findById(sectionId);
    const foundQuestion = await Question.findById(questionId);

    if (!foundSection || !foundQuestion) {
      return res.status(404).json({ message: "Něco se nepovedlo" });
    }

    const foundCategory = await Category.findById(foundSection.categoryId);
    if (!foundCategory) {
      return res.status(404).json({ message: "Předmět nebyl nalezen" });
    }

    // 1) Remove the question from the section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { questions: questionId },
    });

    // 2) Remove the question from the database
    await Question.findByIdAndDelete(questionId);

    // 3) Remove the connected question from the card
    const foundCard = await Card.findOne({
      connectedQuestionId: questionId,
    });
    if (foundCard) {
      foundCard.connectedQuestionId = null;
      await foundCard.save();
    }

    //reduce number of questions in the category
    foundCategory.numOfQuestions -= 1;
    await foundCategory.save();

    res.status(200).json({ message: "Otázka byla odstraněna" });
  })
);

//delete card api
router.post(
  "/review/:sectionId/deleteCard/:cardId",
  isLoggedIn,
  isSectionAuthor,
  catchAsync(async (req, res) => {
    const { sectionId, cardId } = req.params;

    const foundSection = await Section.findById(sectionId);
    const foundCard = await Card.findById(cardId);

    if (!foundSection || !foundCard) {
      return res.status(404).json({ message: "Něco se nepovedlo" });
    }

    const foundCategory = await Category.findById(foundSection.categoryId);
    if (!foundCategory) {
      return res.status(404).json({ message: "Předmět nebyl nalezen" });
    }

    // 1) Remove the card from the section
    await Section.findByIdAndUpdate(sectionId, {
      $pull: { cards: cardId },
    });

    // 2) Remove the card from the database
    await Card.findByIdAndDelete(cardId);

    // 3) Remove the connected question from the card
    const foundQuestion = await Question.findOne({
      sourceCard: cardId,
    });
    if (foundQuestion) {
      foundQuestion.sourceCard = null;
      await foundQuestion.save();
    }

    //reduce number of cards in the category
    foundCategory.numOfCards -= 1;
    await foundCategory.save();

    res.status(200).json({ message: "Kartička byla odstraněna" });
  })
);

module.exports = router;
