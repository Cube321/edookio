// routes/revenuecat.js
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const mail = require("../mail/mail_inlege");
const moment = require("moment");

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
    console.log("Received webhook event:", JSON.stringify(req.body, null, 2));

    const event = req.body.event;

    if (!event) {
      console.error("No event object found in the webhook payload.");
      return res.status(400).send("Invalid webhook payload");
    }

    const { event_type, app_user_id, entitlement_ids, transaction } = event;

    // Log extracted data for debugging
    console.log("Event Type:", event_type);
    console.log("App User ID:", app_user_id);
    console.log("Entitlement IDs:", entitlement_ids);

    // Find the user in your database
    const user = await User.findOne({ _id: app_user_id });
    if (!user) {
      console.error("User not found:", app_user_id);
      return res.status(404).send("User not found");
    }

    // Extract plan from entitlement_ids or default to 'monthly'
    const plan =
      entitlement_ids && entitlement_ids.length > 0
        ? entitlement_ids[0]
        : "monthly";

    // Update user's subscription status
    let formattedEndDate = "unknown";

    switch (event_type) {
      case "INITIAL_PURCHASE":
      case "RENEWAL":
      case "PRODUCT_CHANGE":
        user.isPremium = true;
        user.plan = plan;
        user.premiumDateOfActivation = new Date();
        user.endDate =
          transaction && transaction.expiration_date
            ? new Date(transaction.expiration_date)
            : null;
        user.subscriptionSource = "revenuecat";
        createOpenInvoice(user, user.plan);
        formattedEndDate = user.endDate
          ? moment(user.endDate).locale("cs").format("LL")
          : "unknown";
        mail.subscriptionCreated(user.email, formattedEndDate);
        mail.adminInfoNewSubscription(user, formattedEndDate);
        break;

      case "CANCELLATION":
      case "EXPIRATION":
        user.isPremium = false;
        user.plan = "none";
        user.premiumDateOfCancelation = new Date();
        user.subscriptionSource = "none";
        formattedEndDate = user.endDate
          ? moment(user.endDate).locale("cs").format("LL")
          : "unknown";
        mail.subscriptionCanceled(user.email, formattedEndDate);
        mail.adminInfoSubscriptionCanceled(user, formattedEndDate);
        break;

      default:
        console.log("Unhandled event type in RevenueCat webhook", event_type);
        break;
    }

    user.premiumGrantedByAdmin = false;
    await user.save();
    res.status(200).send("RevenueCat webhook processed");
  })
);

// HELPERS
const createOpenInvoice = (user, plan) => {
  // Create open invoice
  user.hasOpenInvoice = true;
  user.openInvoiceData = {
    amount: 249,
    date: Date.now(),
    plan: plan,
  };
  return user;
};

module.exports = router;
