const express = require("express");
const router = express.Router();
const axios = require("axios");
const passport = require("passport");
const User = require("../models/user");
const moment = require("moment");
const mail = require("../mail/mail_inlege");

// Apple receipt validation endpoint
router.post(
  "/payment/verify-receipt",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("Processing receipt verification");
    const { receiptData } = req.body;

    try {
      // Send receipt to Apple for validation
      let response = await axios.post(
        "https://buy.itunes.apple.com/verifyReceipt",
        {
          "receipt-data": receiptData,
          password: process.env.APPLE_SHARED_SECRET,
          "exclude-old-transactions": true,
        }
      );

      let { status, latest_receipt_info } = response.data;

      // If in sandbox environment, retry with sandbox URL
      if (status === 21007) {
        response = await axios.post(
          "https://sandbox.itunes.apple.com/verifyReceipt",
          {
            "receipt-data": receiptData,
            password: process.env.APPLE_SHARED_SECRET,
            "exclude-old-transactions": true,
          }
        );

        status = response.data.status;
        latest_receipt_info = response.data.latest_receipt_info;
      }

      if (status === 0) {
        // Receipt is valid
        const latestReceipt =
          latest_receipt_info[latest_receipt_info.length - 1];

        const originalTransactionId = latestReceipt.original_transaction_id;
        const expirationDateMs = parseInt(latestReceipt.expires_date_ms, 10);
        const expirationDate = moment(expirationDateMs);

        // Check for cancellation
        const cancellationDateMs = latestReceipt.cancellation_date_ms
          ? parseInt(latestReceipt.cancellation_date_ms, 10)
          : null;
        const isCanceled = cancellationDateMs !== null;

        // Update user's subscription status
        const user = await User.findById(req.user._id);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Update user subscription data
        user.plan = "monthly"; // Adjust based on your product IDs if necessary
        user.endDate = expirationDate.toISOString();
        user.isPremium = !isCanceled && expirationDate.isAfter(moment());
        user.premiumDateOfActivation = user.premiumDateOfActivation || moment();
        user.premiumDateOfUpdate = moment();
        user.originalTransactionId = originalTransactionId;

        // Reset any flags or discounts
        user.xmasDiscount = false;
        user.premiumGrantedByAdmin = false;

        await user.save();

        // Send emails based on subscription status
        if (user.isPremium) {
          // Subscription is active
          mail.subscriptionCreated(user.email);
          mail.adminInfoNewSubscription(user);
        } else {
          // Subscription is canceled or expired
          mail.subscriptionCanceled(user.email);
          mail.adminInfoSubscriptionCanceled(user);
        }

        res
          .status(200)
          .json({ message: "Subscription updated", expirationDate });
      } else {
        res.status(400).json({ message: "Invalid receipt", status });
      }
    } catch (error) {
      console.error("Error validating receipt:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
