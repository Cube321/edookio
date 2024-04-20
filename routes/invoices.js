const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Settings = require('../models/settings');
const { isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');
const moment = require('moment');

//RESTful routes for /blog
//show open invoices
router.get('/invoices/open', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let users = await User.find({hasOpenInvoice: true});
    let lastInvoiceNumber = await Settings.findOne({settingName: "lastInvoiceNumber"});
    if(!lastInvoiceNumber){
        lastInvoiceNumber = "empty";
    } else {
        lastInvoiceNumber = Number(lastInvoiceNumber.settingValue);
    }
    let updatedUsers = [];
    users.forEach(user => {
        let updatedUser = {
            _id: user._id,
            email: user.email,
            amount: user.openInvoiceData.amount,
            date: moment(user.openInvoiceData.date).format("YYYY-MM-DD"),
            exactDate: user.openInvoiceData.date,
            plan: user.openInvoiceData.plan,
            endDate: moment(user.endDate).format("DD.MM.YYYY")
        }
        updatedUsers.push(updatedUser);
    })
    //order users according to the moment of payment
    updatedUsers.sort(function(a, b) {
        return a.exactDate - b.exactDate;
    });
    res.status(200).render('invoices/open', {users: updatedUsers, lastInvoiceNumber});
}))


module.exports = router;