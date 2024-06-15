const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
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
    const category = await Category.findOne({ name: categoryName }).populate(
      "sections"
    );
    //add data to user's unfinishedSections

    category.sections.forEach((section, index) => {
      let unfinishedSectionIndex = req.user.unfinishedSections.findIndex(
        (x) => x.sectionId.toString() == section._id.toString()
      );
      if (unfinishedSectionIndex > -1) {
        category.sections[index].isUnfinished = true;
        category.sections[index].lastSeenCard =
          req.user.unfinishedSections[unfinishedSectionIndex].lastCard;
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
      let newUnfinishedSection = { sectionId: sectionId, lastCard: 1 };
      user.unfinishedSections.push(newUnfinishedSection);
      section.countStarted++;
      await section.save();
    }
    //mark modified nested objects - otherwise Mongoose does not see it and save it
    user.markModified("unfinishedSections");
    await user.save();

    res.status(200).json(section.cards);
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

    console.log("sectionId", sectionId);
    console.log("cardNum", cardNum);

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

module.exports = router;
