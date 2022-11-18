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
    admin: {
        type: Boolean,
        default: false
    },
    sections: Array,
    dateOfRegistration: {
        type: Date
    },
    passChangeId: {
        type: String
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);