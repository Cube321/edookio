const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Card = require('../models/card');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const Stripe = require('../utils/stripe');
const { findByIdAndDelete } = require('../models/user');
const moment = require('moment');
const mail = require('../mail/mail_inlege');



//show all registered users
router.get('/admin/listAllUsers', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});
    let updatedUsers = [];
    //count all users and premium users
    let premiumUsersCount = 0;
    let registeredUsersCount = 0;
    let usersActiveInLastWeek = 0;
    let premiumActivationsInLastWeek = 0;
    let premiumUpdatesInLastWeek = 0;
    let premiumDeactivationsInLastWeek = 0;
    users.forEach(user => {
        let newUser = user;
        newUser.updatedDateOfRegistration = moment(user.dateOfRegistration).locale('cs').format('LL');
        updatedUsers.push(newUser);
        //count Registered users
        registeredUsersCount = users.length;
        //count Premium users
        if(user.isPremium === true){premiumUsersCount++};
        //count users active in the last week
        if(user.lastActive && moment(user.lastActive).isAfter(moment().subtract(1, 'week'))){usersActiveInLastWeek++};
        //count premium activations in the last week
        if(user.premiumDateOfActivation && moment(user.premiumDateOfActivation).isAfter(moment().subtract(1, 'week'))){premiumActivationsInLastWeek++};
        //count premium updates in the last week
        if(user.premiumDateOfUpdate && moment(user.premiumDateOfUpdate).isAfter(moment().subtract(1, 'week'))){premiumUpdatesInLastWeek++};
        //count premium deactivations in the last week
        if(user.premiumDateOfCancelation && moment(user.premiumDateOfCancelation).isAfter(moment().subtract(1, 'week'))){premiumDeactivationsInLastWeek++};
    })
    res.status(200).render('admin/users', {
        users: updatedUsers, 
        premiumUsersCount, 
        registeredUsersCount, 
        usersActiveInLastWeek, 
        premiumActivationsInLastWeek,
        premiumUpdatesInLastWeek,
        premiumDeactivationsInLastWeek
    });
}))

//show all reported cards
router.get('/admin/listAllReports', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const cards = await Card.find({ factualMistakeReports: { $exists: true, $ne: [] } });
    res.status(200).render('admin/reports', {cards});
}))

router.get('/admin/:userId/upgradeToPremium', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const user = await User.findById(req.params.userId);
    if(!user){
        throw Error("Uživatel s tímto ID neexistuje");
    }
    user.isPremium = true;
    user.plan = "yearly";
    user.endDate = Date.now() * 2;
    await user.save();
    req.flash('success','Uživatel je nyní Premium');
    res.status(201).redirect('/admin/listAllUsers');
}))

//cookies
router.get("/cookies-agreed",function(req, res){
	req.session.cookiesAgreed = true;
	res.sendStatus(200);
});

//premium explanation page
router.get('/premium', (req, res) => {
    res.status(200).render('premium');
})

//email (render)
router.get('/admin/email', isLoggedIn, isAdmin, (req, res) => {
    res.status(200).render('admin/email')
})

//email (send)
router.post('/admin/email', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let allUsers = await User.find({});
    let {subjectAll, textAll, groupChoice} = req.body;
    //send e-mail to a group of users based on radio button choice
    //send to all users
    if(groupChoice === "radioAll"){
        allUsers.forEach(user => {
            mail.sendEmergencyEmail(user.email, subjectAll, textAll);
        })
    //send to users who did not unsubscribed
    } else if (groupChoice === "radioSelected"){
        //send email to subscribed users
        allUsers.forEach(user => {
            if (user.hasUnsubscribed === false){
                mail.sendEmailToSubscribedUsers(user.email, subjectAll, textAll);
            }
        })
    
    } else if (groupChoice === "radioTest"){
        mail.sendTestEmail('pravnicime@gmail.com', subjectAll, textAll);
    //should never run, implies some problem with radio buttons
    } else {
        req.flash('fail','E-mail nebyl odeslán, něco se nepovedlo');
        return res.status(400).redirect('/admin/email');
    }
    //redirect back and flash admin with confirmation
    req.flash('success','E-mail byl odeslán všem uživatelům');
    res.status(200).redirect('/admin/email');
}))

// email (unsubscribe)
router.get('/admin/email/unsubscribe', catchAsync(async(req, res) => {
    let {email} = req.query;
    let user = await User.findOne({email});
    console.log(user);
    if(user){
        user.hasUnsubscribed = true;
        await user.save();
        req.flash('success','Zasílání informačních e-mailů na váš e-mail bylo zrušeno.');
        return res.redirect('/');
    } else {
        req.flash('error','Omlouváme se, něco se nepovedlo. Zkuste to prosím později.');
        return res.redirect('/');
    }
}))

//delete account
router.delete('/admin/:userId/deleteUser', catchAsync(async(req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.status(201).redirect('/admin/listAllUsers');
}))

module.exports = router;