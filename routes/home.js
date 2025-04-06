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

    // 3D) Compute proficiency (inspired by getSections approach) for each category
    categories = await computeProficiencyForCategories(categories, user);
    sharedCategories = await computeProficiencyForCategories(
      sharedCategories,
      user
    );

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

// -----------------------------------------------
// HELPER: Compute proficiency for an array of categories
// -----------------------------------------------
async function computeProficiencyForCategories(categories, user) {
  const userId = user._id;
  const now = new Date();

  // For each category, replicate the logic from your getSections route
  const output = [];
  for (let cat of categories) {
    // convert Mongoose doc -> plain JS object if needed
    let categoryObj = cat.toObject ? cat.toObject() : { ...cat };

    // 1) Populate sections (+ cards + questions if needed)
    //    So we can see how many cards and questions exist
    const populatedCategory = await Category.findById(categoryObj._id)
      .populate({
        path: "sections",
        populate: [
          { path: "cards" },
          { path: "questions" }, // if your Section model has a "questions" field
        ],
      })
      .lean();

    // If no sections, everything is 0
    if (
      !populatedCategory?.sections ||
      populatedCategory.sections.length === 0
    ) {
      categoryObj.averageTestPercentage = 0;
      categoryObj.percentageOfKnownCards = 0;
      categoryObj.proficiency = 0;
      output.push(categoryObj);
      continue;
    }

    // 2) Build a map of the *latest* testResult per section
    const testResults = await TestResult.find({
      user: userId,
      category: categoryObj._id,
    }).sort({ date: -1 });
    const testResultsMap = {};
    for (const tr of testResults) {
      if (!testResultsMap[tr.section]) {
        testResultsMap[tr.section] = tr;
      }
    }

    // 3) We'll sum up the lastTestResult for each section that has questions
    let totalTestPercentage = 0;
    let testResultsCount = 0;
    let knownInCategoryCount = 0;

    // 4) Known cards: we gather all card IDs for this category
    //    (No skipping for premium or isPublic)
    const allCardIds = [];
    for (const section of populatedCategory.sections) {
      if (section.cards && section.cards.length > 0) {
        const cardIds = section.cards.map((c) => c._id);
        allCardIds.push(...cardIds);
      }
    }

    // 5) Actually count how many are known (not overdue)
    const knownCount = await CardInfo.countDocuments({
      user: userId,
      card: { $in: allCardIds },
      known: true,
      nextReview: { $gt: now },
    });

    knownInCategoryCount = knownCount;

    // 6) For test average:
    //    If a section has a “lastTestResult” (with showOnCategoryPage), we add it
    //    If no test result but it has questions, we add 0 but increment testCount
    let anyQuestions = false;
    for (const section of populatedCategory.sections) {
      // If the section has questions, we consider it in our test average
      const hasQuestions = section.questions && section.questions.length > 0;
      if (hasQuestions) {
        anyQuestions = true;
        const lastTR = testResultsMap[section._id];
        if (lastTR && lastTR.showOnCategoryPage) {
          totalTestPercentage += lastTR.percentage;
        } else {
          // No test or showOnCategoryPage = false => count as 0
          totalTestPercentage += 0;
        }
        testResultsCount++;
      }
    }

    let averageTestPercentage = 0;
    let noQuestions = false;
    if (testResultsCount > 0) {
      averageTestPercentage = Math.round(
        totalTestPercentage / testResultsCount
      );
    } else {
      // Means none of the sections had questions at all
      noQuestions = !anyQuestions;
    }

    // 7) Known cards percentage
    const totalCardsInCategory = populatedCategory.numOfCards || 0;
    let percentageOfKnownCards = 0;
    if (totalCardsInCategory > 0) {
      percentageOfKnownCards = Math.floor(
        (knownInCategoryCount / totalCardsInCategory) * 100
      );
    }

    // 8) Combine the two into a “proficiency”
    let proficiency = 0;
    if (totalCardsInCategory === 0 && populatedCategory.numOfQuestions === 0) {
      // If no cards & no questions => 0
      proficiency = 0;
    } else if (noQuestions) {
      // If no test questions => just known-cards percentage
      proficiency = percentageOfKnownCards;
    } else {
      // Normal case => average of test result & known-cards
      proficiency = Math.floor(
        (averageTestPercentage + percentageOfKnownCards) / 2
      );
    }

    // 9) Attach the final stats
    categoryObj.averageTestPercentage = averageTestPercentage;
    categoryObj.percentageOfKnownCards = percentageOfKnownCards;
    categoryObj.proficiency = proficiency;

    output.push(categoryObj);
  }

  return output;
}

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
