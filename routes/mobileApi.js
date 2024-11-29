const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const TestResult = require("../models/testResult");
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

router.get(
  "/mobileApi/getSections",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { categoryName } = req.query;
    let { user } = req;
    const category = await Category.findOne({ name: categoryName }).populate(
      "sections"
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Fetch the latest test results for the user
    const testResults = await TestResult.find({
      user: user._id,
      category: category._id,
    })
      .sort({ date: -1 }) // Sort by most recent
      .exec();

    // Create a map of the latest test result for each section
    testResults.forEach((result) => {
      if (!testResultsMap[result.section]) {
        testResultsMap[result.section] = result;
      }
    });

    //add data to user's unfinishedSections
    category.sections.forEach((section, index) => {
      // Add last test result to the section
      if (testResultsMap[section._id]) {
        category.sections[index].lastTestResult =
          testResultsMap[section._id].percentage;
      }

      let unfinishedSectionIndex = req.user.unfinishedSections.findIndex(
        (x) => x.sectionId.toString() == section._id.toString()
      );
      if (unfinishedSectionIndex > -1) {
        category.sections[index].isUnfinished = true;
        category.sections[index].lastSeenCard =
          req.user.unfinishedSections[unfinishedSectionIndex].lastCard;
      }
      //check if the section is in the sections array of the user - if so, mark it as finished
      let finishedSectionIndex = req.user.sections.findIndex((x) => {
        return x.toString() == section._id.toString();
      });
      if (finishedSectionIndex > -1) {
        category.sections[index].isFinished = true;
      }
      if (!user.isPremium && section.isPremium) {
        category.sections[index].isAccesible = false;
      } else {
        category.sections[index].isAccesible = true;
      }
    });

    category.sections.forEach((section, index) => {
      let finishedTestIndex = req.user.finishedQuestions.findIndex((x) => {
        return x.toString() == section._id.toString();
      });
      if (finishedTestIndex > -1) {
        category.sections[index].isTestFinished = true;
      }
    });

    res.status(200).json(category.sections);
  })
);

router.get(
  "/mobileApi/getCards",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId } = req.query;
    const section = await Section.findById(sectionId).populate("cards");

    section.cards.forEach((card) => {
      card.pageA = removeITags(card.pageA);
    });

    let user = req.user;
    //update lastSeenCard in unfinishedSection
    let unfinishedSectionIndex = user.unfinishedSections.findIndex(
      (x) => x.sectionId.toString() == sectionId.toString()
    );
    if (unfinishedSectionIndex < 0) {
      //create new unfinished section and push it to the array
      let newUnfinishedSection = { sectionId: sectionId, lastCard: 0 };
      user.unfinishedSections.push(newUnfinishedSection);
      section.countStarted++;
      await section.save();
    } else {
      //get last seen card
      section.lastSeenCard =
        user.unfinishedSections[unfinishedSectionIndex].lastCard;
    }
    //remove the section from the finished sections array of the user using filter method
    let updatedFinishedSections = user.sections.filter((x) => {
      return x.toString() != sectionId.toString();
    });

    user.sections = updatedFinishedSections;

    //update date of user's last activity
    user.lastActive = moment();
    //increase cardSeen by 1
    user.cardsSeen++;
    user.cardsSeenThisMonth++;
    user.actionsToday++;
    if (user.actionsToday === 10) {
      user.streakLength++;
    }

    //mark modified nested objects - otherwise Mongoose does not see it and save it
    user.markModified("unfinishedSections");
    await user.save();

    res.status(200).json(section);
  })
);

router.get(
  "/mobileApi/getQuestions",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    let { sectionId } = req.query;
    const section = await Section.findById(sectionId).populate("questions");
    section.countStartedTest++;
    await section.save();

    let user = req.user;
    //update date of user's last activity
    user.lastActive = moment();
    user.questionsSeenTotal++;
    user.questionsSeenThisMonth++;
    user.actionsToday++;
    if (user.actionsToday === 10) {
      user.streakLength++;
    }

    if (!user.isPremium && user.questionsSeenThisMonth > 50) {
      return res.status(200).json({ limitReached: true });
    }

    res.status(200).json(section);
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
      if (user.actionsToday === 10) {
        user.streakLength++;
      }
      await user.save();
    }
    res.status(200).json({ message: "Action registered" });
  })
);

router.post(
  "/mobileApi/saveToFinishedSections",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    console.log("User finished test set");
    let { sectionId, stats } = req.body;

    if (!sectionId || !stats) {
      console.log("sectionId and stats are required");
      return res
        .status(400)
        .json({ error: "sectionId and stats are required" });
    }

    console.log("Stats received by the server: ", stats);

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

    console.log("Category found: ", foundCategory.name);

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

    //update unfinished section
    if (req.user) {
      let user = req.user;
      //update lastSeenCard in unifnishedSection
      let unfinishedSectionIndex = user.unfinishedSections.findIndex(
        (x) => x.sectionId.toString() == sectionId.toString()
      );
      if (unfinishedSectionIndex > -1) {
        user.unfinishedSections[unfinishedSectionIndex].lastCard =
          parseInt(cardNum);
      }
      //mark modified nested objects - otherwise Mongoose does not see it and save it
      user.markModified("unfinishedSections");

      //count new actions only every two seconds
      let now = moment();
      if (!user.lastActive || now.diff(user.lastActive, "seconds") >= 2) {
        //update date of user's last activity
        user.lastActive = moment();
        //increase cardSeen by 1
        user.cardsSeen++;
        user.cardsSeenThisMonth++;
        user.actionsToday++;
        if (user.actionsToday === 10) {
          user.streakLength++;
        }
      }

      await user.save();
    }
    res.status(201).json({ message: "Last seen card updated" });
  })
);

router.post(
  "/mobileApi/updateFinishedSections",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    //add new finished section to user's finishedSections
    let { sectionId } = req.body;
    let user = req.user;
    let finishedSectionIndex = user.sections.findIndex(
      (x) => x.toString() == sectionId.toString()
    );
    if (finishedSectionIndex < 0) {
      user.sections.push(sectionId);
    }
    //remove section from unfinishedSections
    let unfinishedSectionIndex = user.unfinishedSections.findIndex(
      (x) => x.sectionId.toString() == sectionId.toString()
    );
    if (unfinishedSectionIndex > -1) {
      user.unfinishedSections.splice(unfinishedSectionIndex, 1);
    }
    //mark modified nested objects - otherwise Mongoose does not see it and save it
    user.markModified("unfinishedSections");
    await user.save();
    res.status(201).json({ message: "Finished section added to user" });
  })
);

//get required mobile version for app (ios and android)
router.get(
  "/mobileApi/getVersionInfo",
  catchAsync(async (req, res) => {
    const { platform } = req.query;
    console.log("Platform: ", platform);
    const minimumVersion = {
      ios: "1.0.10",
      android: "1.0.5",
    };
    const latestVersions = {
      ios: "1.0.10",
      android: "1.0.5",
    };
    const updateUrl = {
      ios: "https://apps.apple.com/us/app/your-app-name/id6670204630",
      android: "https://play.google.com/store/apps/details?id=cz.inlege.InLege",
    };
    const response = {
      minimumVersion: minimumVersion[platform],
      latestVersion: latestVersions[platform],
      updateUrl: updateUrl[platform],
    };
    res.status(200).json(response);
  })
);

module.exports = router;
