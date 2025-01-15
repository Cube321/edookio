const express = require("express");
const Category = require("../models/category");
const Card = require("../models/card");
const Question = require("../models/question");
const User = require("../models/user");
const Section = require("../models/section");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const icons = require("../utils/icons");
const { isPremiumUser } = require("../utils/middleware");

//SHOW HOMEPAGE + helper
router.get(
  "/",
  isPremiumUser,
  catchAsync(async (req, res) => {
    const { user } = req;

    //no user - render index (landing page)
    if (!user) {
      const categories = [];
      let numOfCategories = 0;
      const numOfCards = 0;
      const numOfQuestions = 0;
      const numOfSections = 0;
      let percent = 0;
      return res.status(200).render("index", {
        categories,
        numOfCards,
        numOfQuestions,
        numOfSections,
        numOfCategories,
        percent,
      });
    }

    //user - render home page
    const categories = await Category.find({ author: req.user._id });
    let numOfCategories = categories.length;
    const numOfCards = await Card.count();
    const numOfQuestions = await Question.count();
    const numOfSections = await Section.count();
    let percent = 0;

    //count how many percept of the dailyGoal has the user already seen today
    if (req.user) {
      let dailyGoal = req.user.dailyGoal;
      let actionsToday = req.user.actionsToday;
      percent = Math.round((actionsToday / dailyGoal) * 100);
      if (percent > 100) {
        percent = 100;
      }
    }
    res.status(200).render("home", {
      categories,
      sharedCategories: user.sharedCategories,
      numOfCards,
      numOfQuestions,
      numOfSections,
      numOfCategories,
      percent,
      icons,
    });
  })
);

//SHOW PREMIUM PAGE
//premium explanation page
router.get("/premium", (req, res) => {
  let stripeEnv = process.env.STRIPE_ENV;
  res.status(200).render("premium", { stripeEnv });
});

//SHOW ABOUT page
/*router.get('/about', catchAsync(async(req, res) => {
  res.status(200).render('about');
}))*/

//CLASH OF FACULTIES
router.get(
  "/soubojFakult",
  catchAsync(async (req, res) => {
    let totalSum = {};
    // Use the aggregation framework to sum up the numbers
    let prfukArray = await User.aggregate([
      { $match: { faculty: "PrF UK" } },
      { $group: { _id: null, total: { $sum: "$cardsSeen" } } },
    ]);
    totalSum.prfUk = prfukArray.length > 0 ? prfukArray[0].total : 0;

    let prfupArray = await User.aggregate([
      { $match: { faculty: "PrF UP" } },
      { $group: { _id: null, total: { $sum: "$cardsSeen" } } },
    ]);
    totalSum.prfUp = prfupArray.length > 0 ? prfupArray[0].total : 0;

    let prfmuniArray = await User.aggregate([
      { $match: { faculty: "PrF MUNI" } },
      { $group: { _id: null, total: { $sum: "$cardsSeen" } } },
    ]);
    totalSum.prfMuni = prfmuniArray.length > 0 ? prfmuniArray[0].total : 0;

    let prfzcuArray = await User.aggregate([
      { $match: { faculty: "PrF ZČU" } },
      { $group: { _id: null, total: { $sum: "$cardsSeen" } } },
    ]);
    totalSum.prfZcu = prfzcuArray.length > 0 ? prfzcuArray[0].total : 0;

    let prfjinaArray = await User.aggregate([
      { $match: { faculty: "Jiná" } },
      { $group: { _id: null, total: { $sum: "$cardsSeen" } } },
    ]);
    totalSum.prfJina = prfjinaArray.length > 0 ? prfjinaArray[0].total : 0;

    transformToPercent(totalSum);

    res.status(200).render("clash", {});
  })
);

function transformToPercent(totalSum) {
  let totalSumAll =
    totalSum.prfUk +
    totalSum.prfUp +
    totalSum.prfMuni +
    totalSum.prfZcu +
    totalSum.prfJina;
  // not finished
}

module.exports = router;
