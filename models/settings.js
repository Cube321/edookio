const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
    settingName: String,
    settingValue: String,
    isOn: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Settings', SettingsSchema);