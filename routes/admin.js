const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Card = require('../models/card');
const { isLoggedIn, isAdmin } = require('../utils/middleware');



//show all cards in the DB
router.get('/admin/listallcards', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const allCards = await Card.find({});
    res.render('listAllCards', {cards: allCards});
}))

module.exports = router;