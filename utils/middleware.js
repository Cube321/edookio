const { cardSchema } = require('../schemas.js');
const { userSchema } = require('../schemas.js');
const { sectionSchema } = require('../schemas.js');
const { questionSchema } = require('../schemas.js');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const moment = require('moment');
const mail = require('../mail/mail_inlege');


const middleware = {};

middleware.isLoggedIn = async (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error','Pro přístup nemáte dostatečná oprávnění.');
        return res.redirect('/auth/user/login');
    }
    if(req.user.isPremium){
        await checkAndUpdatePremiumEndDate(req.user);
    }
    next();
}

const checkAndUpdatePremiumEndDate = async (user) => {
    const today = Date.now();
    const {endDate} = user;
        if(moment(today).format() > moment(endDate).format()){
            const foundUser = await User.findById(user._id);
            foundUser.isPremium = false;
            foundUser.premiumGrantedByAdmin = false;
            foundUser.endDate = null;
            foundUser.plan = "none";
            await foundUser.save()
            mail.sendPremiumEnded(foundUser.email);
        }
}

middleware.isAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    } else {
        req.flash('error','Tuto operaci může provést pouze administrátor.');
        res.redirect('back');
    }
}

middleware.isEditor = (req, res, next) => {
    if(req.user.isEditor || req.user.admin){
        next();
    } else {
        req.flash('error','Tuto operaci může provést pouze editor nebo administrátor.');
        res.redirect('back');
    }
}

middleware.isPremiumUser = async (req, res, next) => {
    if(req.user && req.user.isPremium){
        await checkAndUpdatePremiumEndDate(req.user); 
        next();
    } else {
        next();
    }
}

//has to contain all elements of a mongoose schema even if no validation on them is required
middleware.validateCard = (req, res, next) => {
    const { error } = cardSchema.validate(req.body);
    if (error) {
        req.flash('error',error.message);
        return res.redirect('/');
    } else {
        next();
    }
}

middleware.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    } else {
        next();
    }
}

middleware.validateSection = (req, res, next) => {
    const { error } = sectionSchema.validate(req.body);
    if (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    } else {
        next();
    }
}

middleware.validateQuestion = (req, res, next) => {
    const { error } = questionSchema.validate(req.body);
    if (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    } else {
        next();
    }
}

module.exports = middleware;