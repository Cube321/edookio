const { cardSchema } = require('../schemas.js');
const { userSchema } = require('../schemas.js');
const { sectionSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');

const middleware = {};

middleware.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if(req.params.category === "demo"){
        return next();
    }
    if (!req.isAuthenticated()) {
        req.flash('error','Pro přístup nemáte dostatečná oprávnění.');
        return res.redirect('/auth/user/login');
    }
    next();
}

middleware.isAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    } else {
        req.flash('error','Tuto operaci může provést pouze administrátor.');
        res.redirect('back');
    }
}

middleware.isPremiumUser = (req, res, next) => {
    if(req.user.isPremium){
        next();
    } else {
        req.flash('error','Tato sekce je přístupná pouze uživatelům Premium.');
        res.redirect('back');
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

module.exports = middleware;