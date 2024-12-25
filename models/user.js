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
  isEmailVerified: {
    type: Boolean,
    default: true,
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
  registrationPlatform: {
    type: String,
    default: "web",
  },
  usedMobileApp: {
    type: Boolean,
    default: false,
  },
  appNotificationsAllowed: {
    type: Boolean,
    default: false,
  },
  expoPushToken: {
    type: String,
    default: null,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  isEditor: {
    type: Boolean,
    default: false,
  },
  finishedQuestions: Array,
  dateOfRegistration: {
    type: Date,
  },
  infoEmailSent: {
    type: Boolean,
    default: false,
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
  dailyGoal: {
    type: Number,
    default: 10,
  },
  dailyGoalReachedToday: {
    type: Boolean,
    default: false,
  },
  streakLength: {
    type: Number,
    default: 0,
  },
  generatedCardsCounterTotal: {
    type: Number,
    default: 0,
  },
  generatedQuestionsCounterTotal: {
    type: Number,
    default: 0,
  },
  generatedCardsCounterMonth: {
    type: Number,
    default: 0,
  },
  generatedQuestionsCounterMonth: {
    type: Number,
    default: 0,
  },
  credits: {
    type: Number,
    default: 0,
  },
  usedCreditsMonth: {
    type: Number,
    default: 0,
  },
  lastJobCredits: {
    type: Number,
    default: 0,
  },
  usedCreditsTotal: {
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
  subscriptionPrice: {
    type: Number,
    default: 0,
  },
  monthlySubscriptionPrice: {
    type: Number,
    default: 0,
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
  card30ExplanationModalShown: {
    type: Boolean,
    default: false,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
