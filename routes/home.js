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

//SHOW HOMEPAGE + helper
router.get(
  "/",
  isPremiumUser,
  catchAsync(async (req, res) => {
    // Disable caching for this route:
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");

    //measure marketing campaign event count
    const { campaign } = req.query;
    if (campaign) {
      await helpers.incrementEventCount(`marketingCampaign-${campaign}`);
      req.session.campaign = campaign;
    }

    const { user } = req;

    //no user - render index (landing page)
    if (!user) {
      let { generatedSectionId, generatedCategoryId, generatedContentDate } =
        req.session;
      const { shareId } = req.query;

      let sharedCategory = await Category.findOne({ shareId });

      if (generatedContentDate) {
        let now = new Date();
        let generatedDate = new Date(generatedContentDate);
        //if the generated content was generated yesterday or earlier, delete it
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

      /*
      if (!req.session.landingPageVariant) {
        await helpers.incrementEventCount("landingPageLoadedCounter");

        landingPageLoadedCounter = await helpers.getEventCount(
          "landingPageLoadedCounter"
        );

        //A/B testing
        if (landingPageLoadedCounter % 2 === 0) {
          renderPage = "index";
          req.session.landingPageVariant = "A";
        } else {
          renderPage = "indexB";
          req.session.landingPageVariant = "B";
        }
      } else {
        if (req.session.landingPageVariant === "A") {
          renderPage = "index";
        } else {
          renderPage = "indexB";
        }
      }
      */

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

    //user - render home page
    const userWithPopulatedCreatedCategories = await user.populate(
      "createdCategories sharedCategories"
    );
    const categories = userWithPopulatedCreatedCategories.createdCategories;
    let numOfCategories = categories.length;
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

    //order categories by name alphabetically
    categories.sort((a, b) => {
      if (a.text.toLowerCase() < b.text.toLowerCase()) {
        return -1;
      } else {
        return 1;
      }
    });

    //order shared categories by name alphabetically
    user.sharedCategories.sort((a, b) => {
      if (a.text.toLowerCase() < b.text.toLowerCase()) {
        return -1;
      } else {
        return 1;
      }
    });

    res.status(200).render("home", {
      categories,
      sharedCategories: user.sharedCategories,
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
