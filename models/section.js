const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    cards: [{ type : Schema.Types.ObjectId, ref: 'Card' }]

})

module.exports = mongoose.model('Section', SectionSchema);