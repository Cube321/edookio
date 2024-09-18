const express = require("express");
const router = express.Router();
const axios = require("axios");
const passport = require("passport");
const User = require("../models/user");
const moment = require("moment");
const mail = require("../mail/mail_inlege");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

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

// Handle server-to-server notifications from Apple
router.post("/payment/apple-notification", async (req, res) => {
  const { signedPayload } = req.body;

  try {
    // Determine the environment (sandbox or production)
    const environment = decoded.data.environment; // "Sandbox" or "Production"
    const isSandbox = environment === "Sandbox";

    // Initialize JWKS client
    const client = jwksClient({
      jwksUri: isSandbox
        ? "https://api.storekit-sandbox.itunes.apple.com/in-app-purchase/v1/keys"
        : "https://api.storekit.itunes.apple.com/in-app-purchase/v1/keys",
    });

    // Function to retrieve signing key
    function getKey(header, callback) {
      client.getSigningKey(header.kid, function (err, key) {
        if (err) {
          callback(err);
        } else {
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
        }
      });
    }

    // Verify and decode the signed payload
    jwt.verify(
      signedPayload,
      getKey,
      {
        algorithms: ["ES256"],
        issuer: isSandbox
          ? "https://sandbox.itunes.apple.com"
          : "https://itunes.apple.com",
      },
      async (err, decoded) => {
        if (err) {
          console.error("Verification failed:", err);
          return res.status(400).send("Invalid notification");
        }

        // Process the decoded notification
        const notification = decoded;
        console.log(`Decoded Notification: ${JSON.stringify(notification)}`);

        const { notificationType, data } = notification;

        const {
          bundleId,
          originalTransactionId,
          productId,
          purchaseDate,
          transactionId,
          expiresDate,
          signedDate,
          environment,
        } = data;

        // Convert dates from milliseconds to moment objects
        const expirationDate = moment(parseInt(expiresDate, 10));
        const isCanceled = notificationType === "DID_RENEW" ? false : true;

        // Find the user by original transaction ID
        const user = await User.findOne({ originalTransactionId });

        if (user) {
          // Update user's subscription status
          user.plan = "monthly"; // Adjust based on your product IDs if necessary
          user.endDate = expirationDate.toISOString();
          user.isPremium = !isCanceled && expirationDate.isAfter(moment());
          user.premiumDateOfUpdate = moment();

          await user.save();

          // Handle different notification types
          switch (notificationType) {
            case "DID_RENEW":
              // Subscription was renewed
              console.log("Subscription renewed");
              //mail.subscriptionRenewed(user.email);
              //mail.adminInfoSubscriptionRenewed(user);
              break;
            case "CANCEL":
              // Subscription was canceled
              mail.subscriptionCanceled(user.email);
              mail.adminInfoSubscriptionCanceled(user);
              break;
            case "EXPIRED":
              // Subscription expired
              console.log("Subscription expired");
              //mail.subscriptionExpired(user.email);
              //mail.adminInfoSubscriptionExpired(user);
              break;
            case "DID_FAIL_TO_RENEW":
              // Renewal failed
              console.log("Renewal failed");
              //mail.subscriptionRenewalFailed(user.email);
              //mail.adminInfoSubscriptionRenewalFailed(user);
              break;
            // Handle other notification types as needed
            default:
              console.log("Unhandled notification type:", notificationType);
              break;
          }
        } else {
          console.warn(
            "User not found for originalTransactionId:",
            originalTransactionId
          );
        }

        res.status(200).send("OK");
      }
    );
  } catch (error) {
    console.error("Error processing Apple notification:", error);
    res.status(500).send("Error");
  }
});

module.exports = router;
