const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../utils/middleware');
const { validateUser } = require('../utils/middleware');

//register form user (GET)
router.get('/auth/user/new', (req, res) => {
    res.render('auth/register_form');
})

//register form admin (GET)
router.get('/auth/admin/new', (req, res) => {
    res.render('auth/admin_registr');
})

//register request (POST)
router.post('/auth/user/new', validateUser, catchAsync(async (req, res, next) => {
    const {email, password, password_confirmation, key} = req.body;
    //check password 
    if(password !== password_confirmation){
        req.flash('error','Obě zadaná hesla se musí shodovat.');
        return res.redirect('back');
    }
    try {
        //check for admin key
        let admin = false;
        if(key === process.env.adminRegKey) admin = true;
        //register user
        const user = new User({email, username: email, admin});
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) return next(err);
        })
        req.flash('success', 'Registrace proběhla úspěšně.');
        res.redirect('/');
    } catch (err){
        if (err.message === 'A user with the given username is already registered'){
            req.flash('error', 'Uživatel již existuje.');
        } else {
            req.flash('error', 'Jejda, něco se nepovedlo.');
        }
        res.redirect('back');
    }
}))

//login form (GET)
router.get('/auth/user/login', (req, res) => {
    res.render('auth/login_form');
})

//login request (POST)
router.post('/auth/user/login', passport.authenticate('local', {failureFlash: 'Nesprávné heslo nebo e-mail.', failureRedirect: '/auth/user/login'}), catchAsync(async (req, res) => {
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    req.flash('success','Přihlášení proběhlo úspěšně. Vítejte!');
    res.redirect(redirectUrl);
}))

//logout request (GET)
router.get('/auth/user/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.flash('success','Odhlášení bylo úspěšné.');
    res.redirect('/');
})


module.exports = router;