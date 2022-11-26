const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Card = require('../models/card');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const Stripe = require('../utils/stripe');
const { findByIdAndDelete } = require('../models/user');
const moment = require('moment');



//show all registered users
router.get('/admin/listAllUsers', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});
    let updatedUsers = [];
    users.forEach(user => {
        let newUser = user;

        newUser.updatedDateOfRegistration = moment(user.dateOfRegistration).locale('cs').format('LL');
        updatedUsers.push(newUser);
    })
    res.status(200).render('admin/users', {users: updatedUsers});
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

//delete account
router.delete('/admin/:userId/deleteUser', catchAsync(async(req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.status(201).redirect('/admin/listAllUsers');
}))

module.exports = router;