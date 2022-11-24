const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const Stripe = require('../utils/stripe');



//show all registered users
router.get('/admin/listAllUsers', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render('admin/users', {users});
}))

router.get('/admin/:userId/upgradeToPremium', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const user = await User.findById(req.params.userId);
    if(!user){
        throw Error("Uživatel s tímto ID neexistuje");
    }
    user.isPremium = true;
    await user.save();
    req.flash('success','Uživatel je nyní Premium');
    res.redirect('/admin/listAllUsers');
}))

module.exports = router;