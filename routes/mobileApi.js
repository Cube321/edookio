const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Section = require('../models/section');
const Category = require('../models/category');

router.get('/mobileApi/getCategories', catchAsync(async(req, res) => {
    const categories = await Category.find();
    sortByOrderNum(categories);
    const letFilteredCategories = categories.filter((cat) => cat.orderNum >= 0);
    res.status(200).json(letFilteredCategories);
}))

router.get('/mobileApi/getSections', catchAsync(async(req, res) => {
    let {categoryName} = req.query;
    const category = await Category.findOne({name: categoryName}).populate('sections');
    res.status(200).json(category.sections);
}))

router.get('/mobileApi/getCards', catchAsync(async(req, res) => {
    let {sectionId} = req.query;
    const section = await Section.findById(sectionId).populate('cards');

    section.cards.forEach(card => {
        card.pageA = removeITags(card.pageA);
    })

    res.status(200).json(section.cards);
}))


//HELPERS
function sortByOrderNum(array) {
    // Use the Array.prototype.sort() method to sort the array
    array.sort((a, b) => a.orderNum - b.orderNum);
    // Return the sorted array
    return array;
  }


  function removeITags(str) {
    // Use regular expression to match <p> tags
    const regex = /<i>(.*?)<\/i>/g;
  
    // Replace <p> tags with <Text> tags
    return str.replace(regex, (match, p1) => {
      // p1 represents the content inside <p> tags
      return `${p1}`;
    });
  }

module.exports = router;