const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  connectedQuestionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  pageA: String,
  pageB: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section",
  },
  importedCardId: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Card", CardSchema);
