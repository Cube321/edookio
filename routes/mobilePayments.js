// routes/revenuecat.js
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const mail = require("../mail/mail");
const helpers = require("../utils/helpers");
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
    const event = req.body.event;

    if (!event) {
      console.error("No event object found in the webhook payload.");
      return res.status(400).send("Invalid webhook payload");
    }

    const { app_user_id, expiration_at_ms, store } = event;
    const event_type = event.type;

    // Log extracted data for debugging
    console.log("WEBHOOK Event Type:", event_type);
    console.log("App User ID:", app_user_id);

    // Find the user in your database
    const user = await User.findOne({ _id: app_user_id });
    if (!user) {
      console.error("User not found:", app_user_id);
      return res.status(404).send("User not found");
    }

    // Extract plan from entitlement_ids or default to 'monthly'
    const plan = "monthly";

    // Update user's subscription status
    let formattedEndDate = "unknown";

    const paymentSource = "revenuecat";

    switch (event_type) {
      case "INITIAL_PURCHASE":
        user.isPremium = true;
        user.plan = plan;
        user.creditsMonthlyLimit = 1000;
        user.credits = 1000;
        user.creditsLastRecharge = new Date();
        user.premiumDateOfActivation = new Date();
        user.endDate = expiration_at_ms
          ? new Date(Number(expiration_at_ms))
          : null;
        user.subscriptionSource = "revenuecat";

        //create invoice
        await helpers.createInvoice(
          user._id,
          249,
          "subscription",
          "CZK",
          user.plan
        );

        try {
          await mail.subscriptionCreated(user.email, formattedEndDate);
          await mail.adminInfoNewSubscription(user, paymentSource, store);
        } catch (error) {
          console.error(
            "Error sending email - initial purchase MobilePayments",
            error
          );
        }

        break;

      case "RENEWAL":
      case "PRODUCT_CHANGE":
        user.isPremium = true;
        user.plan = plan;
        user.premiumDateOfUpdate = new Date();
        user.endDate = expiration_at_ms
          ? new Date(Number(expiration_at_ms))
          : null;
        user.subscriptionSource = "revenuecat";
        user.creditsMonthlyLimit = 1000;
        user.credits = 1000;
        user.creditsLastRecharge = new Date();
        user.subscriptionPrice = 249;
        user.monthlySubscriptionPrice = 249;

        //create invoice
        await helpers.createInvoice(
          user._id,
          249,
          "subscription",
          "CZK",
          user.plan
        );

        formattedEndDate = "-";
        try {
          await mail.adminInfoSubscriptionUpdated(
            user,
            formattedEndDate,
            paymentSource,
            store
          );
        } catch (error) {
          console.error("Error sending email - renewal MobilePayments", error);
        }

        break;

      case "CANCELLATION":
        let oldPlan = user.plan;
        user.plan = "none";
        const endDate = moment(user.endDate).locale("cs").format("LL");
        user.premiumDateOfCancelation = new Date();
        user.creditsMonthlyLimit = 500;
        user.subscriptionPrice = 0;
        user.monthlySubscriptionPrice = 0;
        try {
          await mail.subscriptionCanceled(user.email, endDate);
          await mail.adminInfoSubscriptionCanceled(
            user,
            endDate,
            paymentSource,
            store,
            oldPlan
          );
        } catch (error) {
          console.error(
            "Error sending email - cancellation MobilePayments",
            error
          );
        }
        break;

      case "UNCANCELLATION":
        user.plan = plan;
        user.subscriptionSource = "revenuecat";
        user.creditsMonthlyLimit = 1000;
        user.creditsLastRecharge = new Date();
        user.subscriptionPrice = 249;
        user.monthlySubscriptionPrice = 249;
        user.premiumDateOfCancelation = undefined;
        try {
          await mail.subscriptionUncancelled(user.email);
          await mail.adminInfoSubscriptionUncancelled(
            user,
            paymentSource,
            store
          );
        } catch (error) {
          console.error(
            "Error sending email - uncancellation MobilePayments",
            error
          );
        }
        break;

      case "EXPIRATION":
        user.subscriptionSource = "none";
        console.log(
          "REVENUECAT WEBHOOK - EXPIRATION: Subscription expired for user:",
          user.email
        );
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

module.exports = router;
