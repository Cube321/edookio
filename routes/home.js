const express = require('express');
const Category = require('../models/category');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

//show homepage
router.get('/', catchAsync(async(req, res) => {
    const categories = await Category.find({});
    let trestnipravo = "";
    let obcanskepravo = "";
    let spravnipravo = "";
    let ustavnipravo = "";
    let obchodnipravo = "";
    let mezinarodnipravo = "";
    categories.forEach(cat => {
        if(cat.name === "trestnipravo"){trestnipravo = cat};
        if(cat.name === "obcanskepravo"){obcanskepravo = cat};
        if(cat.name === "spravnipravo"){spravnipravo = cat};
        if(cat.name === "ustavnipravo"){ustavnipravo = cat};
        if(cat.name === "obchodnipravo"){obchodnipravo = cat};
        if(cat.name === "mezinarodnipravo"){mezinarodnipravo = cat};
    })
    res.status(200).render('index', {trestnipravo, obcanskepravo, spravnipravo, ustavnipravo, obchodnipravo, mezinarodnipravo});
}))

module.exports = router;