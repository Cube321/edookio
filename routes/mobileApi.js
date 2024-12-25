const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const TestResult = require("../models/testResult");
const CardsResult = require("../models/cardsResult");
const CardInfo = require("../models/cardInfo");
const passport = require("passport");
const moment = require("moment");

router.get(
  "/mobileApi/getCategories",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const categories = await Category.find();
    sortByOrderNum(categories);
    const letFilteredCategories = categories.filter((cat) => cat.orderNum >= 0);
    res.status(200).json(letFilteredCategories);
  })
);

// GET SECTIONS FOR MOBILE (SHOW HOW MANY CARDS LEFT TO STUDY)
router.get(
  "/mobileApi/getSections",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const { categoryName } = req.query;
    const { user } = req;

    // 1) Find category & populate sections (and their cards)
    //    so we can know how many cards each section has
    const category = await Category.findOne({ name: categoryName })
      .populate({
        path: "sections",
        populate: {
          path: "cards", // ensures section.cards is populated
        },
      })
      .lean();

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // 2) Build a map of the latest test results for each section
    let testResultsMap = {};
    const testResults = await TestResult.find({
      user: user._id,
      category: category._id,
    }).sort({ date: -1 });

    testResults.forEach((result) => {
      if (!testResultsMap[result.section]) {
        testResultsMap[result.section] = result;
      }
    });

    // 3) For each section, attach test results, premium accessibility, etc.
    for (let i = 0; i < category.sections.length; i++) {
      const section = category.sections[i];

      // Add last test result (if available)
      if (
        testResultsMap[section._id] &&
        testResultsMap[section._id].showOnCategoryPage
      ) {
        category.sections[i].lastTestResult =
          testResultsMap[section._id].percentage;
      }

      // Mark as accessible or not (depending on user's premium status)
      if (!user.isPremium && section.isPremium) {
        category.sections[i].isAccesible = false;
      } else {
        category.sections[i].isAccesible = true;
      }
    }

    // 4) Count "left to study" for each section
    //    (how many cards the user hasn't marked as known = true)
    for (let i = 0; i < category.sections.length; i++) {
      const section = category.sections[i];

      // If this section has no cards or is not accessible, skip counting
      if (!section.cards || !section.cards.length || !section.isAccesible) {
        category.sections[i].leftToStudy = section.cards?.length || 0;
        continue;
      }

      const cardIds = section.cards.map((card) => card._id);

      // Count how many are known
      const knownCount = await CardInfo.countDocuments({
        user: user._id,
        card: { $in: cardIds },
        known: true,
      });

      // Compute how many are left
      const totalCards = cardIds.length;
      const leftToStudy = totalCards - knownCount;

      // Store on the section object so you can render in the mobile app
      category.sections[i].totalCards = totalCards;
      category.sections[i].knownCount = knownCount;
      category.sections[i].leftToStudy = leftToStudy;
    }

    // 5) Return the sections as JSON
    res.status(200).json(category.sections);
  })
);

router.get(
  "/mobileApi/getCards",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId } = req.query;

    // 1) Find the requested section and populate its cards
    const section = await Section.findById(sectionId).populate("cards");
    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    // 2) If we want to exclude known cards, find them in CardInfo
    const allCardIds = section.cards.map((card) => card._id);
    const allCards = section.cards;
    const allCardsCount = allCards.length;
    let knowsAllCards = false;

    section.countStarted++;
    //WARNING: section.save has to be called before filtering cards otherwise the cards will be removed from the section
    await section.save();

    const { mode } = req.query;
    console.log("Mode: ", mode);
    if (mode === "unknown") {
      const knownCards = await CardInfo.find({
        user: req.user._id,
        card: { $in: allCardIds },
        known: true,
      });
      const knownCardIds = new Set(knownCards.map((c) => c.card.toString()));
      section.cards = section.cards.filter(
        (card) => !knownCardIds.has(card._id.toString())
      );
      if (section.cards.length === 0) {
        section.cards = allCards;
        knowsAllCards = true;
      }
    }

    //update date of user's last activity
    let user = req.user;
    user.lastActive = moment();
    //increase cardSeen by 1
    user.cardsSeen++;
    user.cardsSeenThisMonth++;
    user.actionsToday++;
    if (user.actionsToday === user.dailyGoal) {
      user.streakLength++;
      user.dailyGoalReachedToday = true;
    }

    await user.save();

    res.status(200).json({ section, knowsAllCards, allCardsCount });
  })
);

router.get(
  "/mobileApi/getQuestions",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId } = req.query;

    const section = await Section.findById(sectionId).populate({
      path: "questions",
      populate: {
        path: "sourceCard",
      },
    });

    section.countStartedTest++;
    await section.save();

    let user = req.user;
    //update date of user's last activity
    user.lastActive = moment();
    user.questionsSeenTotal++;
    user.questionsSeenThisMonth++;
    user.actionsToday++;
    if (user.actionsToday === user.dailyGoal) {
      user.streakLength++;
      user.dailyGoalReachedToday = true;
    }
    let questionsSeenThisMonth = user.questionsSeenThisMonth;
    let isUserPremium = user.isPremium;

    if (!user.isPremium && user.questionsSeenThisMonth > 50) {
      return res.status(200).json({ limitReached: true });
    }

    res.status(200).json({ section, questionsSeenThisMonth, isUserPremium });
  })
);

router.post(
  "/mobileApi/registerAction",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let user = req.user;

    //count new actions only every two seconds
    let now = moment();
    if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
      //update date of user's last activity
      user.lastActive = moment();
      user.questionsSeenTotal++;
      user.questionsSeenThisMonth++;
      user.actionsToday++;
      if (user.actionsToday === user.dailyGoal) {
        user.streakLength++;
        user.dailyGoalReachedToday = true;
      }
      await user.save();
    }
    res.status(200).json({ message: "Action registered" });
  })
);

//finished QUESTIONS - save to user's finishedQuestions route
router.post(
  "/mobileApi/saveToFinishedSections",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId, stats } = req.body;

    if (!sectionId || !stats) {
      return res
        .status(400)
        .json({ error: "sectionId and stats are required" });
    }

    //get categoryId based on sectionId
    const section = await Section.findById(sectionId);
    if (!section) {
      console.log("Section not found");
      return res.status(404).json({ error: "Section not found" });
    }

    const foundCategory = await Category.findOne({ name: section.category });
    if (!foundCategory) {
      console.log("Category not found");
      return res.status(404).json({ error: "Category not found" });
    }

    const { correct, wrong, skipped, totalQuestions } = stats;

    let user = req.user;
    let finishedQuestionsIndex = user.finishedQuestions.findIndex(
      (x) => x.toString() == sectionId.toString()
    );
    if (finishedQuestionsIndex < 0) {
      user.finishedQuestions.push(sectionId);
    }

    const percentage = Math.round((correct / totalQuestions) * 100);

    // Save the test result
    await TestResult.create({
      user: user._id,
      category: foundCategory._id,
      section: sectionId,
      testType: "section",
      score: { correct, wrong, skipped },
      percentage,
      totalQuestions,
    });

    console.log("Test result saved");

    //mark modified nested objects - otherwise Mongoose does not see it and save it
    user.markModified("finishedQuestions");
    await user.save();
    res.status(201).json({ message: "Finished section added to user" });
  })
);

//RESETING USER`S STATS (GET)
router.post(
  "/mobileApi/resetCards",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const category = await Category.findOne({
      name: req.body.categoryName,
    }).populate("sections");
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const cardIds = category.sections
      .map((section) => section.cards)
      .flat()
      .map((card) => card._id);

    await CardInfo.deleteMany({
      user: req.user._id,
      card: { $in: cardIds },
    });
    res.status(201).json({ message: "Cards reset" });
  })
);

router.post(
  "/mobileApi/resetQuestions",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const category = await Category.findOne({
      name: req.body.categoryName,
    }).populate("sections");
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    req.user.finishedQuestions = req.user.finishedQuestions.filter(
      (sectionId) =>
        !category.sections.map((section) => section._id).includes(sectionId)
    );

    //mark all testResults of this user for this category as not showOnCategoryPage
    await TestResult.updateMany(
      { user: req.user._id, category: category._id },
      { showOnCategoryPage: false }
    );

    await req.user.save();
    res.status(201).json({ message: "Questions reset" });
  }
);

//HELPERS
function sortByOrderNum(array) {
  // Use the Array.prototype.sort() method to sort the array
  array.sort((a, b) => a.orderNum - b.orderNum);
  // Return the sorted array
  return array;
}

function removeITags(str) {
  // Use regular expression to match <p> tags
  const regex = /<i>(.*?)<\/i>/g;

  // Replace <p> tags with <Text> tags
  return str.replace(regex, (match, p1) => {
    // p1 represents the content inside <p> tags
    return `${p1}`;
  });
}

//update last seen Card of Section
router.post(
  "/mobileApi/updateLastSeenCard",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId, cardNum } = req.body;

    if (req.user) {
      let user = req.user;

      //count new actions only every two seconds
      let now = moment();
      if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
        //update date of user's last activity
        user.lastActive = moment();
        //increase cardSeen by 1
        user.cardsSeen++;
        user.cardsSeenThisMonth++;
        user.actionsToday++;
        if (user.actionsToday === user.dailyGoal) {
          user.streakLength++;
          user.dailyGoalReachedToday = true;
        }
      }

      await user.save();
    }
    res.status(201).json({ message: "Last seen card updated" });
  })
);

router.post(
  "/mobileApi/createCardsResult",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId } = req.body;
    const { cardsCount } = req.body;
    let user = req.user;

    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      console.log("Section not found");
      return res.status(404).json({ error: "Section not found" });
    }
    const foundCategory = await Category.findOne({
      name: foundSection.category,
    });
    if (!foundCategory) {
      console.log("Category not found");
      return res.status(404).json({ error: "Category not found" });
    }

    //create new CardsResult
    const createdCardsResult = await CardsResult.create({
      user: user._id,
      category: foundCategory._id,
      section: sectionId,
      cardsType: "section",
      totalCards: cardsCount,
    });

    console.log("Cards result created:" + createdCardsResult);

    await user.save();
    res.status(201).json({ message: "Result created section added to user" });
  })
);

//get required mobile version for app (ios and android)
router.get(
  "/mobileApi/getVersionInfo",
  catchAsync(async (req, res) => {
    const { platform } = req.query;
    const minimumVersion = {
      ios: "1.0.15",
      android: "1.0.15",
    };
    const latestVersions = {
      ios: "1.0.15",
      android: "1.0.15",
    };
    const updateUrl = {
      ios: "https://apps.apple.com/us/app/inlege/id6670204630",
      android: "https://play.google.com/store/apps/details?id=cz.inlege.InLege",
    };
    const response = {
      minimumVersion: minimumVersion[platform],
      latestVersion: latestVersions[platform],
      updateUrl: updateUrl[platform],
      messageForUser:
        "Aktualizujte prosím aplikaci na nejnovější verzi, ve které nově budete mít možnost ukládat výsledky testů a sledovat svůj pokrok.",
    };
    res.status(200).json(response);
  })
);

module.exports = router;
