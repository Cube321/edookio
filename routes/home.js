const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

//show homepage
router.get('/', catchAsync(async(req, res) => {
    const categories = await Category.find({});
    const trestnipravo = categories[0];
    const obcanskepravo = categories[1];
    const spravnipravo = categories[2];
    const ustavnipravo = categories[3];
    const obchodnipravo = categories[4];
    const mezinarodnipravo = categories[5];
    res.render('index', {trestnipravo, obcanskepravo, spravnipravo, ustavnipravo, obchodnipravo, mezinarodnipravo});
}))

module.exports = router;