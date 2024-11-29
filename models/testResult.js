const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testResultSchema = new Schema({
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
  testType: {
    type: String,
    enum: ["section", "random"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  score: {
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
    skipped: { type: Number, default: 0 },
  },
  percentage: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("TestResult", testResultSchema);
