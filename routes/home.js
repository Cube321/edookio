const express = require('express');
const Category = require('../models/category');
const Card = require('../models/card');
const Section = require('../models/section');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isPremiumUser } = require('../utils/middleware');


//SHOW HOMEPAGE + helper
router.get('/', isPremiumUser, catchAsync(async(req, res) => {
    const categories = await Category.find({});
    let numOfCategories = categories.length;
    const numOfCards = await Card.count();
    const numOfSections = await Section.count();
    sortByOrderNum(categories);
    res.status(200).render('index', {categories, numOfCards, numOfSections, numOfCategories});
}))

function sortByOrderNum(array) {
    // Use the Array.prototype.sort() method to sort the array
    array.sort((a, b) => a.orderNum - b.orderNum);
    // Return the sorted array
    return array;
  }


//SHOW PREMIUM PAGE
//premium explanation page
router.get('/premium', (req, res) => {
  if(process.env.XMAS === "on"){
    res.status(200).redirect('/vanoce');
  } else {
    res.status(200).render('premium');
  }
})

router.get('/vanoce', (req, res) => {
  if(process.env.XMAS === "on" || req.user.admin){
    //render Xmas Premium if Xmas = on or user is admin
    res.status(200).render('premiumXmas');
  } else {
    //else redirect to classic Premium
    req.flash('error','Vánoční nabídka není v této chvíli dostupná.');
    res.redirect('/premium');
  }
  
})




  //SHOW ABOUT page
router.get('/about', catchAsync(async(req, res) => {
  res.status(200).render('about');
}))

module.exports = router;