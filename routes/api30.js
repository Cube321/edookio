const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const mongoose = require("mongoose");
const sanitizeHtml = require("sanitize-html");
const moment = require("moment");
const { isLoggedIn } = require("../utils/middleware");
const helpers = require("../utils/helpers");

//API ROUTES FOR SHOW CARDS
//get Cards of Section
router.get(
  "/api/getCards/section/:sectionId",
  catchAsync(async (req, res) => {
    let { sectionId } = req.params;

    //sanitize
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).send({ error: "Invalid section ID" });
    }

    let foundSection = await Section.findById(sectionId).populate("cards");
    if (!foundSection) {
      return res.status(404).send({ error: "Section not found" });
    }
    let cards = foundSection.cards;

    //is user and is premium
    let user = "none";
    if (req.user) {
      user = req.user;
    }

    //mark saved cards if user is logged in
    if (req.user) {
      let markedCards = [];
      cards.forEach((card) => {
        newCard = {
          _id: card._id,
          category: card.category,
          pageA: card.pageA,
          pageB: card.pageB,
          author: card.author,
          section: card.section,
        };
        if (req.user.savedCards.indexOf(newCard._id) > -1) {
          newCard.isSaved = true;
        }
        markedCards.push(newCard);
      });
      cards = markedCards;
      await helpers.registerAction(req.user, "cardSeen");
    }
    const resData = JSON.stringify({
      cards,
      user,
      startAt: 0,
    });
    res.status(200).send(resData);
  })
);

//get only cards the user does not know or has not seen yet
router.get(
  "/api/getCardsUnknown/section/:sectionId",
  catchAsync(async (req, res) => {
    let { sectionId } = req.params;

    //sanitize
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).send({ error: "Invalid section ID" });
    }

    let foundSection = await Section.findById(sectionId).populate("cards");
    if (!foundSection) {
      return res.status(404).send({ error: "Section not found" });
    }
    let cards = foundSection.cards;

    // ---------------------------------------------------
    // 1) If the user is logged in, filter out known cards
    // ---------------------------------------------------
    if (req.user) {
      // Import CardInfo
      const CardInfo = require("../models/cardInfo");

      // Get all cardIds from this section
      const cardIds = cards.map((card) => card._id);

      // Find which of those cards the user marked as known
      const knownCards = await CardInfo.find({
        user: req.user._id,
        card: { $in: cardIds },
        known: true,
      });

      // Create a Set of known card IDs (for fast lookup)
      const knownCardIds = new Set(knownCards.map((c) => c.card.toString()));

      // Filter out known cards
      cards = cards.filter((card) => !knownCardIds.has(card._id.toString()));
      await helpers.registerAction(req.user, "cardSeen");
    }
    // ---------------------------------------------------
    // End of known-cards filtering
    // ---------------------------------------------------

    let knowsAllCards = false;

    if (cards.length === 0) {
      cards = foundSection.cards;
      knowsAllCards = true;
    }

    //is user and is premium
    let user = "none";
    if (req.user) {
      user = req.user;
    }

    //mark saved cards if user is logged in
    if (req.user) {
      let markedCards = [];
      cards.forEach((card) => {
        newCard = {
          _id: card._id,
          category: card.category,
          pageA: card.pageA,
          pageB: card.pageB,
          author: card.author,
          section: card.section,
        };
        if (req.user.savedCards.indexOf(newCard._id) > -1) {
          newCard.isSaved = true;
        }
        markedCards.push(newCard);
      });
      cards = markedCards;
    }
    const resData = JSON.stringify({
      cards,
      user,
      startAt: 0,
      knowsAllCards,
    });
    res.status(200).send(resData);
  })
);

//get random Cards of Category
router.get(
  "/api/getRandomCards/category/:categoryId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { categoryId } = req.params;

    //sanitize
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).send({ error: "Invalid category ID" });
    }

    let { user } = req;
    let cards = await getRandomCards(categoryId);

    //mark saved cards
    let markedCards = [];
    cards.forEach((card) => {
      newCard = {
        _id: card._id,
        category: card.category,
        pageA: card.pageA,
        pageB: card.pageB,
        author: card.author,
        section: card.section,
      };
      if (req.user.savedCards.indexOf(newCard._id) > -1) {
        newCard.isSaved = true;
      }
      markedCards.push(newCard);
    });
    cards = markedCards;

    const resData = JSON.stringify({
      cards,
      user,
    });
    res.status(200).send(resData);
  })
);

async function getRandomCards(categoryId) {
  let foundCategory = await Category.findById(categoryId);
  let sections = await Section.find({ categoryId: foundCategory._id }).populate(
    "cards"
  );
  let allCards = [];
  sections.forEach((section) => {
    allCards.push(...section.cards);
  });
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(allCards);
  let final20cards = allCards.slice(0, 20);
  return final20cards;
}

//update Card counter on User (only for shuffle - probably)
router.post(
  "/api/updateUsersCardsCounters",
  catchAsync(async (req, res) => {
    let user = req.user;
    let now = moment();
    //count new actions only every two seconds
    if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
      await helpers.registerAction(user, "cardSeen");
    }
    res.sendStatus(201);
  })
);

//API ROUTES FOR QUESTIONS
//get Questions of Section
router.get(
  "/api/getQuestions/section/:sectionId",
  catchAsync(async (req, res) => {
    let { sectionId } = req.params;

    if (sectionId !== "random_test") {
      //sanitize
      if (!mongoose.Types.ObjectId.isValid(sectionId)) {
        return res.status(400).send({ error: "Invalid section ID" });
      }

      let foundSection = await Section.findById(sectionId).populate({
        path: "questions",
        populate: {
          path: "sourceCard",
        },
      });

      if (!foundSection) {
        return res.status(404).send({ error: "Section not found" });
      }

      const resData = JSON.stringify({
        questions: foundSection.questions,
      });

      res.status(200).send(resData);
    } else {
      let { category } = req.query;
      let randomQuestions = await getRandomQuestions(category);
      const resData = JSON.stringify({
        questions: randomQuestions,
      });

      res.status(200).send(resData);
    }
  })
);

async function getRandomQuestions(categoryId) {
  let sections = await Section.find({ categoryId: categoryId }).populate({
    path: "questions",
    populate: {
      path: "sourceCard",
    },
  });
  let allQuestions = [];
  sections.forEach((section) => {
    allQuestions.push(...section.questions);
  });
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(allQuestions);
  let final20questions = allQuestions.slice(0, 20);
  return final20questions;
}

//update counters for questions on User
router.post(
  "/api/updateUsersQuestionsCounters",
  isLoggedIn,
  catchAsync(async (req, res) => {
    if (req.user) {
      let user = req.user;
      let now = moment();
      //count new actions only every two seconds
      if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
        await helpers.registerAction(user, "questionSeen");
      }
      res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
  })
);

//API ROUTES FOR RATING
router.post(
  "/api/updateRating/section/:sectionId/:ratingValue",
  catchAsync(async (req, res) => {
    let { sectionId, ratingValue } = req.params;
    let { type } = req.query;

    //sanitize
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).send({ error: "Invalid section ID" });
    }

    // Validate ratingValue
    const parsedRatingValue = Number(ratingValue);
    if (
      isNaN(parsedRatingValue) ||
      parsedRatingValue < 1 ||
      parsedRatingValue > 5
    ) {
      return res.status(400).send({
        error: "Invalid rating value. It must be a number between 1 and 5.",
      });
    }

    // Validate type
    if (!type || !["cards", "questions"].includes(type)) {
      return res
        .status(400)
        .send({ error: "Invalid type. Must be 'cards' or 'questions'." });
    }

    let section = await Section.findById(sectionId);
    if (type === "cards") {
      section.votesAmountCards++;
      section.votesValueCards = section.votesValueCards + Number(ratingValue);
      section.ratingCards = (
        section.votesValueCards / section.votesAmountCards
      ).toFixed(2);
    }
    if (type === "questions") {
      section.votesAmountQuestions++;
      section.votesValueQuestions =
        section.votesValueQuestions + Number(ratingValue);
      section.ratingQuestions = (
        section.votesValueQuestions / section.votesAmountQuestions
      ).toFixed(2);
    }
    await section.save();
    res.sendStatus(201);
  })
);

router.post(
  "/api/saveFeedback/section/:sectionId/",
  catchAsync(async (req, res) => {
    const { sectionId } = req.params;
    const { type } = req.query;
    let { text } = req.body;

    // Validate sectionId
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).send({ error: "Invalid section ID" });
    }

    // Validate type
    if (!type || !["cards", "questions"].includes(type)) {
      return res
        .status(400)
        .send({ error: "Invalid type. Must be 'cards' or 'questions'." });
    }

    // Validate and sanitize feedback text
    if (!text || typeof text !== "string") {
      return res
        .status(400)
        .send({ error: "Feedback text is required and must be a string." });
    }
    text = sanitizeHtml(text, {
      allowedTags: [], // Remove all HTML tags
      allowedAttributes: {}, // Remove all attributes
    });

    // Find section
    let section;
    try {
      section = await Section.findById(sectionId);
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Database error occurred while finding the section." });
    }
    if (!section) {
      return res.status(404).send({ error: "Section not found." });
    }

    // Save feedback
    if (type === "cards") {
      section.feedbackCards.unshift(text);
    } else if (type === "questions") {
      section.feedbackQuestions.unshift(text);
    }

    try {
      await section.save();
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Failed to save feedback to the section." });
    }

    res.status(201).send({ message: "Feedback saved successfully." });
  })
);

//ROUTE /api/appAnnouced
router.post(
  "/api/appAnnounced",
  catchAsync(async (req, res) => {
    const { user } = req;

    // Avoid unnecessary database updates
    if (!user.appAnnouncementModalShown) {
      user.appAnnouncementModalShown = true;

      try {
        await user.save();
      } catch (error) {
        return res.status(500).send({ error: "Failed to update user data" });
      }
    }

    // Send success response
    res
      .status(200)
      .send({ message: "App announcement status updated successfully" });
  })
);

//ROUTE /api/cards30ExplanationModalShown
router.post(
  "/api/card30Explained",
  catchAsync(async (req, res) => {
    let { user } = req;
    if (user) {
      user.card30ExplanationModalShown = true;
      await user.save();
    } else {
      req.session.explainThumbsModalShown = true;
    }
    res.sendStatus(200);
  })
);

//markUser api30
router.post("/api/markUser", isLoggedIn, async (req, res) => {
  try {
    const { action } = req.body;
    const { user } = req;

    if (action === "bonus100shown") {
      user.bonus100shown = true;
      user.bonus100added = true;
      user.credits += 100;
      console.log(
        "Adding 100 credits and marking user as bonus100shown (webApi):",
        user.email
      );
      helpers.incrementEventCount("bonus100addedWeb");
    }

    if (action === "bonus500shown") {
      user.bonus500shown = true;
      console.log("Marking user as bonus500shown (webApi):", user.email);
    }

    await user.save();
    return res.status(200).json({ message: "User marked" });
  } catch (error) {
    console.log("Error saving bonus500Shown:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
