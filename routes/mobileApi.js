const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const TestResult = require("../models/testResult");
const CardsResult = require("../models/cardsResult");
const CardInfo = require("../models/cardInfo");
const Card = require("../models/card");
const Question = require("../models/question");
const User = require("../models/user");
const Feedback = require("../models/feedback");
const passport = require("passport");
const moment = require("moment");
const { PARTNERS } = require("../utils/partners");
const {
  validateCategoryApi,
  validateSectionApi,
  validateCardApi,
} = require("../utils/middleware");
const uuid = require("uuid");
const helpers = require("../utils/helpers");

router.get(
  "/mobileApi/getCategories",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const categories = await Category.find({ author: req.user._id });
    ///order categories by name alphabetically
    categories.sort((a, b) => {
      if (a.text.toLowerCase() < b.text.toLowerCase()) {
        return -1;
      } else {
        return 1;
      }
    });
    res.status(200).json(categories);
  })
);

router.get(
  "/mobileApi/getSharedCategories",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await req.user.populate("sharedCategories");

    let categories = req.user.sharedCategories;

    //order categories by name alphabetically
    categories.sort((a, b) => {
      if (a.text.toLowerCase() < b.text.toLowerCase()) {
        return -1;
      } else {
        return 1;
      }
    });

    res.status(200).json(categories);
  }
);

// GET SECTIONS FOR MOBILE (SHOW HOW MANY CARDS LEFT TO STUDY)
router.get(
  "/mobileApi/getSections",
  passport.authenticate("jwt", { session: false }),

  catchAsync(async (req, res) => {
    const { categoryId } = req.query;
    const { user } = req;

    // 1) Find category & populate sections (and their cards)
    //    so we can know how many cards each section has
    const category = await Category.findById(categoryId)
      .populate({
        path: "sections",
        populate: {
          path: "cards", // ensures section.cards is populated
        },
      })
      .lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    //check if user is author of the section
    let isUserAuthor = false;
    if (category.author && category.author.equals(user._id)) {
      isUserAuthor = true;
    }

    if (!category.sections || category.sections.length === 0) {
      let sections = [];
      return res.status(200).json({ sections, isUserAuthor });
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

    let knownInCategoryCount = 0;

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

      knownInCategoryCount += knownCount;

      // Compute how many are left
      const totalCards = cardIds.length;
      const leftToStudy = totalCards - knownCount;

      // Store on the section object so you can render in the mobile app
      category.sections[i].totalCards = totalCards;
      category.sections[i].knownCount = knownCount;
      category.sections[i].leftToStudy = leftToStudy;
    }

    let percentageOfKnownCards = Math.floor(
      (knownInCategoryCount / category.numOfCards) * 100
    );
    if (isNaN(percentageOfKnownCards)) {
      percentageOfKnownCards = 0;
    }

    //get last test result for each section (percentage) and make an average, if the section has no test result, count is as 0
    let totalTestPercentage = 0;
    let testResultsCount = 0;
    let averageTestPercentage = 0;
    let noQuestions = false;
    let proficiencyPercentage = 0;
    category.sections.forEach((section) => {
      if (section.lastTestResult) {
        totalTestPercentage += section.lastTestResult;
        testResultsCount++;
      } else {
        if (section.questions.length > 0) {
          totalTestPercentage += 0;
          testResultsCount++;
        }
      }
    });
    if (testResultsCount > 0) {
      averageTestPercentage = Math.round(
        totalTestPercentage / testResultsCount
      );
    } else {
      noQuestions = true;
    }

    if (!noQuestions) {
      proficiencyPercentage = Math.floor(
        (averageTestPercentage + percentageOfKnownCards) / 2
      );
    } else {
      proficiencyPercentage = percentageOfKnownCards;
    }

    if (category.numOfCards === 0 && category.numOfQuestions === 0) {
      proficiencyPercentage = 0;
    }

    // 5) Return the sections as JSON
    res.status(200).json({
      sections: category.sections,
      percentageOfKnownCards: proficiencyPercentage,
      isUserAuthor,
    });
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

    await helpers.registerAction(user, "cardSeen");

    const cardsSeenTotal = user.cardsSeen;
    const feedbackFormShown = user.feedbackFormShown;
    const isUserPremium = user.isPremium;

    //is user author of the section?
    let isUserAuthor = false;
    if (section.author.equals(user._id)) {
      isUserAuthor = true;
    }

    //go through all cards pageB and pageA content and after every <li> tag add bullet point (•)
    section.cards.forEach((card) => {
      card.pageB = card.pageB.replace(/<li>/g, "<li> • ");
      card.pageA = card.pageA.replace(/<li>/g, "<li> • ");
    });

    let randomPartner = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];

    let showBonus100Modal = false;
    if (user.bonus100shown === false && user.bonus100added === false) {
      showBonus100Modal = true;
    }

    await user.save();

    res.status(200).json({
      section,
      knowsAllCards,
      allCardsCount,
      cardsSeenTotal,
      feedbackFormShown,
      randomPartner,
      isUserPremium,
      isUserAuthor,
      showBonus100Modal,
    });
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
    await helpers.registerAction(user, "questionSeen");

    let questionsSeenThisMonth = user.questionsSeenThisMonth;
    let isUserPremium = user.isPremium;

    if (!user.isPremium && user.questionsSeenThisMonth > 50) {
      return res.status(200).json({ limitReached: true });
    }

    let randomPartner = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];

    let showBonus100Modal = false;
    if (user.bonus100shown === false && user.bonus100added === false) {
      showBonus100Modal = true;
    }

    let isUserAuthor = false;
    if (section.author.equals(user._id)) {
      isUserAuthor = true;
    }

    res.status(200).json({
      section,
      questionsSeenThisMonth,
      isUserPremium,
      randomPartner,
      showBonus100Modal,
      isUserAuthor,
    });
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
      await helpers.registerAction(user, "questionSeen");
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

    const foundCategory = await Category.findById(section.categoryId);
    if (!foundCategory) {
      console.log("Category not found");
      return res.status(404).json({ message: "Category not found" });
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
    let { categoryId } = req.body;
    const category = await Category.findById(categoryId).populate("sections");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
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
    let { categoryId } = req.body;
    const category = await Category.findById(categoryId).populate("sections");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
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

//RESET USER`S STATS FOR SECTION (POST)
router.post(
  "/mobileApi/resetPackageStats",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId, onlyCards } = req.body;

    //validate with mongoose ObjectID
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({ message: "Invalid sectionId" });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const cardIds = section.cards.map((card) => card._id);

    await CardInfo.deleteMany({
      user: req.user._id,
      card: { $in: cardIds },
    });

    if (!onlyCards) {
      //mark all testResults of this user for this section as not showOnCategoryPage
      await TestResult.updateMany(
        { user: req.user._id, section: section._id },
        { showOnCategoryPage: false }
      );
    }

    res.status(201).json({ message: "Section reset" });
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
    const foundCategory = await Category.findById(foundSection.categoryId);
    if (!foundCategory) {
      console.log("Category not found");
      return res.status(404).json({ message: "Category not found" });
    }

    //create new CardsResult
    const createdCardsResult = await CardsResult.create({
      user: user._id,
      category: foundCategory._id,
      section: sectionId,
      cardsType: "section",
      totalCards: cardsCount,
    });

    await user.save();
    res.status(201).json({ message: "Result created section added to user" });
  })
);

router.post(
  "/mobileApi/toggleDailyReminder",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let user = req.user;
    user.dailyActivityReminder = !user.dailyActivityReminder;
    await user.save();
    res.status(201).json({ message: "Daily reminder toggled" });
  })
);

router.get(
  "/mobileApi/getActivity",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    let testResults = await TestResult.find({ user: user._id }).populate(
      "section category"
    );
    let cardsResults = await CardsResult.find({ user: user._id }).populate(
      "section category"
    );

    // Convert documents to plain objects to allow adding new properties
    testResults = testResults.map((result) => result.toObject());
    cardsResults = cardsResults.map((result) => result.toObject());

    // Mark the results as tests or cards
    testResults.forEach((result) => {
      result.type = "test";
    });
    cardsResults.forEach((result) => {
      result.type = "cards";
    });

    let allResults = testResults.concat(cardsResults);

    // Sort the results by date descending
    allResults.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Add formattedDate and other computed properties
    allResults.forEach((result) => {
      let formatedDateDay = moment(result.date).locale("cs").format("l");
      let formatedDateHour = moment(result.date).locale("cs").format("LT");
      result.formattedDate = `${formatedDateDay} | ${formatedDateHour}`;

      if (result.type === "test") {
        result.totalQuestions =
          result.correct + result.incorrect + result.skipped;
        result.countTotal = result.totalQuestions;
      } else if (result.type === "cards") {
        result.countTotal = result.totalCards;
      }
    });

    res.status(200).json(allResults);
  })
);

//route to post a feedback on the app (POST)
router.post(
  "/mobileApi/sendFeedback",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { content } = req.body;
    let user = req.user;

    if (content) {
      let newFeedback = {
        content: content,
        author: user.email,
      };
      await Feedback.create(newFeedback);
    }

    user.feedbackFormShown = true;
    await user.save();

    res.status(201).json({ message: "Feedback form shown status saved" });
  })
);

//get leaderboard data
router.get(
  "/mobileApi/getLeaderboard",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let users = await User.find();

    //simpligy the user to only the necessary data
    users = users.map((user) => {
      return {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        nickname: user.nickname,
        cardsSeen: user.cardsSeen,
        questionsSeenTotal: user.questionsSeenTotal,
        cardsSeenThisMonth: user.cardsSeenThisMonth,
        questionsSeenThisMonth: user.questionsSeenThisMonth,
        actionsToday: user.actionsToday,
        dailyGoal: user.dailyGoal,
        isPremium: user.isPremium,
      };
    });

    let { order } = req.query;
    let { user } = req;

    if (!order) {
      order = "day";
    }

    users.forEach((user) => {
      user.pointsTotal = user.cardsSeen + user.questionsSeenTotal;
      user.pointsMonth = user.cardsSeenThisMonth + user.questionsSeenThisMonth;
      user.pointsToday = user.actionsToday;
    });

    let positionInArray = undefined;
    let isInTop = true;
    let topUsers = [];

    //check if the user is in the users array
    positionInArray = users.findIndex(
      (u) => u._id.toString() === user._id.toString()
    );

    if (order === "day") {
      users.sort(function (a, b) {
        return b.pointsToday - a.pointsToday;
      });
      //check if the user is in the users array
      positionInArray = users.findIndex(
        (u) => u._id.toString() === user._id.toString()
      );
      topUsers = users.slice(0, 10);
    } else if (order === "total") {
      users.sort(function (a, b) {
        return b.pointsTotal - a.pointsTotal;
      });
      //check if the user is in the users array
      positionInArray = users.findIndex(
        (u) => u._id.toString() === user._id.toString()
      );
      topUsers = users.slice(0, 50);
    } else {
      users.sort(function (a, b) {
        return b.pointsMonth - a.pointsMonth;
      });
      //check if the user is in the users array
      positionInArray = users.findIndex(
        (u) => u._id.toString() === user._id.toString()
      );
      topUsers = users.slice(0, 25);
    }

    //give nickname to each user that does not have any yet
    users.forEach((user) => {
      if (!user.nickname && user.firstname && user.lastname) {
        if (user.lastname.charAt(user.lastname.length - 1) === "á") {
          let firstPart = user.firstname.substring(0, 3);
          let lastPart = user.lastname.substring(0, 3);
          user.nickname = `${firstPart}${lastPart}${Math.round(
            user.email.length / 2
          )}`;
        } else {
          let firstPart = user.firstname.substring(0, 3);
          let lastPart = user.lastname.substring(0, 3);
          user.nickname = `${firstPart}${lastPart}${Math.round(
            user.email.length / 2
          )}`;
        }
      }
    });
    let hasSavedNickname = true;
    if (!user.nickname) {
      let firstPart = user.firstname.substring(0, 3);
      let lastPart = user.lastname.substring(0, 3);
      user.nickname = `${firstPart}${lastPart}${Math.round(
        user.email.length / 2
      )}`;
      hasSavedNickname = false;
    }

    //create current user object with only the necessary data
    let currentUser = {
      _id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      nickname: user.nickname,
      cardsSeen: user.cardsSeen,
      questionsSeenTotal: user.questionsSeenTotal,
      cardsSeenThisMonth: user.cardsSeenThisMonth,
      questionsSeenThisMonth: user.questionsSeenThisMonth,
      actionsToday: user.actionsToday,
      dailyGoal: user.dailyGoal,
      pointsTotal: user.cardsSeen + user.questionsSeenTotal,
      pointsMonth: user.cardsSeenThisMonth + user.questionsSeenThisMonth,
      pointsToday: user.actionsToday,
      isPremium: user.isPremium,
    };

    //check if currentUser is in the topUsers based on _id using for loop
    for (let i = 0; i < topUsers.length; i++) {
      if (topUsers[i]._id.toString() === user._id.toString()) {
        isInTop = true;
        break;
      } else {
        isInTop = false;
      }
    }

    console.log("Is in top: ", isInTop);

    const leaderboardData = {
      topUsers,
      positionInArray,
      isInTop,
      order,
      hasSavedNickname,
      user: currentUser,
    };

    res.status(200).json(leaderboardData);
  })
);

//get one partner of PARTNERS array
router.get(
  "/mobileApi/getPartner",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    const partner = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];
    res.status(200).json(partner);
  })
);

//get required mobile version for app (ios and android)
router.get(
  "/mobileApi/getVersionInfo",
  catchAsync(async (req, res) => {
    const { platform } = req.query;
    const minimumVersion = {
      ios: "1.0.0",
      android: "1.0.0",
    };
    const latestVersions = {
      ios: "1.0.0",
      android: "1.0.0",
    };
    const updateUrl = {
      ios: "https://apps.apple.com/us/app/edookio/id6740498818",
      android:
        "https://play.google.com/store/apps/details?id=com.edookio.edookio",
    };
    const response = {
      minimumVersion: minimumVersion[platform],
      latestVersion: latestVersions[platform],
      updateUrl: updateUrl[platform],
      messageForUserRequiredUpdate:
        "Aktualizujte prosím aplikaci na nejnovější verzi, ve které nově budete mít možnost ukládat výsledky testů a sledovat svůj pokrok.",
      messageForUserRecommendedUpdate:
        "Máte starší verzi aplikace. Doporučujeme aktualizovat na nejnovější verzi.",
    };
    res.status(200).json(response);
  })
);

//add shared category to user
router.post(
  "/mobileApi/addSharedSubject",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { shareId } = req.body;

      const category = await Category.findOne({ shareId });

      if (!category) {
        return res.status(404).json({ message: "Předmět nenalezen." });
      }

      if (category.isDemo) {
        return res
          .status(404)
          .json({ message: "Tento předmět je demo, nelze jej sdílet." });
      }

      if (req.user.createdCategories.includes(category._id)) {
        return res.status(404).json({ message: "Tento předmět jsi vytvořil." });
      }
      if (req.user.sharedCategories.includes(category._id)) {
        return res.status(404).json({ message: "Tento předmět již máš." });
      }
      req.user.sharedCategories.push(category._id);
      await req.user.save();
      console.log("Předmět byl přidán.");
      res.status(200).json({ message: "Předmět byl přidán." });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Předmět se nepodařilo přidat" });
    }
  }
);

//=======================================================
//CONTENT MANIPULATION
//=======================================================

//create new category
router.post(
  "/mobileApi/createCategory",
  validateCategoryApi,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let { text } = req.body;

      let shareId = uuid.v4().slice(0, 6);
      //check if the shareId is unique
      let categoryWithShareId = await Category.findOne({ share: shareId });
      while (categoryWithShareId) {
        shareId = uuid.v4().slice(0, 6);
        categoryWithShareId = await Category.findOne({ share: shareId });
      }
      let user = req.user;

      let icon = "subject_1.png";

      const newCategory = new Category({
        sections: [],
        text,
        icon,
        author: req.user._id,
        shareId,
      });
      let savedCategory = await newCategory.save();

      user.createdCategories.push(savedCategory._id);
      await user.save();
      helpers.incrementEventCount("inAppCreatedCategory");

      res.status(201).json(newCategory);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Předmět se nepodařilo přidat" });
    }
  }
);

//create new section
router.post(
  "/mobileApi/createPackage",
  validateSectionApi,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let { name, categoryId } = req.body;
      let { user } = req;

      if (!name || !categoryId) {
        return res
          .status(400)
          .json({ error: "Název balíčku a ID předmětu jsou povinné" });
      }

      const newSection = new Section({
        name,
        categoryId,
        author: user._id,
        isPublic: true,
        isAccesible: true,
        testIsPublic: true,
      });
      let savedSection = await newSection.save();

      const foundCategory = await Category.findById(categoryId);

      if (!foundCategory) {
        return res.status(404).json({ message: "Předmět nenalezen" });
      }

      foundCategory.sections.push(savedSection._id);
      await foundCategory.save();
      helpers.incrementEventCount("inAppCreatedSection");

      res.status(201).json(savedSection);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Balíček se nepodařilo přidat" });
    }
  }
);

// create new card
router.post(
  "/mobileApi/createCard",
  passport.authenticate("jwt", { session: false }),
  validateCardApi,
  async (req, res) => {
    try {
      let { sectionId, pageA, pageB } = req.body;
      let { user } = req;

      if (!sectionId || !pageA || !pageB) {
        return res.status(400).json({
          error: "ID balíčku a obě strany kartičky jsou povinné",
        });
      }

      const foundSection = await Section.findById(sectionId);

      if (!foundSection) {
        return res.status(404).json({ message: "Balíček nenalezen" });
      }

      //check if user is author of the section
      if (!foundSection.author.equals(user._id)) {
        return res
          .status(403)
          .json({ message: "Přidat kartičku může pouze autor balíčku" });
      }

      const foundCategory = await Category.findById(foundSection.categoryId);

      if (!foundCategory) {
        return res.status(404).json({ message: "Předmět nenalezen" });
      }

      const newCard = new Card({
        section: sectionId,
        categoryId: foundCategory._id,
        pageA,
        pageB,
        author: user._id,
      });
      let savedCard = await newCard.save();

      foundCategory.numOfCards++;
      await foundCategory.save();

      foundSection.cards.push(savedCard._id);
      await foundSection.save();
      helpers.incrementEventCount("inAppCreatedCard");

      res.status(201).json(savedCard);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Kartičku se nepodařilo přidat" });
    }
  }
);

//createQuestion
router.post(
  "/mobileApi/createQuestion",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log("Creating question");
      let {
        sectionId,
        question,
        correctAnswer,
        incorrectAnswer1,
        incorrectAnswer2,
      } = req.body;
      let { user } = req;

      if (
        !sectionId ||
        !question ||
        !correctAnswer ||
        !incorrectAnswer1 ||
        !incorrectAnswer2
      ) {
        return res.status(400).json({
          error: "ID balíčku a všechny odpovědi jsou povinné",
        });
      }

      const foundSection = await Section.findById(sectionId);

      if (!foundSection) {
        return res.status(404).json({ message: "Balíček nenalezen" });
      }

      //check if user is author of the section
      if (!foundSection.author.equals(user._id)) {
        return res
          .status(403)
          .json({ message: "Přidat otázku může pouze autor balíčku" });
      }

      const foundCategory = await Category.findById(foundSection.categoryId);

      if (!foundCategory) {
        return res.status(404).json({ message: "Předmět nenalezen" });
      }

      const newQuestion = new Question({
        section: sectionId,
        categoryId: foundCategory._id,
        category: foundCategory._id,
        question,
        correctAnswers: [correctAnswer],
        wrongAnswers: [incorrectAnswer1, incorrectAnswer2],
        author: user._id,
      });
      let savedQuestion = await newQuestion.save();

      foundCategory.numOfQuestions++;
      await foundCategory.save();

      foundSection.questions.push(savedQuestion._id);
      await foundSection.save();
      helpers.incrementEventCount("inAppCreatedQuestion");

      res.status(201).json(savedQuestion);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Otázku se nepodařilo přidat" });
    }
  }
);

//delete card
router.post(
  "/mobileApi/deleteCard",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { cardId } = req.body;
    let { user } = req;

    //check if is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ message: "Neplatné ID kartičky" });
    }

    const foundCard = await Card.findById(cardId);

    if (!foundCard) {
      return res.status(404).json({ message: "Kartička nenalezena" });
    }

    const foundSection = await Section.findById(foundCard.section);

    if (!foundSection) {
      return res.status(404).json({ message: "Balíček nenalezen" });
    }

    const foundCategory = await Category.findById(foundSection.categoryId);

    if (!foundCategory) {
      return res.status(404).json({ message: "Předmět nenalezen" });
    }

    if (!foundCard.author.equals(user._id)) {
      return res.status(403).json({ message: "Nemáte oprávnění" });
    }

    await Card.findByIdAndDelete(cardId);

    foundSection.cards = foundSection.cards.filter(
      (card) => !card.equals(cardId)
    );
    await foundSection.save();

    //delete cardInfo for this card
    await CardInfo.deleteMany({ card: cardId });

    foundCategory.numOfCards--;
    await foundCategory.save();
    helpers.incrementEventCount("inAppDeletedCard");

    console.log("Kartička smazána");
    res.status(201).json({ message: "Kartička smazána" });
  }
);

//delete question
router.post(
  "/mobileApi/deleteQuestion",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { questionId } = req.body;
    let { user } = req;

    //check if is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Neplatné ID otázky" });
    }

    const foundQuestion = await Question.findById(questionId);

    if (!foundQuestion) {
      return res.status(404).json({ message: "Otázka nenalezena" });
    }

    const foundSection = await Section.findById(foundQuestion.section);

    if (!foundSection) {
      return res.status(404).json({ message: "Balíček nenalezen" });
    }

    const foundCategory = await Category.findById(foundSection.categoryId);

    if (!foundCategory) {
      return res.status(404).json({ message: "Předmět nenalezen" });
    }

    if (foundQuestion.author && !foundQuestion.author.equals(user._id)) {
      return res.status(403).json({ message: "Nemáte oprávnění" });
    }

    await Question.findByIdAndDelete(questionId);

    foundSection.questions = foundSection.questions.filter(
      (question) => !question.equals(questionId)
    );
    await foundSection.save();

    foundCategory.numOfQuestions--;
    await foundCategory.save();
    helpers.incrementEventCount("inAppDeletedQuestion");

    console.log("Otázka smazána");
    res.status(201).json({ message: "Otázka smazána" });
  }
);

//add credits to user
router.post(
  "/mobileApi/addCredits",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let { amount, code } = req.body;
    let { user } = req;

    if (!amount) {
      return res.status(400).json({ message: "Počet kreditů je povinný" });
    }

    if (code) {
      if (code === "start_bonus_100" && !user.bonus100added) {
        user.bonus100added = true;
        user.extraCredits += amount;
        console.log("Kredity byly připsány (BONUS100)" + user.email);
        await user.save();
        helpers.incrementEventCount("bonus100addedApp");
        return res
          .status(201)
          .json({ message: "Kredity byly připsány (BONUS100)" });
      }
    }
    res.status(201).json({ message: "Kredity nebyly připsány" });
  }
);

module.exports = router;
