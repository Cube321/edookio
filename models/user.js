const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema ({
    firstname: String,
    lastname: String,
    email: {
        type: String, 
        required: true,
        unique: true
    },
    faculty: {
        type: String,
        default: "Neuvedeno"
    },
    admin: {
        type: Boolean,
        default: false
    },
    isEditor: {
        type: Boolean,
        default: false
    },
    sections: Array,
    unfinishedSections: Array,
    dateOfRegistration: {
        type: Date
    },
    lastActive: {
        type: Date
    },
    passChangeId: {
        type: String
    },
    cardsSeen: {
        type: Number,
        default: 0
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isFirstSave: {
        type: Boolean,
        default: true
    },
    premiumGrantedByAdmin: {
        type: Boolean,
        default: false
    },
    billingId: String,
    plan: { type: String, enum: ['none', 'yearly', 'monthly', 'halfyear', 'daily'], default: 'none' },
    endDate: {type: Date, default: null},
    isGdprApproved: {
        type: Boolean,
        default: false
    },
    justSubscribed: {type: Boolean, default: true},
    premiumDateOfActivation: {type: Date, default: null},
    premiumDateOfUpdate: {type: Date, default: null},
    premiumDateOfCancelation: {type: Date, default: null},
    hasUnsubscribed: {
        type: Boolean,
        default: false
    },
    savedCards: [{ type : Schema.Types.ObjectId, ref: 'Card'}]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);