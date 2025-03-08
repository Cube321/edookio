const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Stats = require("../models/stats");
const { isLoggedIn, isAdmin } = require("../utils/middleware");
const moment = require("moment");

const monthsInCzech = [
  "Leden", // January
  "Únor", // February
  "Březen", // March
  "Duben", // April
  "Květen", // May
  "Červen", // June
  "Červenec", // July
  "Srpen", // August
  "Září", // September
  "Říjen", // October
  "Listopad", // November
  "Prosinec", // December
];

//SHOW LEADERBOARD
router.get(
  "/leaderboard",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let users = await User.find();

    //prepare save stats from last month
    let statsFromDB = await Stats.findOne({
      eventName: "leaderboardSavedStats",
    });
    let lastMonthLeaderboard = { key: undefined, data: [] };
    if (statsFromDB) {
      lastMonthLeaderboard = statsFromDB.payload.pop();
    }

    let { order } = req.query;
    let { user } = req;

    if (!order) {
      order = "day";
    }

    users.forEach((user) => {
      user.pointsTotal = user.cardsSeen + user.questionsSeenTotal;
      user.pointsMonth =
        user.cardsSeenThisMonth +
        user.questionsSeenThisMonth +
        user.questionsSeenThisMonthTeacher;
      user.pointsToday = user.actionsToday;
    });

    let positionInArray = undefined;
    let isInTop = true;
    let topUsers = [];

    // Function to check if the user is in the array
    function isObjectInArray(array, object) {
      for (let i = 0; i < array.length; i++) {
        if (JSON.stringify(array[i]) === JSON.stringify(object)) {
          return i;
        }
      }
      return undefined;
    }

    if (order === "day") {
      users.sort(function (a, b) {
        return b.pointsToday - a.pointsToday;
      });
      positionInArray = isObjectInArray(users, user);
      if (positionInArray >= 9) {
        isInTop = false;
      }
      topUsers = users.slice(0, 10);
    } else if (order === "total") {
      users.sort(function (a, b) {
        return b.pointsTotal - a.pointsTotal;
      });
      positionInArray = isObjectInArray(users, user);
      if (positionInArray >= 49) {
        isInTop = false;
      }
      topUsers = users.slice(0, 50);
    } else {
      users.sort(function (a, b) {
        return b.pointsMonth - a.pointsMonth;
      });
      positionInArray = isObjectInArray(users, user);
      if (positionInArray >= 24) {
        isInTop = false;
      }
      topUsers = users.slice(0, 25);
    }

    let hasSavedNickname = true;

    //name of the last month in Czech
    moment.locale("cs");
    const lastMonthNum = moment().subtract(1, "month").month();
    const lastMonthName = monthsInCzech[lastMonthNum];

    res.status(200).render("leaderboard", {
      topUsers,
      positionInArray,
      isInTop,
      order,
      hasSavedNickname,
      lastMonthLeaderboard,
      lastMonthName,
    });
  })
);

//ADD or CHANGE NICKNAME

module.exports = router;
