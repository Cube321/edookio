const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardsResultSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section",
    required: false, // Optional for random tests
  },
  cardsType: {
    type: String,
    enum: ["section", "random"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalCards: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("CardsResult", cardsResultSchema);
