// jobs/flashcardQueue.js
const Bull = require("bull");

const redisUrl = process.env.REDIS_URL;
// Something like: rediss://:password@host:port

// Parse the REDIS_URL or manually extract host, port, and password from it.
// Many hosted Redis providers require enabling TLS explicitly.
const { URL } = require("url");
const redisConfig = new URL(redisUrl);

const flashcardQueue = new Bull("flashcard-generation", {
  redis: {
    host: redisConfig.hostname,
    port: redisConfig.port,
    password: redisConfig.password.replace(":", ""), // remove leading colon from password
    tls: {
      rejectUnauthorized: false, // In many Heroku/Redis setups, you may need this
    },
  },
});

module.exports = flashcardQueue;
