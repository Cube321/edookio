const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MistakeSchema = new Schema({
    question: {
        type : Schema.Types.ObjectId, 
        ref: 'Question'
    },
    author: String,
    content: String
})

module.exports = mongoose.model('Mistake', MistakeSchema);