const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Section = require('../models/section');
const { isLoggedIn, isAdmin } = require('../utils/middleware');



//show sections of category
router.get('/category/:category', catchAsync(async (req, res, next) => {
    res.render('category');
}))

module.exports = router;