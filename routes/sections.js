const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Section = require('../models/section');
const Category = require('../models/category');
const Card = require('../models/card');
const { isLoggedIn, isAdmin, validateSection } = require('../utils/middleware');
const { cardSchema } = require('../schemas');
const {categories} = require('../utils/categories')

//show sections of category
router.get('/category/:category', catchAsync(async (req, res, next) => {
    const category = await Category.findOne({name: req.params.category}).populate('sections').exec();
    if(!category){
        req.flash('error','Kategorie neexistuje.');
        return res.redirect('back');
    }
    let demoCat = {sections: []};
    if(!req.user){
        demoCat = await Category.findOne({name:"demo"});
    }
    let title = "";
    categories.forEach(c => {
        if(c.value === req.params.category){title = c.text};
    })
    res.render('category', {category, title, demoCat});
}))

//create new Category
router.get('/category/new/:categoryName', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const { categoryName } = req.params;
    const newCategory = new Category({name: categoryName, sections: []});
    const savedCategory = await newCategory.save();
    res.redirect(`/category/${categoryName}`);
}))

//create new Section in Category
router.post('/category/:category/newSection', validateSection, isLoggedIn, isAdmin, catchAsync(async (req, res, next )=> {
    //check if category exists
    const foundCategory = await Category.findOne({name: req.params.category});
    if(!foundCategory){
        req.flash('error','Kategorie neexistuje.');
        return res.redirect('back');
    }
    //create new Section and add it to Category
    const categoryName = foundCategory.name;
    const {name} = req.body;
    const newSection = new Section({
        name,
        category: categoryName,
        cards: []
    })
    const savedSection = await newSection.save();
    foundCategory.sections.push(savedSection._id);
    const savedCategory = await foundCategory.save();
    req.flash('success',`Sekce ${savedSection.name} byla vytvořena.`);
    res.redirect(`/category/${savedSection.category}`);
}))

//remove Section from Category and delete its Cards
router.get('/category/:category/removeSection/:sectionId', isLoggedIn, isAdmin, catchAsync(async(req, res, next) => {
    const { category, sectionId} = req.params;
    //delete Section ID from Category
    await Category.findOneAndUpdate({name: category}, {$pull: {sections: sectionId}});
    //delete Cards in Section
    await Card.deleteMany({section: sectionId});
    //delete Section
    const deletedSection = await Section.findByIdAndDelete(sectionId);
    const foundCategory = await Category.findOne({name: req.params.category});
    foundCategory.numOfCards = foundCategory.numOfCards - deletedSection.cards.length;
    await foundCategory.save();
    req.flash('success','Sekce byla odstraněna.');
    res.redirect(`/category/${category}`);
}))

module.exports = router;