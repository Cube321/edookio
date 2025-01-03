const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
    user: {
        type : Schema.Types.ObjectId, 
        ref: 'User'
    },
    amount: Number,
    dateIssued: String,
    identificationNumber: Number,
    subscriptionPeriod: String
})

module.exports = mongoose.model('Invoice', InvoiceSchema);