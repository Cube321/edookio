const express = require("express");
const router = express.Router();
const axios = require("axios");
const { isLoggedIn } = require("../utils/middleware");
const User = require("../models/user");
const moment = require("moment");
const mail = require("../mail/mail_inlege");

// Apple receipt validation endpoint
router.post("/payment/verify-receipt", isLoggedIn, async (req, res) => {
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
      const latestReceipt = latest_receipt_info[latest_receipt_info.length - 1];
      const expirationDateMs = parseInt(latestReceipt.expires_date_ms, 10);
      const expirationDate = moment(expirationDateMs);

      // Update user's subscription status
      const user = await User.findById(req.user._id);

      // Handle subscription
      user.plan = "monthly";
      user.endDate = expirationDate.format();
      user.isPremium = expirationDate.isAfter(moment());
      user.premiumDateOfActivation = user.premiumDateOfActivation || moment();
      user.premiumDateOfUpdate = moment();
      user.originalTransactionId = latestReceipt.original_transaction_id;

      // Send confirmation emails
      const endDateFormatted = expirationDate.locale("cs").format("LL");

      if (user.isPremium) {
        mail.adminInfoSubscriptionUpdated(user, endDateFormatted);
      } else {
        mail.subscriptionCreated(user.email);
        mail.adminInfoNewSubscription(user);
      }

      // Reset any flags or discounts
      user.xmasDiscount = false;
      user.premiumGrantedByAdmin = false;

      await user.save();

      res.status(200).json({ message: "Subscription updated", expirationDate });
    } else {
      res.status(400).json({ message: "Invalid receipt", status });
    }
  } catch (error) {
    console.error("Error validating receipt:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Optionally, handle server-to-server notifications from Apple
router.post("/payment/apple-notification", async (req, res) => {
  const notification = req.body;

  try {
    const { unified_receipt } = notification;
    const latestReceiptInfo = unified_receipt.latest_receipt_info;
    const latestReceipt = latestReceiptInfo[latestReceiptInfo.length - 1];
    const originalTransactionId = latestReceipt.original_transaction_id;
    const expirationDateMs = parseInt(latestReceipt.expires_date_ms, 10);
    const expirationDate = moment(expirationDateMs);

    // Find the user by original transaction ID
    const user = await User.findOne({ originalTransactionId });

    if (user) {
      // Update user's subscription status
      user.plan = "monthly";
      user.endDate = expirationDate.format();
      user.isPremium = expirationDate.isAfter(moment());
      user.premiumDateOfUpdate = moment();

      // Send emails if necessary
      const endDateFormatted = expirationDate.locale("cs").format("LL");
      mail.adminInfoSubscriptionUpdated(user, endDateFormatted);

      await user.save();
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error processing Apple notification:", error);
    res.status(500).send("Error");
  }
});

module.exports = router;
