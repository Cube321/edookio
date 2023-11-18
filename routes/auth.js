const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn, isPremiumUser } = require('../utils/middleware');
const { validateUser } = require('../utils/middleware');
const uuid = require('uuid');
const mail = require('../mail/mail_inlege');
const Stripe = require('../utils/stripe');
const moment = require('moment');

//my profile view page
router.get('/auth/user/profile', isLoggedIn, catchAsync(async(req, res) => {
    const {user} = req;
    let endDate = "";
    let dateOfRegistration = moment(user.dateOfRegistration).locale('cs').format('LL');
    if(user.isPremium){
        endDate = moment(user.endDate).locale('cs').format('LL')
    }
    res.status(200).render('auth/profile', {user, endDate, dateOfRegistration});
}))

//render feedback form
router.get('/legal/feedback', isLoggedIn, catchAsync(async(req, res) => {
    const {user} = req;
    res.status(200).render('legal/feedback', {user});
}))

//send feedback
router.post('/legal/feedback', isLoggedIn, catchAsync(async(req, res) => {
    const {email, name, text} = req.body;
    mail.sendFeedback(email, name, text);
    req.flash('success','Feedback byl odeslán. Díky!')
    res.status(201).redirect(`/legal/feedback`);
}))

//register form user (GET)
router.get('/auth/user/new', (req, res) => {
    let requiresPremium = false;
    if(req.query.premium === "true"){
        requiresPremium = true;
    }
    res.status(200).render('auth/register_form', {requiresPremium});
})

//register form admin (GET)
router.get('/auth/admin/new', (req, res) => {
    res.status(200).render('auth/admin_registr');
})

//register request (POST)
router.post('/auth/user/new', validateUser, catchAsync(async (req, res, next) => {
    const {email, password, password_confirmation, key, firstname, lastname, faculty} = req.body;
    //check password 
    if(password !== password_confirmation){
        req.flash('error','Obě zadaná hesla se musí shodovat.');
        return res.redirect('back');
    }
    try {
        //check for admin key
        let admin = false;
        if(key === process.env.adminRegKey) {
            admin = true;
            faculty = "Neuvedeno";
        }
        //register user
        const passChangeId = uuid.v1();
        const dateOfRegistration = Date.now();
        const customer = await Stripe.addNewCustomer(email);
        const user = new User({
            email, 
            username: email, 
            admin, 
            dateOfRegistration, 
            firstname, 
            lastname, 
            passChangeId,
            billingId: customer.id,
            plan: "none",
            endDate: null,
            isGdprApproved: true,
            faculty
        });
        const newUser = await User.register(user, password);
        await req.login(newUser, err => {
            if (err) return next(err);
        })
        //send info e-mails
        mail.welcome(newUser.email);
        mail.adminInfoNewUser(newUser);
        //
        req.flash('success', 'Registrace proběhla úspěšně.');
        if(req.query.requiresPremium){
            res.status(201).redirect('/premium'); 
        } else {
            res.status(201).redirect('/'); 
        }
    } catch (err){
        if (err.message === 'A user with the given username is already registered'){
            req.flash('error', 'Uživatel již existuje.');
        } else {
            req.flash('error', 'Jejda, něco se nepovedlo.');
        }
        res.status(400).redirect('back');
    }
}))

//login form (GET)
router.get('/auth/user/login', (req, res) => {
    res.status(200).render('auth/login_form');
})

//login request (POST)
router.post('/auth/user/login', passport.authenticate('local', {failureFlash: 'Nesprávné heslo nebo e-mail.', failureRedirect: '/auth/user/login'}), catchAsync(async (req, res) => {
    res.status(200).redirect('/');
    //let redirectUrl = req.session.returnTo || '/';
    //delete req.session.returnTo;
    //if(redirectUrl === "/auth/user/logout"){redirectUrl = "/"};
    //res.status(200).redirect(redirectUrl);
}))

//logout request (GET)
router.get('/auth/user/logout', isLoggedIn, (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.status(200).redirect('/');
      });
    res.status(200).redirect('/');
})

//change password (GET)
router.get('/auth/user/changePassword', isLoggedIn, (req, res) => {
    res.status(200).render('auth/change_password');
})

//change password (POST)
router.post('/auth/user/changePassword', isLoggedIn, catchAsync(async(req, res) => {
    try {
    if(req.body.newpassword === req.body.newpasswordcheck){
        const user = await User.findById(req.user._id);
        await user.changePassword(req.body.oldpassword, req.body.newpassword);
        req.flash('success','Heslo bylo změněno');
        res.redirect('/auth/user/profile');
    } else {
        req.flash('error','Nové heslo a Nové heslo pro kontrolu se musí shodovat');
        res.status(200).redirect('/auth/user/changePassword');
    } } catch (err) {
        if(err.message === "Password or username is incorrect"){
            req.flash('error','Nesprávné heslo');
        } else {
            req.flash('error','Omlouváme se, něco se nepovedlo');
        }
        res.status(400).redirect('/auth/user/changePassword');
    }
}))

//request forgotten password form (GET)
router.get('/auth/user/requestPassword', (req, res) => {
    res.status(200).render('auth/request_password');
})

//request forgotten password (POST) - NEDOKONČENO - Je třeba zaslat e-mail s linkem na změnu hesla a vytvořit nějaké id, aby to nemohl udělat kdokoliv
router.post('/auth/user/requestPassword', catchAsync(async(req, res) => {
    const user = await User.findOne({email: req.body.email});
    //check if user exists
    if(!user){
        req.flash('error','Uživatelské jméno neexistuje');
        return res.redirect('/auth/user/requestPassword');
    }
    //create original passChangeId on user
    const passChangeId = uuid.v1();
    user.passChangeId = passChangeId;
    await user.save();
    //sent e-mail with link to user
    const changeLink = `/auth/user/setPassword/${passChangeId}`;
    const data = {link: changeLink, email: user.email};
    mail.forgottenPassword(data);
    res.status(200).render('auth/password_sent');
}))

//set password FORM (GET)
router.get('/auth/user/setPassword/:passChangeId', catchAsync(async(req, res) => {
    const user = await User.findOne({passChangeId: req.params.passChangeId});
    const {passChangeId} = req.params;
    if(!user){
        req.status(400).flash('error','Uživatel s passChangeId nenalezen.');
        return res.redirect('/');
    } else {
        res.status(200).render('auth/set_password', {passChangeId});
    }
}))

//set password POST 
router.post('/auth/user/setPassword/:passChangeId', catchAsync(async(req, res) => {
    const user = await User.findOne({passChangeId: req.params.passChangeId});
    if(!user){
        req.flash('error','Uživatel s passChangeId nenalezen.');
        return res.redirect('/');
    } else if(req.body.newpassword === req.body.newpasswordcheck){
        await user.setPassword(req.body.newpassword);
        await user.save();
        req.login(user, err => {
            if (err) return next(err);
        })
        req.flash('success','Heslo bylo změněno')
        res.status(200).redirect('/');
    } else {
        req.flash('error','Nové heslo a Nové heslo pro kontrolu se musí shodovat');
        res.status(400).redirect(`/auth/user/setPassword/${req.params.passChangeId}`);
    }
}))


module.exports = router;