const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  numOfCards: {
    type: Number,
    default: 0,
  },
  numOfQuestions: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
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
  shareId: {
    type: String,
    default: "",
  },
  deepSharingAllowed: {
    type: Boolean,
    default: true,
  },
  removedByAuthor: {
    type: Boolean,
    default: false,
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  createdByTeacher: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Category", CategorySchema);
