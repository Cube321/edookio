const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    category: {
        type: String,
        required: true,
        default: 'notset'
    },
    pageA: String,
    pageB: String,
    author: {
        type: String,
        required: true
    },
    section: {
        type : Schema.Types.ObjectId, 
        ref: 'Section'
    },
    factualMistakeReports: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Card', CardSchema);