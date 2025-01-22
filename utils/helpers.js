const Stats = require("../models/stats");
const Invoice = require("../models/invoice");
const User = require("../models/user");
const Settings = require("../models/settings");
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

module.exports = helpers;
