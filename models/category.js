const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    basicSections: [{ type : Schema.Types.ObjectId, ref: 'Section' }],
    premiumSections: [{ type : Schema.Types.ObjectId, ref: 'Section' }],
    sections: [{ type : Schema.Types.ObjectId, ref: 'Section' }],
    numOfCards: {
        type: Number,
        default: 0
    },
    numOfQuestions:{
        type: Number,
        default: 0
    },
    text: {
        type: String,
        default: ""
    },
    icon: {
        type: String,
        default: ""
    },
    orderNum: {
        type: Number,
        default: -1
    }

})

module.exports = mongoose.model('Category', CategorySchema);