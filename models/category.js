const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  numOfCards: {
    type: Number,
    default: 0,
  },
  numOfQuestions: {
    type: Number,
    default: 0,
  },
  text: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Category", CategorySchema);
