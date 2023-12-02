const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatsSchema = new Schema({
    eventName: String,
    eventCount: { type: Number, default: 0 }
})

module.exports = mongoose.model('Stats', StatsSchema);