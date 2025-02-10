const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobEventSchema = new Schema({
  name: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  sectionSize: {
    type: Number,
  },
  cardsPerPage: {
    type: Number,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  extractedTextLength: {
    type: Number,
  },
  extractedTextPages: {
    type: Number,
  },
  expectedCredits: {
    type: Number,
  },
  actualCredits: {
    type: Number,
  },
  cardsCreated: {
    type: Number,
  },
  questionsCreated: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
  },
  finishedSuccessfully: {
    type: Boolean,
  },
  errorMessage: {
    type: String,
  },
  isPremium: {
    type: Boolean,
  },
  expectedTimeInSeconds: {
    type: Number,
  },
});

module.exports = mongoose.model("JobEventSchema", jobEventSchema);
