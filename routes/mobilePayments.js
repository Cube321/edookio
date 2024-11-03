// routes/revenuecat.js
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const mail = require("../mail/mail_inlege");

// Middleware to verify RevenueCat webhook signature
const verifyRevenueCatAuthorization = (req, res, next) => {
  const receivedToken = req.headers["authorization"];
  const expectedToken = process.env.REVENUECAT_WEBHOOK_TOKEN; // Set this in your environment variables

  if (receivedToken !== expectedToken) {
    console.error("Unauthorized request: Invalid token");
    return res.status(401).send("Unauthorized");
  }
  next();
};

router.post(
  "/revenuecat/webhook",
  verifyRevenueCatAuthorization,
  catchAsync(async (req, res) => {
    const event = req.body;
    const { event: eventType, subscriber } = event;

    // Extract necessary information
    const { original_app_user_id, entitlements } = subscriber;
    const entitlement = Object.keys(entitlements.active)[0]; // Assuming single entitlement

    // Find the user in your database
    const user = await User.findOne({ _id: original_app_user_id });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user's subscription status
    switch (eventType) {
      case "INITIAL_PURCHASE":
        user.isPremium = true;
        user.plan = "monthly";
        user.premiumDateOfActivation = new Date();
        user.endDate = new Date(entitlements.active[entitlement].expires_date);
        user.subscriptionSource = "revenuecat";
        createOpenInvoice(user, "monthly");
        mail.subscriptionCreated(user.email);
        mail.adminInfoNewSubscription(user);
        break;
      case "RENEWAL":
        user.isPremium = true;
        user.plan = "monthly";
        user.premiumDateOfActivation = new Date();
        user.endDate = new Date(entitlements.active[entitlement].expires_date);
        user.subscriptionSource = "revenuecat";
        createOpenInvoice(user, "monthly");
        mail.adminInfoSubscriptionUpdated(user, endDate);
        break;
      case "CANCELLATION":
        user.isPremium = false;
        user.plan = "none";
        user.premiumDateOfCancelation = new Date();
        const endDate = moment(user.endDate).locale("cs").format("LL");
        user.subscriptionSource = "none";
        mail.subscriptionCanceled(user.email, endDate);
        mail.adminInfoSubscriptionCanceled(user, endDate);
        break;
      default:
        console.log("Unhandled event type in RevenueCat webhook", eventType);
        break;
    }

    user.premiumGrantedByAdmin = false;
    await user.save();
    res.status(200).send("Revenuecat webhook processed");
  })
);

//HELPERS
const createOpenInvoice = (user, plan) => {
  //create open invoice
  user.hasOpenInvoice = true;
  user.openInvoiceData = {
    amount: 249,
    date: Date.now(),
    plan: plan,
  };
  return user;
};

module.exports = router;
