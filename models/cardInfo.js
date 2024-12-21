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
});

module.exports = mongoose.model("CardInfo", cardInfoSchema);
