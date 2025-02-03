const Stats = require("../models/stats");
const Invoice = require("../models/invoice");
const User = require("../models/user");
const Settings = require("../models/settings");
const Category = require("../models/category");
const Section = require("../models/section");
const Card = require("../models/card");
const Question = require("../models/question");
const moment = require("moment");

const helpers = {};

helpers.incrementEventCount = async function (eventName) {
  try {
    await Stats.findOneAndUpdate(
      { eventName },
      { $inc: { eventCount: 1 } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Error updating event count:", err);
  }
};

helpers.createInvoice = async function (
  userId,
  amount,
  type,
  currency,
  subscriptionPeriod,
  amountOfCredits
) {
  let foundUser = await User.findById(userId);
  if (!foundUser) {
    console.log("User not found for invoice creation");
    return;
  }

  let invoiceNumObject = await Settings.findOne({
    settingName: "lastInvoiceNumber",
  });

  let invoiceNum = parseInt(invoiceNumObject.settingValue) + 1;

  //check if the last invoice number is not in the db
  invoiceNumberExists = await Invoice.findOne({
    identificationNumber: invoiceNum,
  });

  while (invoiceNumberExists) {
    invoiceNum++;
    invoiceNumberExists = await Invoice.findOne({
      identificationNumber: invoiceNum,
    });
  }

  let invoiceAmount = parseFloat(amount);

  let today = new Date();

  let newInvoice = {
    identificationNumber: invoiceNum,
    dateIssued: moment(today).locale("cs").format("l"),
    amount: invoiceAmount,
    user: userId,
    type,
    currency,
    subscriptionPeriod,
    amountOfCredits,
  };

  console.log("newInvoice", newInvoice);

  //save invoice to DB
  let createdInvoice = await Invoice.create(newInvoice);

  await Settings.findOneAndUpdate(
    { settingName: "lastInvoiceNumber" },
    { settingValue: invoiceNum },
    { upsert: true, new: true }
  );

  //save new invoice ID reference on user
  foundUser.invoicesDbObjects.unshift(createdInvoice._id);
  await foundUser.save();
};

//async function to delete demo category by ID and all its sections, cards and questions
//can not be used for real categories unless handled the createdCategories and sharedCategories array on each user
helpers.deleteDemoCategoryById = async function (categoryId) {
  try {
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) throw new Error("Category not found.");

    if (!foundCategory.isDemo) {
      throw new Error("Category is not a demo category.");
    }

    await Section.deleteMany({ categoryId: categoryId });
    await Card.deleteMany({ categoryId: categoryId });
    await Question.deleteMany({ categoryId: categoryId });

    await Category.findByIdAndDelete(categoryId);

    console.log(
      "Demo category and all its sections, cards and questions deleted.",
      categoryId
    );

    return {
      status: "Category and all its sections, cards and questions deleted.",
    };
  } catch (error) {
    console.error("Error deleting category by ID:", error);
    throw error;
  }
};

//register action for user
helpers.registerAction = async function (user, action) {
  try {
    user.lastActive = moment();
    if (action === "questionSeen") {
      user.questionsSeenTotal++;
      user.questionsSeenThisMonth++;
      if (!user.isPremium && user.questionsSeenThisMonth === 50) {
        user.reachedQuestionsLimitDate = Date.now();
        console.log("Reached questions limit for user:", user.email);
      }
    }

    if (action === "cardSeen") {
      user.cardsSeen++;
      user.cardsSeenThisMonth++;
    }

    user.actionsToday++;
    if (user.actionsToday === user.dailyGoal && !user.dailyGoalReachedToday) {
      user.streakLength++;
      user.dailyGoalReachedToday = true;
      console.log("Daily goal reached for user:", user.email);
    }

    //evaluate conditions for bonus 500
    if (
      user.streakLength === 1 &&
      user.onInitialStreak &&
      !user.bonus500added
    ) {
      user.credits += 500;
      user.bonus500added = true;
      console.log("Bonus 500 AI credits for user:", user.email);
    }

    await user.save();
  } catch (error) {
    console.log("Error registering action for user (helpers):", error);
    throw error;
  }
};

module.exports = helpers;
