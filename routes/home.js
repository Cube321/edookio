const express = require('express');
const Category = require('../models/category');
const Card = require('../models/card');
const Section = require('../models/section');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isPremiumUser } = require('../utils/middleware');


//show homepage
router.get('/', isPremiumUser, catchAsync(async(req, res) => {
    const categories = await Category.find({});
    let numOfCategories = categories.length - 1;
    const numOfCards = await Card.count();
    const numOfSections = await Section.count();
    let trestnipravo = "";
    let obcanskepravo = "";
    let spravnipravo = "";
    let ustavnipravo = "";
    let obchodnipravo = "";
    let pravnickaanglictina = "";
    let trestniproces = "";
    let civilniproces = "";
    categories.forEach(cat => {
        if(cat.name === "trestnipravo"){trestnipravo = cat};
        if(cat.name === "obcanskepravo"){obcanskepravo = cat};
        if(cat.name === "spravnipravo"){spravnipravo = cat};
        if(cat.name === "ustavnipravo"){ustavnipravo = cat};
        if(cat.name === "obchodnipravo"){obchodnipravo = cat};
        if(cat.name === "pravnickaanglictina"){pravnickaanglictina = cat};
        if(cat.name === "trestniproces"){trestniproces = cat};
        if(cat.name === "civilniproces"){civilniproces = cat};
    })
    res.status(200).render('index', {trestnipravo, obcanskepravo, spravnipravo, ustavnipravo, obchodnipravo, pravnickaanglictina, trestniproces, civilniproces, numOfCards, numOfSections, numOfCategories});
}))

module.exports = router;