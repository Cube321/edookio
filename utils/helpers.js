const Stats = require("../models/stats");
const Invoice = require("../models/invoice");

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
  subscriptionPeriod
) {
  let foundUser = await User.findById(userId);
  if (!foundUser) {
    console.log("User not found for invoice creation");
    return;
  }

  let invoiceNum = await Settings.findOne({ settingName: "lastInvoiceNumber" });

  let invoiceAmount = parseFloat(amount);

  let today = new Date();

  let newInvoice = {
    identificationNumber: invoiceNum,
    dateIssued: moment(today).locale("cs").format("l"),
    amount: invoiceAmount,
    user: userId,
    type,
    subscriptionPeriod,
  };

  //save invoice to DB
  let createdInvoice = await Invoice.create(newInvoice);

  //save new invoice ID reference on user
  foundUser.invoicesDbObjects.unshift(createdInvoice._id);
  await foundUser.save();
};

module.exports = helpers;
