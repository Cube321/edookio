const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { isLoggedIn, isAdmin } = require("../utils/middleware");
const moment = require("moment");

router.get(
  "/admin/dashboard",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const users = await User.find({});

    users.forEach((user) => {
      if (user.lastActive === undefined) {
        user.lastActive = null;
      }
      if (user.dateOfRegistration === undefined) {
        user.dateOfRegistration = null;
      }
    });

    const numberOfUsers = getNumberOfUsers(users);
    const numberOfUsersWithActiveSubscription =
      getNumberOfUsersWithActiveSubscription(users);
    const numberOfUsersWithActiveMonthlySubscription =
      getNumberOfUsersWithActiveMonthlySubscription(users);
    const numberOfUsersWithActiveHalfyearSubscription =
      getNumberOfUsersWithActiveHalfyearSubscription(users);
    const numberOfUsersWithActiveYearlySubscription =
      getNumberOfUsersWithActiveYearlySubscription(users);
    const numberOfUsersRegisteredToday = getNumberOfUsersRegisteredToday(users);
    const numberOfUsersRegisteredInLast30Days =
      getNumberOfUsersRegisteredInLast30Days(users);
    const monthlyRevenueBrutto = getMonthlyRevenueBrutto(users);
    const monthlyRevenueNetto = getMonthlyRevenueNetto(users);
    const numberOfUsersActiveToday = getNumberOfUsersActiveToday(users);
    const numberOfUsersActiveThisWeek = getNumberOfUsersActiveThisWeek(users);
    const numberOfUsersActiveThisMonth = getNumberOfUsersActiveThisMonth(users);
    const numberOfUsersActiveInLast90Days =
      getNumberOfUsersActiveInLast90Days(users);
    const numberOfUsersActiveInLast180Days =
      getNumberOfUsersActiveInLast180Days(users);
    const numberOfUsersActiveInLast365Days =
      getNumberOfUsersActiveInLast365Days(users);

    const percentageOfUsersActiveToday = Math.floor(
      getPercentageOfUsersActiveToday(users)
    );
    const percentageOfUsersActiveThisWeek = Math.floor(
      getPercentageOfUsersActiveThisWeek(users)
    );
    const percentageOfUsersActiveThisMonth = Math.floor(
      getPercentageOfUsersActiveThisMonth(users)
    );
    const percentageOfUsersActiveInLast90Days = Math.floor(
      getPercentageOfUsersActiveInLast90Days(users)
    );
    const percentageOfUsersActiveInLast180Days = Math.floor(
      getPercentageOfUsersActiveInLast180Days(users)
    );
    const percentageOfUsersActiveInLast365Days = Math.floor(
      getPercentageOfUsersActiveInLast365Days(users)
    );

    const numberOfUsersNeverActive = getNumberOfUsersNeverActive(users);
    const numberOfUsersActiveOnlyOnRegistrationDay =
      getNumberOfUsersActiveOnlyOnRegistrationDay(users);

    const percentageOfUsersNeverActive = Math.floor(
      getPercentageOfUsersNeverActive(users)
    );
    const percentageOfUsersActiveOnlyOnRegistrationDay = Math.floor(
      getPercentageOfUsersActiveOnlyOnRegistrationDay(users)
    );

    const numberOfUsersActivatedSubscriptionInLast30Days =
      getNumberOfUsersActivatedSubscriptionInLast30Days(users);
    const numberOfUsersDeactivatedSubscriptionInLast30Days =
      getNumberOfUsersDeactivatedSubscriptionInLast30Days(users);
    const numberOfUsersUpdatedSubscriptionInLast30Days =
      getNumberOfUsersUpdatedSubscriptionInLast30Days(users);

    res.render("admin/dashboard", {
      numberOfUsers,
      numberOfUsersWithActiveSubscription,
      numberOfUsersWithActiveMonthlySubscription,
      numberOfUsersWithActiveHalfyearSubscription,
      numberOfUsersWithActiveYearlySubscription,
      numberOfUsersRegisteredToday,
      numberOfUsersRegisteredInLast30Days,
      monthlyRevenueBrutto,
      monthlyRevenueNetto,
      numberOfUsersActiveToday,
      numberOfUsersActiveThisWeek,
      numberOfUsersActiveThisMonth,
      numberOfUsersActiveInLast90Days,
      numberOfUsersActiveInLast180Days,
      numberOfUsersActiveInLast365Days,
      percentageOfUsersActiveToday,
      percentageOfUsersActiveThisWeek,
      percentageOfUsersActiveThisMonth,
      percentageOfUsersActiveInLast90Days,
      percentageOfUsersActiveInLast180Days,
      percentageOfUsersActiveInLast365Days,
      numberOfUsersNeverActive,
      numberOfUsersActiveOnlyOnRegistrationDay,
      percentageOfUsersNeverActive,
      percentageOfUsersActiveOnlyOnRegistrationDay,
      numberOfUsersActivatedSubscriptionInLast30Days,
      numberOfUsersDeactivatedSubscriptionInLast30Days,
      numberOfUsersUpdatedSubscriptionInLast30Days,
    });
  })
);

// HELPERS
//function to get the number of users
function getNumberOfUsers(users) {
  return users.length;
}

//function to get number of users with active subscription
function getNumberOfUsersWithActiveSubscription(users) {
  let count = 0;
  users.forEach((user) => {
    if (user.isPremium && user.plan !== "none" && !user.premiumGrantedByAdmin) {
      count++;
    }
  });
  return count;
}

//function to get number of users with active monthly subscription
function getNumberOfUsersWithActiveMonthlySubscription(users) {
  let count = 0;
  users.forEach((user) => {
    if (
      user.isPremium &&
      user.plan === "monthly" &&
      !user.premiumGrantedByAdmin
    ) {
      count++;
    }
  });
  return count;
}

//function to get number of users with active halfyear subscription
function getNumberOfUsersWithActiveHalfyearSubscription(users) {
  let count = 0;
  users.forEach((user) => {
    if (
      user.isPremium &&
      user.plan === "halfyear" &&
      !user.premiumGrantedByAdmin
    ) {
      count++;
    }
  });
  return count;
}

//function to get number of users with active yearly subscription
function getNumberOfUsersWithActiveYearlySubscription(users) {
  let count = 0;
  users.forEach((user) => {
    if (
      user.isPremium &&
      user.plan === "yearly" &&
      !user.premiumGrantedByAdmin
    ) {
      count++;
    }
  });
  return count;
}

//users registered today
function getNumberOfUsersRegisteredToday(users) {
  const today = moment().startOf("day");
  return users.filter((user) =>
    moment(user.dateOfRegistration).isSame(today, "day")
  ).length;
}

//users registered in the last 30 days
function getNumberOfUsersRegisteredInLast30Days(users) {
  const today = moment().endOf("day");
  const startOf30Days = moment().subtract(30, "days");
  return users.filter((user) =>
    moment(user.dateOfRegistration).isBetween(startOf30Days, today)
  ).length;
}

//function to get monthly revenue (brutto)
function getMonthlyRevenueBrutto(users) {
  let revenue = 0;
  users.forEach((user) => {
    if (
      user.isPremium &&
      user.plan === "monthly" &&
      !user.premiumGrantedByAdmin
    ) {
      if (user.subscriptionSource === "revenuecat") {
        revenue += 249;
      } else {
        revenue += 199;
      }
    }
  });
  return revenue;
}

//function to get monthly revenue (netto)
function getMonthlyRevenueNetto(users) {
  let revenue = 0;
  users.forEach((user) => {
    if (
      user.isPremium &&
      user.plan === "monthly" &&
      !user.premiumGrantedByAdmin
    ) {
      if (user.subscriptionSource === "revenuecat") {
        revenue += 175;
      } else {
        revenue += 190;
      }
    }
  });
  return revenue;
}

//function to get number of users active today and lastActive is not undefined
function getNumberOfUsersActiveToday(users) {
  const today = moment().endOf("day");
  return users.filter((user) => moment(user.lastActive).isSame(today, "day"))
    .length;
}

//function to get number of users active in the last 7 days
function getNumberOfUsersActiveThisWeek(users) {
  const today = moment().endOf("day");
  const startOfWeek = moment().startOf("week");
  return users.filter((user) =>
    moment(user.lastActive).isBetween(startOfWeek, today)
  ).length;
}

//function to get number of users active in the last 30 days
function getNumberOfUsersActiveThisMonth(users) {
  const today = moment().endOf("day");
  const startOfMonth = moment().startOf("month");
  return users.filter((user) =>
    moment(user.lastActive).isBetween(startOfMonth, today)
  ).length;
}

//function to get number of users active in the last 90 days
function getNumberOfUsersActiveInLast90Days(users) {
  const today = moment().endOf("day");
  const startOf90Days = moment().subtract(90, "days");
  return users.filter((user) =>
    moment(user.lastActive).isBetween(startOf90Days, today)
  ).length;
}

//function to get number of users active in the last 180 days
function getNumberOfUsersActiveInLast180Days(users) {
  const today = moment().endOf("day");
  const startOf180Days = moment().subtract(180, "days");
  return users.filter((user) =>
    moment(user.lastActive).isBetween(startOf180Days, today)
  ).length;
}

//function to get number of users active in the last 365 days
function getNumberOfUsersActiveInLast365Days(users) {
  const today = moment().endOf("day");
  const startOf365Days = moment().subtract(365, "days");
  return users.filter((user) =>
    moment(user.lastActive).isBetween(startOf365Days, today)
  ).length;
}

//function to get percentage of users active today
function getPercentageOfUsersActiveToday(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersActiveToday = getNumberOfUsersActiveToday(users);
  return (numberOfUsersActiveToday / numberOfUsers) * 100;
}

//function to get percentage of users active in the last 7 days
function getPercentageOfUsersActiveThisWeek(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersActiveThisWeek = getNumberOfUsersActiveThisWeek(users);
  return (numberOfUsersActiveThisWeek / numberOfUsers) * 100;
}

//function to get percentage of users active in the last 30 days
function getPercentageOfUsersActiveThisMonth(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersActiveThisMonth = getNumberOfUsersActiveThisMonth(users);
  return (numberOfUsersActiveThisMonth / numberOfUsers) * 100;
}

//function to get percentage of users active in the last 90 days
function getPercentageOfUsersActiveInLast90Days(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersActiveInLast90Days =
    getNumberOfUsersActiveInLast90Days(users);
  return (numberOfUsersActiveInLast90Days / numberOfUsers) * 100;
}

//function to get percentage of users active in the last 180 days
function getPercentageOfUsersActiveInLast180Days(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersActiveInLast180Days =
    getNumberOfUsersActiveInLast180Days(users);
  return (numberOfUsersActiveInLast180Days / numberOfUsers) * 100;
}

//function to get percentage of users active in the last 365 days
function getPercentageOfUsersActiveInLast365Days(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersActiveInLast365Days =
    getNumberOfUsersActiveInLast365Days(users);
  return (numberOfUsersActiveInLast365Days / numberOfUsers) * 100;
}

//users never active
function getNumberOfUsersNeverActive(users) {
  return users.filter((user) => user.lastActive === undefined).length;
}

//function to get percentage of users never active
function getPercentageOfUsersNeverActive(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersNeverActive = getNumberOfUsersNeverActive(users);
  return (numberOfUsersNeverActive / numberOfUsers) * 100;
}

//users active only on the day of registration
function getNumberOfUsersActiveOnlyOnRegistrationDay(users) {
  return users.filter((user) =>
    moment(user.lastActive).isSame(moment(user.dateOfRegistration), "day")
  ).length;
}

//function to get percentage of users active only on the day of registration
function getPercentageOfUsersActiveOnlyOnRegistrationDay(users) {
  const numberOfUsers = getNumberOfUsers(users);
  const numberOfUsersActiveOnlyOnRegistrationDay =
    getNumberOfUsersActiveOnlyOnRegistrationDay(users);
  return (numberOfUsersActiveOnlyOnRegistrationDay / numberOfUsers) * 100;
}

//function to get number of users who activated subscription in the last 30 days
function getNumberOfUsersActivatedSubscriptionInLast30Days(users) {
  const today = moment().endOf("day");
  const startOf30Days = moment().subtract(30, "days");
  return users.filter((user) =>
    moment(user.premiumDateOfActivation).isBetween(startOf30Days, today)
  ).length;
}

//function to get number of users who deactivated subscription in the last 30 days
function getNumberOfUsersDeactivatedSubscriptionInLast30Days(users) {
  const today = moment().endOf("day");
  const startOf30Days = moment().subtract(30, "days");
  return users.filter((user) =>
    moment(user.premiumDateOfCancelation).isBetween(startOf30Days, today)
  ).length;
}

//function to get number of users who updated subscription in the last 30 days
function getNumberOfUsersUpdatedSubscriptionInLast30Days(users) {
  const today = moment().endOf("day");
  const startOf30Days = moment().subtract(30, "days");
  return users.filter((user) =>
    moment(user.premiumDateOfUpdate).isBetween(startOf30Days, today)
  ).length;
}

module.exports = router;
