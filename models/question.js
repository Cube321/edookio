const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section",
  },
  author: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  correctAnswers: [],
  wrongAnswers: [],
  sourceCard: {
    type: Schema.Types.ObjectId,
    ref: "Card",
  },
  sourceCardForImport: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
