const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Stats = require('../models/stats');
const passport = require('passport');
const { isLoggedIn } = require('../utils/middleware');
const { validateUser } = require('../utils/middleware');
const uuid = require('uuid');
const mail = require('../mail/mail_inlege');
const Stripe = require('../utils/stripe');
const moment = require('moment');
const bcrypt = require('bcryptjs');

//PROFILE (show)
//my profile view page
router.get('/auth/user/profile', isLoggedIn, catchAsync(async(req, res) => {
    const {user} = req;
    await user.populate('invoicesDbObjects');
    let endDate = "";
    let dateOfRegistration = moment(user.dateOfRegistration).locale('cs').format('LL');
    if(user.isPremium){
        endDate = moment(user.endDate).locale('cs').format('LL')
    }
    res.status(200).render('auth/profile', {user, endDate, dateOfRegistration});
}))





//COOKIES LOGIC
//route after main "Povolit vše" btn clicked
router.get("/cookies-agreed",function(req, res){
	req.session.cookiesAgreed = true;
    req.session.cookiesAnalyticke = true;
    req.session.cookiesMarketingove = true;
	res.sendStatus(200);
});

router.get("/cookies-agreed-form",function(req, res){
	req.session.cookiesAgreed = true;
    req.session.cookiesAnalyticke = true;
    req.session.cookiesMarketingove = true;
    req.flash('success','Nastavení cookies bylo uloženo.');
	res.status(200).redirect('/');
});

//cookies consent form RENDER
router.get('/legal/cookies', catchAsync(async(req, res) => {
    let {cookiesAnalyticke, cookiesMarketingove} = req.session;
    res.status(200).render('legal/cookiesForm', {cookiesAnalyticke, cookiesMarketingove});
}))

//cookies consent form POST
router.post('/legal/cookies', catchAsync(async(req, res) => {
    let {analyticke, marketingove} = req.body;
    req.session.cookiesTechnicke = true;
    if(analyticke){req.session.cookiesAnalyticke = true} else {req.session.cookiesAnalyticke = false}
    if(marketingove){req.session.cookiesMarketingove = true} else {req.session.cookiesMarketingove = false}
    req.session.cookiesAgreed = true;
    req.flash('success','Nastavení cookies bylo uloženo.');
    res.status(200).redirect('/');
}))





//REGISTER LOGIC
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
    let {email, password, password_confirmation, key, firstname, lastname, faculty, source} = req.body;
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
            faculty = "neuvedeno";
        }
        //create cookies object
        let cookies = {
            technical: true,
            analytical: true,
            marketing: true
        }
        if(req.session.cookiesTechnicke){
            cookies = {
                technical: req.session.cookiesTechnicke,
                analytical: req.session.cookiesAnalyticke,
                marketing: req.session.cookiesMarketingove
            }
        }
        
        //create hashed password for the JWT used with mobile app
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const passwordJWT = hash;

        //register user
        const passChangeId = uuid.v1();
        const dateOfRegistration = Date.now();
        const customer = await Stripe.addNewCustomer(email);
        const user = new User({
            email, 
            username: email, 
            passwordJWT,
            admin, 
            dateOfRegistration, 
            firstname, 
            lastname, 
            passChangeId,
            billingId: customer.id,
            plan: "none",
            endDate: null,
            isGdprApproved: true,
            faculty,
            source,
            cookies
        });
        const newUser = await User.register(user, password);
        await req.login(newUser, err => {
            if (err) return next(err);
        })
        //send info e-mails
        mail.welcome(newUser.email);
        mail.adminInfoNewUser(newUser);
        //
        if(req.session.demoCardsSeen && req.session.demoCardsSeen > 5){
            incrementEventCount('registeredAfterDemoLimit');
        }
        req.flash('success', 'Skvělé! Účet byl vytvořen.');
        if(req.query.requiresPremium){
            res.status(201).redirect('/premium'); 
        } else {
            res.status(201).redirect('/'); 
        }
    } catch (err){
        if (err.message === 'A user with the given username is already registered'){
            req.flash('error', 'Uživatel již existuje.');
        } else {
            console.log(err);
            req.flash('error', 'Jejda, něco se nepovedlo.');
        }
        res.status(400).redirect('back');
    }
}))

async function incrementEventCount(eventName) {
    try {
      await Stats.findOneAndUpdate(
        { eventName },
        { $inc: { eventCount: 1 } },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Error updating event count:', err);
    }
  }





//LOGIN LOGIC
//login form (GET)
router.get('/auth/user/login', (req, res) => {
    res.status(200).render('auth/login_form');
})

//login request (POST)
router.post('/auth/user/login', passport.authenticate('local', {failureFlash: 'Nesprávné heslo nebo e-mail.', failureRedirect: '/auth/user/login'}), catchAsync(async (req, res) => {
    res.status(200).redirect('/');
}))

//logout request (GET)
router.get('/auth/user/logout', isLoggedIn, (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.status(200).redirect('/');
      });
    res.status(200).redirect('/');
})






//PASSWORD RELATED ROUTES
//change password (GET)
router.get('/auth/user/changePassword', isLoggedIn, (req, res) => {
    res.status(200).render('auth/change_password');
})

//change password (POST)
router.post('/auth/user/changePassword', isLoggedIn, catchAsync(async(req, res) => {
    try {
    if(req.body.newpassword === req.body.newpasswordcheck){
        const user = await User.findById(req.user._id);

        //create hashed password for the JWT used with mobile app
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.newpassword, salt);
        const passwordJWT = hash;

        user.passwordJWT = passwordJWT;
        await user.save();

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

//request forgotten password (POST)
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

        //create hashed password for the JWT used with mobile app
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.newpassword, salt);
        const passwordJWT = hash;

        user.passwordJWT = passwordJWT;

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






//DELETE ACOUNT LOGIC (user's route)
//delete account - USER ROUTE (deleting user's own account)
router.get('/auth/user/deleteMyAccount', isLoggedIn, catchAsync(async(req, res) => {
    let foundUser = await User.findById(req.user._id);
    if(foundUser.plan === "none"){
        await User.findByIdAndDelete(req.user._id);
        mail.adminInfoUserDeleted(foundUser.email);
        req.flash('success','Tvůj účet byl odstraněn.');
        res.status(201).redirect('/');
    } else {
        req.flash('error','Zdá se, že máš stále aktivní předplatné. Před odstraněním účtu jej prosím zruš.');
        res.redirect('/auth/user/profile');
    }
}))




//CHANGE FACULTY
//route to change faculty from profile page
router.post('/auth/user/changeFaculty', isLoggedIn, catchAsync(async(req, res) => {
    let foundUser = await User.findById(req.user._id);
    if(!foundUser){
        req.flash('error','Uživatel s tímto ID nebyl nenalezen.');
        return res.redirect('/auth/user/profile');
    }
    foundUser.faculty = req.body.faculty;
    await foundUser.save();
    res.status(200).redirect('/auth/user/profile');
}))



//CHANGE NICKNAME (LEADERBOARD)
//route to change faculty from profile page
router.post('/auth/user/changeNickname', isLoggedIn, catchAsync(async(req, res) => {
    let existingUser = await User.findOne({nickname: req.body.nickname});
    if(existingUser){
        req.flash('error','Tato přezdívka či jméno je již obsazena/o. Zvol si prosím jinou/é.');
        return res.redirect('/leaderboard');
    }
    let foundUser = await User.findById(req.user._id);
    if(!foundUser){
        req.flash('error','Uživatel s tímto ID nebyl nenalezen.');
        return res.redirect('/leaderboard');
    }
    foundUser.nickname = req.body.nickname;
    await foundUser.save();
    res.status(200).redirect('/leaderboard');
}))


module.exports = router;