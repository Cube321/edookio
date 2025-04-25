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
const helpers = require("../utils/helpers");
const TestResult = require("../models/testResult");
const CardInfo = require("../models/cardInfo");

//SHOW HOMEPAGE + helper
router.get(
  "/",
  isPremiumUser,
  catchAsync(async (req, res) => {
    // Disable caching for this route:
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    // 1) Measure marketing campaign event count
    const { campaign } = req.query;
    if (campaign) {
      await helpers.incrementEventCount(`marketingCampaign-${campaign}`);
      req.session.campaign = campaign;
    }

    const { user } = req;

    // ------------------------------------------------------------------
    // 2) If NO USER => Render landing page (same logic as your old route)
    // ------------------------------------------------------------------
    if (!user) {
      let { generatedSectionId, generatedCategoryId, generatedContentDate } =
        req.session;
      const { shareId } = req.query;

      let sharedCategory = await Category.findOne({ shareId });

      if (generatedContentDate) {
        let now = new Date();
        let generatedDate = new Date(generatedContentDate);
        // If the generated content was generated yesterday or earlier, clear it
        if (now.getDate() !== generatedDate.getDate()) {
          delete req.session.generatedSectionId;
          delete req.session.generatedCategoryId;
          delete req.session.generatedContentDate;
          generatedCategoryId = null;
          generatedSectionId = null;
          generatedContentDate = null;
        }
      }

      let renderPage = "index";

      // (If you still have the A/B testing logic for "indexB", keep or remove at will)

      const categories = [];
      let numOfCategories = 0;
      const numOfCards = 0;
      const numOfQuestions = 0;
      const numOfSections = 0;
      let percent = 0;

      return res.status(200).render(renderPage, {
        categories,
        numOfCards,
        numOfQuestions,
        numOfSections,
        numOfCategories,
        percent,
        generatedSectionId,
        generatedCategoryId,
        demoSectionId: process.env.DEMO_SECTION_ID,
        demoCategoryId: process.env.DEMO_CATEGORY_ID,
        shareId,
        sharedCategory,
      });
    }

    // ----------------------------------------------------------
    // 3) LOGGED IN => Render the user’s “home” + proficiency data
    // ----------------------------------------------------------

    // 3A) Basic counts
    const allCategories = await Category.find({});
    const numOfCategories = allCategories.length;
    const numOfCards = await Card.countDocuments();
    const numOfQuestions = await Question.countDocuments();
    const numOfSections = await Section.countDocuments();

    // 3B) Daily goal percent
    let percent = 0;
    if (user) {
      const { dailyGoal = 0, actionsToday = 0 } = user;
      if (dailyGoal > 0) {
        percent = Math.round((actionsToday / dailyGoal) * 100);
        if (percent > 100) percent = 100;
      }
    }

    // 3C) Fetch and populate user’s categories
    await user.populate(["createdCategories", "sharedCategories"]);
    let categories = user.createdCategories || [];
    let sharedCategories = user.sharedCategories || [];

    // 3E) (Optional) Sort categories by orderNum or name
    sortByOrderNum(categories);
    sortByOrderNum(sharedCategories);

    // 3F) Finally render “home”
    return res.status(200).render("home", {
      categories,
      sharedCategories,
      numOfCategories,
      numOfCards,
      numOfQuestions,
      numOfSections,
      percent,
      // If you need “icons” or other data from your old snippet, include here:
      icons,
    });
  })
);

// Sort helper
function sortByOrderNum(array) {
  array.sort((a, b) => a.orderNum - b.orderNum);
  return array;
}

//SHOW PREMIUM PAGE
//premium explanation page
router.get("/premium", (req, res) => {
  let stripeEnv = process.env.STRIPE_ENV;

  if (req.user && req.user.billingIssue) {
    console.log("User has active subscription");
    req.flash(
      "error",
      "Stále máte aktivní předplatné aktivované přes mobilní aplikaci, ale došlo k problému s platbou. Doporučujeme zrušit předplatné v mobilní aplikaci (App Store, Google Play) a aktivovat jej znovu přes web."
    );
    return res.redirect("/auth/user/profile");
  }

  res.status(200).render("premium", { stripeEnv });
});

//SHOW CREDITS SHOP PAGE
router.get("/credits", (req, res) => {
  let stripeEnv = process.env.STRIPE_ENV;
  res.status(200).render("credits", { stripeEnv });
});

//SHOW ABOUT page
/*router.get('/about', catchAsync(async(req, res) => {
  res.status(200).render('about');
}))*/

module.exports = router;
