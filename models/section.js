const mongoose = require("mongoose");
const { isAdmin } = require("../utils/middleware");
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  testIsPublic: {
    type: Boolean,
    default: false,
  },
  cards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  isPremium: {
    type: Boolean,
    default: false,
  },
  isAccesible: {
    type: Boolean,
    default: undefined,
  },
  isTestFinished: {
    type: Boolean,
    default: false,
  },
  lastSeenCard: {
    type: Number,
    default: 0,
  },
  lastTestResult: {
    type: Number,
    default: 0,
  },
  nextSection: {
    type: String,
    default: "",
  },
  previousSection: {
    type: String,
    default: "",
  },
  countStarted: {
    type: Number,
    default: 0,
  },
  countFinished: {
    type: Number,
    default: 0,
  },
  countStartedTest: {
    type: Number,
    default: 0,
  },
  countFinishedTest: {
    type: Number,
    default: 0,
  },
  feedbackCards: [],
  ratingCards: {
    type: Number,
    default: 0,
  },
  votesAmountCards: {
    type: Number,
    default: 0,
  },
  votesValueCards: {
    type: Number,
    default: 0,
  },
  feedbackQuestions: [],
  ratingQuestions: {
    type: Number,
    default: 0,
  },
  votesAmountQuestions: {
    type: Number,
    default: 0,
  },
  votesValueQuestions: {
    type: Number,
    default: 0,
  },
});

//write .post delete middleware (course, video 466) 14. 11. 2022

module.exports = mongoose.model("Section", SectionSchema);
