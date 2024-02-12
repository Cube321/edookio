const Stats = require('../models/stats');

const helpers = {};

helpers.incrementEventCount = async function (eventName) {
    try {
      await Stats.findOneAndUpdate(
        { eventName },
        { $inc: { eventCount: 1 } },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Error updating event count:', err);
    }
  }

  module.exports = helpers;