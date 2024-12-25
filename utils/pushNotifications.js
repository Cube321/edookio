const { Expo } = require("expo-server-sdk");
const expo = new Expo();

async function sendPushNotification(expoPushToken, title, body, data = {}) {
  // 1. Check if token is a valid Expo push token
  if (!Expo.isExpoPushToken(expoPushToken)) {
    console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
    return;
  }

  // 2. Construct a message
  const messages = [
    {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data, // any custom payload you want
    },
  ];

  // 3. Chunk messages for sending
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  // 4. Send to Expo
  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Error sending notification chunk:", error);
    }
  }
}

async function sendPushNotifications(messages) {
  // Break the messages into chunks for sending
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Error sending notification chunk:", error);
    }
  }
  return tickets;
}

module.exports = {
  sendPushNotification,
  sendPushNotifications,
};
