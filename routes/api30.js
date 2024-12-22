const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const CardInfo = require("../models/cardInfo");
const moment = require("moment");
const { isLoggedIn } = require("../utils/middleware");

//API ROUTES FOR SHOW CARDS
//get Cards of Section
router.get(
  "/api/getCards/section/:sectionId",
  catchAsync(async (req, res) => {
    let { sectionId } = req.params;
    let foundSection = await Section.findById(sectionId).populate("cards");
    if (!foundSection) {
      return res.status(404).send({ error: "Section not found" });
    }
    let cards = foundSection.cards;

    //DEMO MODE
    let demoCardsSeen = 0;
    if (!res.user && !req.session.demoCardsSeen) {
      req.session.demoCardsSeen = 1;
      demoCardsSeen = 1;
    } else if (!req.user) {
      req.session.demoCardsSeen++;
      demoCardsSeen = req.session.demoCardsSeen;
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
      demoCardsSeen,
    });
    res.status(200).send(resData);
  })
);

//get only cards the user does not know or has not seen yet
router.get(
  "/api/getCardsUnknown/section/:sectionId",
  catchAsync(async (req, res) => {
    let { sectionId } = req.params;
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
    }
    // ---------------------------------------------------
    // End of known-cards filtering
    // ---------------------------------------------------

    if (cards.length === 0) {
      cards = foundSection.cards;
    }

    //DEMO MODE
    let demoCardsSeen = 0;
    if (!res.user && !req.session.demoCardsSeen) {
      req.session.demoCardsSeen = 1;
      demoCardsSeen = 1;
    } else if (!req.user) {
      req.session.demoCardsSeen++;
      demoCardsSeen = req.session.demoCardsSeen;
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
      demoCardsSeen,
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
    let { user } = req;
    let isPremiumUser = req.user.isPremium;
    let cards = await getRandomCards(categoryId, isPremiumUser);

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

async function getRandomCards(categoryId, isUserPremium) {
  let foundCategory = await Category.findById(categoryId);
  let sections = await Section.find({ category: foundCategory.name }).populate(
    "cards"
  );
  let publishedCards = [];
  sections.forEach((section) => {
    if (section.isPublic) {
      if (!section.isPremium || (section.isPremium && isUserPremium)) {
        publishedCards.push(...section.cards);
      }
    }
  });
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(publishedCards);
  let final20cards = publishedCards.slice(0, 20);
  return final20cards;
}

//update last seen Card of Section
router.post(
  "/api/updateLastSeenCard/section/:sectionId/:cardNum",
  catchAsync(async (req, res) => {
    let { sectionId, cardNum } = req.params;
    //DEMO MODE
    let demoCardsSeen = 0;
    if (!req.user) {
      req.session.demoCardsSeen++;
      demoCardsSeen = req.session.demoCardsSeen;
    }

    if (req.user) {
      let user = req.user;

      //count new actions only every two seconds
      let now = moment();
      if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
        //update date of user's last activity
        user.lastActive = moment();
        //increase cardSeen by 1
        user.cardsSeen++;
        user.cardsSeenThisMonth++;
        user.actionsToday++;
        if (user.actionsToday === user.dailyGoal) {
          user.streakLength++;
          user.dailyGoalReachedToday = true;
        }
      }

      await user.save();
    }
    res.status(201).send({ demoCardsSeen });
  })
);

//update Card counter on User (only for shuffle - probably)
router.post(
  "/api/updateUsersCardsCounters",
  catchAsync(async (req, res) => {
    let user = req.user;
    let now = moment();
    //count new actions only every two seconds
    if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
      //update date of user's last activity
      user.lastActive = moment();
      //increase cardSeen by 1
      user.cardsSeen++;
      user.cardsSeenThisMonth++;
      user.actionsToday++;
      if (user.actionsToday === user.dailyGoal) {
        user.streakLength++;
        user.dailyGoalReachedToday = true;
      }
      await user.save();
    }
    res.sendStatus(201);
  })
);

//API ROUTES FOR QUESTIONS
//get Questions of Section
router.get(
  "/api/getQuestions/section/:sectionId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { sectionId } = req.params;
    if (sectionId !== "random_test") {
      let foundSection = await Section.findById(sectionId).populate(
        "questions"
      );
      if (!foundSection) {
        return res.status(404).send({ error: "Section not found" });
      }
      const resData = JSON.stringify({
        questions: foundSection.questions,
      });
      res.status(200).send(resData);
    } else {
      let { category } = req.query;
      let isUserPremium = req.user.isPremium;
      let randomQuestions = await getRandomQuestions(category, isUserPremium);
      const resData = JSON.stringify({
        questions: randomQuestions,
      });
      res.status(200).send(resData);
    }
  })
);

async function getRandomQuestions(cat, isUserPremium) {
  let foundCategory = await Category.findOne({ name: cat });
  let sections = await Section.find({ category: foundCategory.name }).populate(
    "questions"
  );
  let publishedQuestions = [];
  sections.forEach((section) => {
    if (section.testIsPublic) {
      if (!section.isPremium || (section.isPremium && isUserPremium)) {
        publishedQuestions.push(...section.questions);
      }
    }
  });
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap array[i] and array[j]
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  shuffleArray(publishedQuestions);
  let final20questions = publishedQuestions.slice(0, 20);
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
        user.lastActive = moment();
        user.questionsSeenThisMonth++;
        user.questionsSeenTotal++;
        user.actionsToday++;
        if (user.actionsToday === user.dailyGoal) {
          user.streakLength++;
          user.dailyGoalReachedToday = true;
        }
        await user.save();
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
    let { sectionId } = req.params;
    let { type } = req.query;
    let { text } = req.body;
    let section = await Section.findById(sectionId);
    if (type === "cards") {
      section.feedbackCards.unshift(text);
    }
    if (type === "questions") {
      section.feedbackQuestions.unshift(text);
    }
    await section.save();
    res.sendStatus(201);
  })
);

//ROUTE /api/appAnnouced
router.post(
  "/api/appAnnounced",
  catchAsync(async (req, res) => {
    let { user } = req;
    user.appAnnouncementModalShown = true;
    await user.save();
    res.sendStatus(200);
  })
);

//ROUTE /api/cards30ExplanationModalShown
router.post(
  "/api/card30Explained",
  catchAsync(async (req, res) => {
    console.log("card30Explained route running");
    let { user } = req;
    user.card30ExplanationModalShown = true;
    await user.save();
    res.sendStatus(200);
  })
);

module.exports = router;
