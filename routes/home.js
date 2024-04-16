const express = require('express');
const Category = require('../models/category');
const Card = require('../models/card');
const Question = require('../models/question');
const User = require('../models/user');
const Section = require('../models/section');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isPremiumUser } = require('../utils/middleware');


//SHOW HOMEPAGE + helper
router.get('/', isPremiumUser, catchAsync(async(req, res) => {
    const categories = await Category.find({});
    let numOfCategories = categories.length;
    const numOfCards = await Card.count();
    const numOfQuestions = await Question.count();
    const numOfSections = await Section.count();
    sortByOrderNum(categories);
    res.status(200).render('index', {categories, numOfCards, numOfQuestions, numOfSections, numOfCategories});
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
  let stripeEnv = process.env.STRIPE_ENV;
  if(process.env.XMAS === "on"){
    res.status(200).redirect('/vanoce');
  } else {
    res.status(200).render('premium', {stripeEnv});
  }
})

router.get('/vanoce', (req, res) => {
  let stripeEnv = process.env.STRIPE_ENV;
  if(process.env.XMAS === "on" || (req.user && req.user.admin)){
    //render Xmas Premium if Xmas = on or user is admin
    res.status(200).render('premiumXmas', {stripeEnv});
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




//CLASH OF FACULTIES
router.get('/soubojFakult', catchAsync(async(req, res) => {
  let totalSum = {};
  // Use the aggregation framework to sum up the numbers
  let prfukArray = await User.aggregate([{$match: {faculty: "PrF UK"}},{$group: {_id: null, total: { $sum: '$cardsSeen' }}}])
  totalSum.prfUk = prfukArray.length > 0 ? prfukArray[0].total : 0;

  let prfupArray = await User.aggregate([{$match: {faculty: "PrF UP"}},{$group: {_id: null, total: { $sum: '$cardsSeen' }}}])
  totalSum.prfUp = prfupArray.length > 0 ? prfupArray[0].total : 0;

  let prfmuniArray = await User.aggregate([{$match: {faculty: "PrF MUNI"}},{$group: {_id: null, total: { $sum: '$cardsSeen' }}}])
  totalSum.prfMuni = prfmuniArray.length > 0 ? prfmuniArray[0].total : 0;

  let prfzcuArray = await User.aggregate([{$match: {faculty: "PrF ZČU"}},{$group: {_id: null, total: { $sum: '$cardsSeen' }}}])
  totalSum.prfZcu = prfzcuArray.length > 0 ? prfzcuArray[0].total : 0;

  let prfjinaArray = await User.aggregate([{$match: {faculty: "Jiná"}},{$group: {_id: null, total: { $sum: '$cardsSeen' }}}])
  totalSum.prfJina = prfjinaArray.length > 0 ? prfjinaArray[0].total : 0;
  
  transformToPercent(totalSum);

  res.status(200).render('clash', { 
    
  });
}))

function transformToPercent(totalSum){
  let totalSumAll = totalSum.prfUk + totalSum.prfUp + totalSum.prfMuni + totalSum.prfZcu + totalSum.prfJina;
  // not finished
}

module.exports = router;