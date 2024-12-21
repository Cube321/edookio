const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Card = require("../models/card");
const CardInfo = require("../models/cardInfo");
const passport = require("passport");

//WEB
router.post("/api/markCardKnown/:cardId", async (req, res) => {
  try {
    if (req.user) {
      const { cardId } = req.params;
      const { known } = req.body;

      await Card.findById(cardId);

      console.log("cardId", cardId);
      console.log("known", known);

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

        await Card.findById(cardId);

        console.log("cardId", cardId);
        console.log("known", known);

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
