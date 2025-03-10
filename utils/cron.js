const User = require("../models/user");
const Stats = require("../models/stats");
const Category = require("../models/category");
const catchAsync = require("../utils/catchAsync");
const helpers = require("../utils/helpers");
const moment = require("moment");
const mail = require("../mail/mail");
const { sendPushNotification } = require("../utils/pushNotifications");

let cronHelpers = {};

cronHelpers.checkPremiumEnded = catchAsync(async () => {
  console.log("RUNNING CRON: checkPremiumEnded");
  let users = await User.find({});
  let endedUsers = [];
  users.forEach((user) => {
    const today = Date.now();
    const { endDate } = user;
    if (moment(today).format() > moment(endDate).format()) {
      user.isPremium = false;
      user.premiumGrantedByAdmin = false;
      user.endDate = null;
      user.subscriptionSource = "none";
      user.plan = "none";
      user.save();
      mail.sendPremiumEnded(user.email);
      endedUsers.push(user.email);
    }
  });
  mail.sendCronReport("checkPremiumEnded", endedUsers);
});

cronHelpers.resetStreaks = catchAsync(async () => {
  console.log("RUNNING CRON: resetStreaks");
  let users = await User.find({});
  let counter = 0;
  users.forEach((user) => {
    if (user.actionsToday > 0 || user.streakLength > 0) {
      if (user.actionsToday < 10) {
        user.streakLength = 0;
        user.onInitialStreak = false;
        user.bonus100shown = true;
        user.bonus500shown = true;
      }
      user.dailyGoalReachedToday = false;
      user.actionsToday = 0;
      counter++;
      user.save();
    }
  });
  mail.sendCronReport("resetStreaks", counter);
});

cronHelpers.streakReminderEmail = catchAsync(async () => {
  console.log("RUNNING CRON: streakReminderEmail");
  let users = await User.find({});
  let counter = 0;
  users.forEach((user) => {
    if (
      user.streakLength > 1 &&
      !user.hasUnsubscribedFromStreak &&
      user.actionsToday < user.dailyGoal
    ) {
      mail.sendStreakReminder(user.email, user.streakLength);
      console.log(`streak reminder e-mail sent to: ${user.email}`);
      counter++;
    }
  });
  mail.sendCronReport("streakReminderEmail", counter);
});

//cron notification to all users with expoPushToken and dailyActivityReminder set to true to remind them to do their daily goal
cronHelpers.dailyActivityReminder = catchAsync(async () => {
  console.log("RUNNING CRON: dailyActivityReminder");
  let users = await User.find({ dailyActivityReminder: true });
  let counter = 0;
  users.forEach((user) => {
    if (user.expoPushToken && user.actionsToday === user.dailyGoal) {
      sendPushNotification(
        user.expoPushToken,
        "Edookio",
        `Nezapomeň si dnes procvičit své znalosti!`,
        {}
      );
      counter++;
    } else if (user.expoPushToken && user.actionsToday < user.dailyGoal) {
      sendPushNotification(
        user.expoPushToken,
        "Edookio",
        `Ještě ti chybí ${
          user.dailyGoal - user.actionsToday
        } bodů k dosažení dnešního cíle!`,
        {}
      );
      counter++;
    }
  });
  mail.sendCronReport("dailyActivityReminder", counter);
});

cronHelpers.resetMonthlyCounters = catchAsync(async () => {
  console.log("RUNNING CRON: resetMonthlyCounters");
  let users = await User.find({});
  //save last month clast results
  saveLeaderboard(users);
  let counter = 0;
  users.forEach((user) => {
    //reset credit counters
    user.generatedCardsCounterMonth = 0;
    user.generatedQuestionsCounterMonth = 0;
    user.usedCreditsMonth = 0;

    if (!user.isPremium) {
      user.credits = 500;
      let availableCredits = user.credits + user.extraCredits;
      if (!user.hasUnsubscribed) {
        mail.freeCreditsRecharged(user.email, 500, availableCredits);
      }
    }

    //reset monthly counters
    if (
      user.questionsSeenThisMonth > 0 ||
      user.cardsSeenThisMonth > 0 ||
      user.questionsSeenThisMonthTeacher > 0
    ) {
      if (
        !user.isPremium &&
        user.reachedQuestionsLimitDate &&
        !user.hasUnsubscribed
      ) {
        mail.testQuestionsLimitReset(user.email);
      }
      user.questionsSeenThisMonth = 0;
      user.cardsSeenThisMonth = 0;
      user.questionsSeenThisMonthTeacher = 0;
      user.reachedQuestionsLimitDate = null;
      counter++;
    }

    user.save();
  });
  mail.sendCronReport("resetMonthlyCounters", counter);
});

cronHelpers.saveDailyStats = catchAsync(async () => {
  console.log("RUNNING CRON: saveDailyStats");
  let simplifiedUsers = await User.find({}, "source");
  countDailyStats(simplifiedUsers);
  mail.sendCronReport("saveDailyStats", "success");
});

//cronHelper to send e-mail with information about Edookio to all users registered three days ago
cronHelpers.sendInfoEmail = catchAsync(async () => {
  console.log("RUNNING CRON: sendInfoEmail");

  // 1) Fetch all users who haven’t gotten the email yet
  let users = await User.find({}, "email dateOfRegistration infoEmailSent");
  let counter = 0;
  for (const user of users) {
    // 2) Compare today's date and the user's registration date
    // moment().diff(registrationDate, 'days') => how many days since registration
    const diffInDays = moment().diff(moment(user.dateOfRegistration), "days");
    // 3) Check if 3+ days have passed
    if (diffInDays >= 3 && !user.infoEmailSent && !user.hasUnsubscribed) {
      // 4) Send the email
      mail.sendInfoEmail(user.email);

      // 5) Mark the user so we don't send again
      user.infoEmailSent = true;
      await user.save();

      counter++;
    }
  }

  // 6) Send a summary to the admin (optional)
  mail.sendCronReport("sendInfoEmail", counter);
});

//add each user 500 credits
cronHelpers.add500Credits = catchAsync(async () => {
  console.log("RUNNING CRON: add500Credits");

  let users = await User.find({});
  let counter = 0;
  for (const user of users) {
    user.credits += 500;
    await user.save();
    counter++;
  }
  mail.sendCronReport("add500Credits", counter);
});

cronHelpers.add500Credits();

//cronHelper to send e-mail with discount for yearly subscription to users who are not premium but have received the 500 credits bonus
cronHelpers.sendDiscountEmail = catchAsync(async () => {
  console.log("RUNNING CRON: sendDiscountEmail");

  let counter = 0;

  const discountCodes = [
    process.env.DISCOUNT_CODE_1,
    process.env.DISCOUNT_CODE_2,
    process.env.DISCOUNT_CODE_3,
    process.env.DISCOUNT_CODE_4,
  ];

  // Fetch all users who haven’t gotten the email yet
  let users = await User.find(
    { isPremium: false, bonus500added: true, discountEmailSent: false },
    "email discountEmailSent"
  );
  console.log("Users to send discount e-mail to: ", users.length);
  for (const user of users) {
    if (user.hasUnsubscribed) {
      continue;
    }
    // Pick a random discount code
    const discountCode = discountCodes[Math.floor(Math.random() * 4)];
    // Send the email
    await mail.sendDiscountEmail(user.email, discountCode);
    user.discountEmailSent = true;
    await user.save();

    helpers.incrementEventCount("bonus500discountEmailSent");
    counter++;
  }
  // 4) Send a summary to the admin (optional)
  console.log("Discount e-mail sent to: ", counter);
  await mail.sendCronReport("sendDiscountEmail", counter);
});

//cronHelper to add credits to users have active premium and it has been a month or more since the last recharge
cronHelpers.addCreditsToPremiumUsers = catchAsync(async () => {
  console.log("RUNNING CRON: addCreditsToPremiumUsers");
  let premiumUsers = await User.find({ isPremium: true });
  let counter = 0;
  for (const user of premiumUsers) {
    const today = Date.now();
    const { creditsLastRecharge } = user;
    if (
      moment(today).format() >
        moment(creditsLastRecharge).add(1, "month").format() &&
      !user.hasUnsubscribed &&
      user.credits < user.creditsMonthlyLimit
    ) {
      user.credits = user.creditsMonthlyLimit;
      user.creditsLastRecharge = today;
      user.save();
      try {
        await mail.creditsRecharged(user.email, user.creditsMonthlyLimit);
      } catch (err) {
        console.log("Failed sending e-mail creditsRecharged: ", err);
      }
      counter++;
    }
  }
  mail.sendCronReport("addCreditsToPremiumUsers", counter);
});

cronHelpers.dailyCleanupOps = catchAsync(async () => {
  console.log("RUNNING CRON: dailyCleanupOps");

  // Delete all demo categories
  let demoCategories = await Category.find({ isDemo: true });

  let counter = demoCategories.length;

  demoCategories.forEach(async (category) => {
    await helpers.deleteDemoCategoryById(category._id);
  });

  console.log("Deleted demo categories", counter);
  console.log("Daily cleanup ops finished");
  await mail.sendCronReport("Deleted demo categories", counter);
});

let saveLeaderboard = catchAsync(async (users) => {
  users.forEach((user) => {
    user.pointsMonth =
      user.cardsSeenThisMonth +
      user.questionsSeenThisMonth +
      user.questionsSeenThisMonthTeacher;
  });

  let topUsers = [];

  users.sort(function (a, b) {
    return b.pointsMonth - a.pointsMonth;
  });
  topUsers = users.slice(0, 3);

  simplifiedTopUsers = [];

  //give nickname to each user that does not have any yet
  topUsers.forEach((user) => {
    simplifiedTopUsers.push({
      nickname: user.nickname,
      email: user.email,
      _id: user._id,
      pointsMonth: user.pointsMonth,
    });
  });

  //create object with date
  console.log("Creating date");
  let date = new Date();
  let updatedDate = moment(date).subtract(1, "days");
  var key = moment(updatedDate).format("MM/YYYY");
  let lastMonthData = { key: key, data: simplifiedTopUsers };

  console.log("About to save last month to DB");
  await Stats.findOneAndUpdate(
    { eventName: "leaderboardSavedStats" },
    { $push: { payload: lastMonthData } },
    { upsert: true, new: true }
  );
  //send confirmation e-mail to admin
  mail.sendCronReport("saveLeaderboard", simplifiedTopUsers);
});

async function countDailyStats(users) {
  let sourceCounts = {};

  users.forEach((user) => {
    const source = user.source;

    // Count sources
    if (sourceCounts[source]) {
      sourceCounts[source] += 1;
    } else {
      sourceCounts[source] = 1;
    }
  });
  await Stats.findOneAndUpdate(
    { eventName: "saveDailyStatsSource" },
    { $push: { payload: sourceCounts } },
    { upsert: true, new: true }
  );
}

// Schedule the function to run at midnight on the first day of every month
cronHelpers.cronExpressionMonthly = "0 0 1 * *";

// Schedule the function to run at 4 am every day (5 am on summer time)
cronHelpers.cronExpressionDaily5AM = "0 3 * * *";

// Schedule the function to run at 2 am every day (3 am on summer time)
cronHelpers.cronExpressionDaily3AM = "0 1 * * *";

// Schedule the function to run at 8 pm (9 pm on summer time)
cronHelpers.cronExpressionDaily9PM = "0 19 * * *";

// Schedule the function to run at 7 pm (8 pm on summer time)
cronHelpers.cronExpressionDaily8PM = "0 18 * * *";

// Schedule the function to run at 6:30 pm (7:30 pm on summer time)
cronHelpers.cronExpressionDaily730PM = "30 17 * * *";

// Schedule the function to run every 1st second of every minute
cronHelpers.cronExpressionMinutes = "1 * * * * *";

// Schedule the function to run every 10th second of every minute
cronHelpers.cronExpressionMinutesLater = "10 * * * * *";

//Schedule the function to run every day at 10:30am
cronHelpers.cronExpressionDaily1030AM = "0 9 * * *";

module.exports = cronHelpers;
