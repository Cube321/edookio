const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    pageA: String,
    pageB: String,
    author: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Card', CardSchema);