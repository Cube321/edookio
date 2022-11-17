const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn, isAdmin } = require('../utils/middleware');



//show all registered users
router.get('/admin/listAllUsers', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render('admin/users', {users});
}))

module.exports = router;