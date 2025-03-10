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
    if (req.user) {
      const { cardId } = req.params;
      const { known } = req.body;
      const { mode } = req.body;

      await Card.findById(cardId);

      // Find or create a CardInfo document
      let cardInfo = await CardInfo.findOne({
        user: req.user._id,
        card: cardId,
      });

      if (!cardInfo) {
        cardInfo = new CardInfo({ user: req.user._id, card: cardId });
      }

      // Update the known status
      cardInfo.known = known;
      await cardInfo.save();

      let user = req.user;

      if (mode !== "question") {
        //count new actions only every two seconds
        let now = moment();
        if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
          await helpers.registerAction(user, "cardSeen");
        }
      }

      await user.save();

      return res.status(200).json({ success: true, known: cardInfo.known });
    } else {
      return res.status(401).json({ success: false, error: "No user." });
    }
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
      if (req.user) {
        const { cardId } = req.params;
        const { known } = req.body;
        const { mode } = req.body;

        await Card.findById(cardId);

        // Find or create a CardInfo document
        let cardInfo = await CardInfo.findOne({
          user: req.user._id,
          card: cardId,
        });

        if (!cardInfo) {
          cardInfo = new CardInfo({ user: req.user._id, card: cardId });
        }

        // Update the known status
        cardInfo.known = known;
        await cardInfo.save();

        let user = req.user;

        if (mode !== "question") {
          //count new actions only every two seconds
          let now = moment();
          if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
            await helpers.registerAction(user, "cardSeen");
          }
        }

        await user.save();

        return res.status(200).json({ success: true, known: cardInfo.known });
      } else {
        return res.status(401).json({ success: false, error: "No user." });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
