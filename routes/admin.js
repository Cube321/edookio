const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Card = require('../models/card');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const Stripe = require('../utils/stripe');



//show all registered users
router.get('/admin/listAllUsers', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render('admin/users', {users});
}))

//show all reported cards
router.get('/admin/listAllReports', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const cards = await Card.find({ factualMistakeReports: { $exists: true, $ne: [] } });
    res.render('admin/reports', {cards});
}))

router.get('/admin/:userId/upgradeToPremium', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const user = await User.findById(req.params.userId);
    if(!user){
        throw Error("Uživatel s tímto ID neexistuje");
    }
    user.isPremium = true;
    user.plan = "yearly";
    await user.save();
    req.flash('success','Uživatel je nyní Premium');
    res.redirect('/admin/listAllUsers');
}))

//cookies
router.get("/cookies-agreed",function(req, res){
	req.session.cookiesAgreed = true;
	res.sendStatus(200);
});

module.exports = router;