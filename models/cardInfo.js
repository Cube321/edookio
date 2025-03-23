// models/cardInfo.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardInfoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: "Card",
    required: true,
  },
  known: {
    type: Boolean,
    default: false,
  },
  // --- New fields for spaced repetition ---
  lastReviewed: {
    type: Date,
  },
  nextReview: {
    type: Date,
  },
  interval: {
    type: Number,
    default: 1, // measured in days by default
  },
  repetitionCount: {
    type: Number,
    default: 0,
  },
  easeFactor: {
    type: Number,
    default: 2.5,
  },
});

module.exports = mongoose.model("CardInfo", cardInfoSchema);
