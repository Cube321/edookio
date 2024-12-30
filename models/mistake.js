const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MistakeSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  card: {
    type: Schema.Types.ObjectId,
    ref: "Card",
  },
  author: String,
  content: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Mistake", MistakeSchema);
