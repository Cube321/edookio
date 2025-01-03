const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const TestResult = require("../models/testResult");
const CardsResult = require("../models/cardsResult");
const CardInfo = require("../models/cardInfo");
const User = require("../models/user");
const Mistake = require("../models/mistake");
const Feedback = require("../models/feedback");
const passport = require("passport");
const moment = require("moment");
const { PARTNERS } = require("../utils/partners");

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

    if (!category.sections || category.sections.length === 0) {
      let sections = [];
      return res.status(200).json(sections);
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
    category.sections.forEach((section) => {
      if (section.isPublic && section.testIsPublic) {
        if (section.lastTestResult) {
          totalTestPercentage += section.lastTestResult;
          testResultsCount++;
        } else {
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
      averageTestPercentage = 0;
    }

    let proficiencyPercetage = Math.floor(
      (averageTestPercentage + percentageOfKnownCards) / 2
    );

    // 5) Return the sections as JSON
    res.status(200).json({
      sections: category.sections,
      percentageOfKnownCards: proficiencyPercetage,
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
    user.lastActive = moment();
    //increase cardSeen by 1
    user.cardsSeen++;
    user.cardsSeenThisMonth++;
    user.actionsToday++;
    if (user.actionsToday === user.dailyGoal) {
      user.streakLength++;
      user.dailyGoalReachedToday = true;
    }

    const cardsSeenTotal = user.cardsSeen;
    const feedbackFormShown = user.feedbackFormShown;
    const isUserPremium = user.isPremium;

    let randomPartner = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];

    await user.save();

    res.status(200).json({
      section,
      knowsAllCards,
      allCardsCount,
      cardsSeenTotal,
      feedbackFormShown,
      randomPartner,
      isUserPremium,
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

    let randomPartner = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];

    res
      .status(200)
      .json({ section, questionsSeenThisMonth, isUserPremium, randomPartner });
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
      if (!user.isPremium && user.questionsSeenThisMonth === 50) {
        user.reachedQuestionsLimitDate = Date.now();
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
      result.formattedDate = moment(result.date).locale("cs").format("LLL");

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

//route to post a mistake on a question or a card (POST)
router.post(
  "/mobileApi/reportMistake",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { questionId, cardId, content } = req.body;
    let user = req.user;

    if (!questionId && !cardId) {
      return res.status(400).json({
        error: "QuestionId or cardId is required",
      });
    }

    let newMistake = {
      content: content,
      card: cardId,
      question: questionId,
      author: user.email,
    };

    const savedMistake = await Mistake.create(newMistake);
    res.status(201).json({ message: "Mistake reported" });
  })
);

//route to post a feedback on the app (POST)
router.post(
  "/mobileApi/sendFeedback",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { content } = req.body;
    let user = req.user;

    if (!content) {
      return res.status(400).json({
        error: "Content is required",
      });
    }

    let newFeedback = {
      content: content,
      author: user.email,
    };

    user.feedbackFormShown = true;
    await user.save();
    await Feedback.create(newFeedback);

    res.status(201).json({ message: "Feedback saved" });
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
        faculty: user.faculty,
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
      faculty: user.faculty,
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

//SOUBOJ FAKULT
router.get(
  "/mobileApi/getClash",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { user } = req;
    let faculties = {
      prfUp: 0,
      prfUk: 0,
      prfMuni: 0,
      prfZcu: 0,
      prfJina: 0,
      prfNestuduji: 0,
      prfUchazec: 0,
    };
    let total = {
      prfUp: 0,
      prfUk: 0,
      prfMuni: 0,
      prfZcu: 0,
      prfJina: 0,
      prfNestuduji: 0,
      prfUchazec: 0,
    };

    let usersFaculty = undefined;

    if (user) {
      if (user.faculty === "PrF UP") {
        usersFaculty = "prfUp";
      }
      if (user.faculty === "PrF UK") {
        usersFaculty = "prfUk";
      }
      if (user.faculty === "PrF MUNI") {
        usersFaculty = "prfMuni";
      }
      if (user.faculty === "PrF ZČU") {
        usersFaculty = "prfZcu";
      }
      if (user.faculty === "Jiná") {
        usersFaculty = "prfJina";
      }
      if (user.faculty === "Nestuduji") {
        usersFaculty = "prfNestuduji";
      }
      if (user.faculty === "Uchazeč") {
        usersFaculty = "prfUchazec";
      }
    }

    let users = await User.find();
    users.forEach((user) => {
      //count points
      if (user.faculty === "PrF UP") {
        faculties.prfUp =
          faculties.prfUp +
          user.cardsSeenThisMonth +
          user.questionsSeenThisMonth;
        total.prfUp++;
      }
      if (user.faculty === "PrF UK") {
        faculties.prfUk =
          faculties.prfUk +
          user.cardsSeenThisMonth +
          user.questionsSeenThisMonth;
        total.prfUk++;
      }
      if (user.faculty === "PrF MUNI") {
        faculties.prfMuni =
          faculties.prfMuni +
          user.cardsSeenThisMonth +
          user.questionsSeenThisMonth;
        total.prfMuni++;
      }
      if (user.faculty === "PrF ZČU") {
        faculties.prfZcu =
          faculties.prfZcu +
          user.cardsSeenThisMonth +
          user.questionsSeenThisMonth;
        total.prfZcu++;
      }
      if (user.faculty === "Jiná") {
        faculties.prfJina =
          faculties.prfJina +
          user.cardsSeenThisMonth +
          user.questionsSeenThisMonth;
        total.prfJina++;
      }
      if (user.faculty === "Nestuduji") {
        faculties.prfNestuduji =
          faculties.prfNestuduji +
          user.cardsSeenThisMonth +
          user.questionsSeenThisMonth;
        total.prfNestuduji++;
      }
      if (user.faculty === "Uchazeč") {
        faculties.prfUchazec =
          faculties.prfUchazec +
          user.cardsSeenThisMonth +
          user.questionsSeenThisMonth;
        total.prfUchazec++;
      }
    });
    //order faculties according to the points - top to bottom
    let facultiesOrdered = Object.entries(faculties);
    facultiesOrdered.sort((a, b) => b[1] - a[1]);

    //render
    res.status(200).json(facultiesOrdered);
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
      messageForUserRequiredUpdate:
        "Aktualizujte prosím aplikaci na nejnovější verzi, ve které nově budete mít možnost ukládat výsledky testů a sledovat svůj pokrok.",
      messageForUserRecommendedUpdate:
        "Máte starší verzi aplikace. Doporučujeme aktualizovat na nejnovější verzi.",
    };
    res.status(200).json(response);
  })
);

module.exports = router;
