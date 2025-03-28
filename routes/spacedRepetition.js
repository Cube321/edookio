const express = require("express");
const moment = require("moment");
const mongoose = require("mongoose");
const router = express.Router();
const Card = require("../models/card");
const CardInfo = require("../models/cardInfo");
const passport = require("passport");
const { isLoggedIn } = require("../utils/middleware");
const helpers = require("../utils/helpers");

//WEB
router.post("/api/markCardKnown/:cardId", isLoggedIn, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "No user." });
    }
    const { cardId } = req.params;
    const { known, mode } = req.body;

    // Make sure the card exists (not strictly required if you trust client)
    await Card.findById(cardId);

    // Find or create a CardInfo document
    let cardInfo = await CardInfo.findOne({
      user: req.user._id,
      card: cardId,
    });

    if (!cardInfo) {
      cardInfo = new CardInfo({ user: req.user._id, card: cardId });
    }

    // =============== SPACED REPETITION UPDATE ===============
    updateSRSFields(cardInfo, known);
    // =============== END SPACED REPETITION UPDATE ===============

    // Save updated card info
    await cardInfo.save();

    // Now do your existing logic, e.g. register actions, update user, etc.
    let user = req.user;
    if (mode !== "question") {
      let now = moment();
      if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
        await helpers.registerAction(user, "cardSeen");
      }
    }
    await user.save();

    return res.status(200).json({ success: true, known: cardInfo.known });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false, error: err.message });
  }
});

//MOBILE
router.post(
  "/mobileApi/markCardKnown/:cardId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // 1) Check user
      if (!req.user) {
        return res.status(401).json({ success: false, error: "No user." });
      }
      const { cardId } = req.params;
      const { known, mode } = req.body;

      // 2) Ensure the card exists
      await Card.findById(cardId);

      // 3) Find or create the CardInfo document
      let cardInfo = await CardInfo.findOne({
        user: req.user._id,
        card: cardId,
      });
      if (!cardInfo) {
        cardInfo = new CardInfo({ user: req.user._id, card: cardId });
      }

      // =============== SPACED REPETITION UPDATE ===============
      updateSRSFields(cardInfo, known);
      // =============== END SPACED REPETITION UPDATE ===============

      // 4) Save updated CardInfo
      await cardInfo.save();

      // 5) Existing logic: record user action
      let user = req.user;
      if (mode !== "question") {
        const now = moment();
        if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
          await helpers.registerAction(user, "cardSeen");
        }
      }
      await user.save();

      return res.status(200).json({ success: true, known: cardInfo.known });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ success: false, error: err.message });
    }
  }
);

// Helper function for spaced repetition logic
function updateSRSFields(cardInfo, known) {
  const now = new Date();

  // Update lastReviewed every time
  cardInfo.lastReviewed = now;

  if (known) {
    // user says "I know this card"
    cardInfo.known = true;
    cardInfo.repetitionCount = (cardInfo.repetitionCount || 0) + 1;

    // easeFactor goes up slightly if correct
    // ensure it doesn't blow up too high
    cardInfo.easeFactor = Math.min((cardInfo.easeFactor || 2.5) + 0.1, 3.0);

    // simpler logic for interval
    if (cardInfo.repetitionCount === 1) {
      cardInfo.interval = 1;
    } else if (cardInfo.repetitionCount === 2) {
      cardInfo.interval = 3;
    } else {
      cardInfo.interval = Math.round(
        (cardInfo.interval || 1) * cardInfo.easeFactor
      );
    }
  } else {
    // user says "I do NOT know this card"
    cardInfo.known = false;
    cardInfo.repetitionCount = 0;

    // reduce ease factor, but keep a sensible lower bound
    cardInfo.easeFactor = Math.max((cardInfo.easeFactor || 2.5) - 0.2, 1.3);

    // reset interval so we see it again soon
    cardInfo.interval = 0;
  }

  // Next review date = now + interval days
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + cardInfo.interval);
  nextReviewDate.setHours(0, 1, 0, 0); // 00:01 AM
  cardInfo.nextReview = nextReviewDate;
}

async function updateCardInfos() {
  try {
    await CardInfo.updateMany(
      {
        known: true,
        $or: [
          { nextReview: { $exists: false } },
          { interval: { $exists: false } },
          { easeFactor: { $exists: false } },
          { repetitionCount: { $exists: false } },
        ],
      },
      {
        $set: {
          interval: 1,
          easeFactor: 2.5,
          repetitionCount: 1,
          nextReview: new Date(new Date().setHours(0, 1, 0, 0)), // today at 00:01
        },
      }
    );
    console.log("Updated CardInfo documents.");
  } catch (err) {
    console.error(err);
  }
}

updateCardInfos();

module.exports = router;
