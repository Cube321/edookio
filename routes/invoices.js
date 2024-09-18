const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Invoice = require('../models/invoice');
const Settings = require('../models/settings');
const { isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');
const moment = require('moment');

//add new invoice
router.post('/invoice/new/:userId',isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let data = req.body;
    let {userId} = req.params;
    let foundUser = await User.findById(userId);
    if(!foundUser){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/admin/users');
    }
    let {invoiceNum, invoiceAmount, invoiceDate, subscriptionPeriod} = data;
    let newInvoice = {
        identificationNumber: invoiceNum,
        dateIssued: moment(invoiceDate).locale('cs').format('l'),
        amount: invoiceAmount,
        user: userId,
        subscriptionPeriod
    }
    
    //save invoice to DB
    let createdInvoice = await Invoice.create(newInvoice);

    //save new invoice ID reference on user
    foundUser.invoicesDbObjects.unshift(createdInvoice._id);
    foundUser.hasOpenInvoice = false;
    foundUser.openInvoiceData = {};
    await foundUser.save();
    //save faculties to DB
    await Settings.findOneAndUpdate(
        { settingName: 'lastInvoiceNumber' },
        { settingValue: invoiceNum },
        { upsert: true, new: true }
    );
    req.flash('success','Faktura byla vložena');
    res.status(201).redirect(`/invoices/open`);
}))


//show one invoice
router.get('/invoice/show/:invoiceId/', isLoggedIn, catchAsync(async(req, res) => {
    let {invoiceId} = req.params;
    let foundInvoice = await Invoice.findById(invoiceId);
    if(!foundInvoice){
        req.flash('error','Faktura nebyla nalezena')
        return res.redirect('/auth/user/profile');
    }
    res.status(201).render(`invoices/showOne`, {invoice: foundInvoice});
}))


//show all invoices
router.get('/invoices/issued', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let invoices = await Invoice.find({}).populate('user');
    invoices.reverse();
    let {show} = req.query;
    if(show === "full"){
        res.status(201).render(`invoices/issuedFull`, {invoices});
    } else {
        res.status(201).render(`invoices/issuedList`, {invoices});
    }
    
}))


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

//logic to remove invoices created after 01/05/2024
router.get('/invoice/removeInvoice/:userId/:invoiceId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let {userId, invoiceId} = req.params;
    let foundUser = await User.findById(userId);
    if(!foundUser){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/admin/users');
    }

    //remove invoice object from DB
    await Invoice.findByIdAndDelete(invoiceId);

    // Function to filter out an object based on invoiceNum
    function filterArrayOfInvoices(arr, invoiceId) {
        return arr.filter(invoice => invoice.toString() !== invoiceId);
    }
    let filteredInvoices = filterArrayOfInvoices(foundUser.invoicesDbObjects, invoiceId);
    foundUser.invoicesDbObjects = filteredInvoices;
    foundUser.save();
    req.flash('success','Faktura byla odstraněna')
    res.status(201).redirect(`/admin/${userId}/showDetail`);
}))

//cancel open invoice
router.get('/invoice/closeInvoice/:userId/', isLoggedIn, catchAsync(async(req, res) => {
    let {userId} = req.params;
    let foundUser = await User.findById(userId);
    if(!foundUser){
        req.flash('error','Uživatel nebyl nalezen')
        return res.redirect('/invoices/open');
    }
    foundUser.hasOpenInvoice = false;
    foundUser.openInvoiceData = {};
    await foundUser.save();
    req.flash('success','Koncept faktury byl odstraněn')
    res.status(201).redirect(`/invoices/open`);
}))




//LEGACY CODE  - old invoices before 01_05_2024 (still in use)
router.get('/invoice/remove/:userId/:invoiceNum', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let {userId, invoiceNum} = req.params;
    let foundUser = await User.findById(userId);
    if(!foundUser){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/admin/users');
    }
    // Function to filter out an object based on invoiceNum
    function filterArrayOfInvoices(arr, invoiceNumber) {
        return arr.filter(invoice => invoice.invoiceNum !== invoiceNumber);
    }
    let filteredInvoices = filterArrayOfInvoices(foundUser.invoices, invoiceNum);
    foundUser.invoices = filteredInvoices;
    foundUser.save();
    req.flash('success','Faktura byla odstraněna')
    res.status(201).redirect(`/admin/${userId}/showDetail`);
}))

router.get('/invoice/request/:invoiceNum', isLoggedIn, catchAsync(async(req, res) => {
    let {invoiceNum} = req.params;
    let foundUser = await User.findById(req.user._id);
    if(!foundUser){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/');
    }
    foundUser.invoices.forEach(invoice => {
        if(invoice.invoiceNum === invoiceNum){
            invoice.isRequested = true;
        }
    })
    foundUser.markModified('invoices');
    await foundUser.save();
    mail.requestInvoice(req.user.email, invoiceNum);
    req.flash('success',`Faktura ${invoiceNum} byla vyžádána a bude doručena do e-mailové schránky ${req.user.email} do tří pracovních dnů.`);
    res.status(200).redirect(`/auth/user/profile`);
}))

module.exports = router;