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
    let trestniproces = "";
    let civilniproces = "";
    categories.forEach(cat => {
        if(cat.name === "trestnipravo"){trestnipravo = cat};
        if(cat.name === "obcanskepravo"){obcanskepravo = cat};
        if(cat.name === "spravnipravo"){spravnipravo = cat};
        if(cat.name === "ustavnipravo"){ustavnipravo = cat};
        if(cat.name === "obchodnipravo"){obchodnipravo = cat};
        if(cat.name === "mezinarodnipravo"){mezinarodnipravo = cat};
        if(cat.name === "trestniproces"){trestniproces = cat};
        if(cat.name === "civilniproces"){civilniproces = cat};
    })
    res.status(200).render('index', {trestnipravo, obcanskepravo, spravnipravo, ustavnipravo, obchodnipravo, mezinarodnipravo, trestniproces, civilniproces});
}))

module.exports = router;