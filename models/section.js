const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    cards: [{ type : Schema.Types.ObjectId, ref: 'Card'}],
    isPremium: {
        type: Boolean,
        default: false
    },
    isUnfinished: {
        type: Boolean,
        default: false
    },
    lastSeenCard: {
        type: Number,
        default: 0
    },
    nextSection: {
        type: String,
        default: ""
    }
})

//write .post delete middleware (course, video 466) 14. 11. 2022

module.exports = mongoose.model('Section', SectionSchema);