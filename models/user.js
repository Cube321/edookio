const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordJWT: String,
  nickname: {
    type: String,
    default: undefined,
  },
  faculty: {
    type: String,
    default: "Neuvedeno",
  },
  source: {
    type: String,
    default: "neuvedeno",
  },
  admin: {
    type: Boolean,
    default: false,
  },
  isEditor: {
    type: Boolean,
    default: false,
  },
  sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  unfinishedSections: Array,
  finishedQuestions: Array,
  dateOfRegistration: {
    type: Date,
  },
  lastActive: {
    type: Date,
  },
  passChangeId: {
    type: String,
  },
  cardsSeen: {
    type: Number,
    default: 0,
  },
  cardsSeenThisMonth: {
    type: Number,
    default: 0,
  },
  questionsSeenThisMonth: {
    type: Number,
    default: 0,
  },
  questionsSeenTotal: {
    type: Number,
    default: 0,
  },
  actionsToday: {
    type: Number,
    default: 0,
  },
  streakLength: {
    type: Number,
    default: 0,
  },
  hasUnsubscribedFromStreak: {
    type: Boolean,
    default: false,
  },
  reachedQuestionsLimitDate: {
    type: Date,
    default: null,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  isFirstSave: {
    type: Boolean,
    default: true,
  },
  premiumGrantedByAdmin: {
    type: Boolean,
    default: false,
  },
  billingId: String,
  invoices: Array,
  invoicesDbObjects: [{ type: Schema.Types.ObjectId, ref: "Invoice" }],
  hasOpenInvoice: {
    type: Boolean,
    default: false,
  },
  openInvoiceData: {},
  plan: {
    type: String,
    enum: ["none", "yearly", "monthly", "halfyear", "daily"],
    default: "none",
  },
  endDate: { type: Date, default: null },
  subscriptionSource: {
    type: String,
    default: "none",
  },
  isGdprApproved: {
    type: Boolean,
    default: false,
  },
  justSubscribed: { type: Boolean, default: true },
  premiumDateOfActivation: { type: Date, default: null },
  premiumDateOfUpdate: { type: Date, default: null },
  premiumDateOfCancelation: { type: Date, default: null },
  hasUnsubscribed: {
    type: Boolean,
    default: false,
  },
  xmasDiscount: { type: Boolean, default: false },
  savedCards: [{ type: Schema.Types.ObjectId, ref: "Card" }],
  cookies: {
    type: Object,
    default: {
      technical: true,
      analytical: true,
      marketing: true,
    },
  },
  appAnnouncementModalShown: {
    type: Boolean,
    default: false,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
