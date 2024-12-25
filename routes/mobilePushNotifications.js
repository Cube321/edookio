// someRoute.js
const express = require("express");
const router = express.Router();
const {
  sendPushNotification,
  sendPushNotifications,
} = require("../utils/pushNotifications");
const User = require("../models/user");
const { isLoggedIn, isAdmin } = require("../utils/middleware");
const { Expo } = require("expo-server-sdk");

router.post(
  "/notifications/sendNotification/:userId",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const { title, body, data } = req.body;
      // 1) Identify who you want to notify
      const user = await User.findById(req.params.userId);

      // 2) Check if user has an Expo push token
      if (!user.expoPushToken) {
        req.flash("error", "Uživatel nemá nastavený Expo push token.");
        return res.redirect("/admin/users");
      }

      // 3) Send the push notification
      await sendPushNotification(
        user.expoPushToken,
        title,
        body,
        data // optional custom data
      );

      req.flash("successOverlay", "Notifikace byla odeslána.");
      return res.redirect("/admin/users");
    } catch (error) {
      console.error("Error in /notifyNewQuiz:", error);
      req.flash("error", "Nepodařilo se odeslat notifikaci.");
      return res.redirect("/admin/users");
    }
  }
);

router.post(
  "/notifications/broadcastNotifications",
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    console.log("Broadcasting notification to all users...");
    try {
      // 1. Gather request fields (title, body, data)
      const { title, body, groupChoice } = req.body;

      // 2. Find all users who have an expoPushToken
      let users = await User.find({
        expoPushToken: { $exists: true, $ne: null },
      });

      if (groupChoice === "radioFree") {
        users = users.filter((user) => user.isPremium === false);
      }

      if (groupChoice === "radioPremium") {
        users = users.filter((user) => user.isPremium === true);
      }

      // 3. Build an array of messages to send
      const messages = [];
      for (const user of users) {
        const token = user.expoPushToken;
        // Validate token format
        if (Expo.isExpoPushToken(token)) {
          messages.push({
            to: token,
            sound: "default",
            title: title || "InLege",
            body: body || "Opakování je matka moudrosti",
            data: {},
          });
        }
      }

      if (messages.length === 0) {
        req.flash(
          "error",
          "Nebyl nazelezen žádný uživatel s povolenými notifikacemi (Expo token nenalezen)."
        );
        return res.redirect("/admin/notifications");
      }

      // 4. Send the messages in chunks
      const tickets = await sendPushNotifications(messages);
      console.log("Notifications sent: ", tickets.length);

      req.flash(
        "successOverlay",
        `Notifikace byly odeslány ${tickets.length} uživatelům.`
      );
      return res.redirect("/admin/notifications");
    } catch (error) {
      console.error("Error in /broadcastNotification route:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
