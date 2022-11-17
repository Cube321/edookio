const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Section = require('../models/section');
const Category = require('../models/category');
const Card = require('../models/card');
const { isLoggedIn, isAdmin, validateSection } = require('../utils/middleware');
const { cardSchema } = require('../schemas');



//show sections of category
router.get('/category/:category', catchAsync(async (req, res, next) => {
    const category = await Category.findOne({name: req.params.category}).populate('sections').exec();
    if(!category){
        req.flash('error','Kategorie neexistuje.');
        return res.redirect('back');
    }
    res.render('category', {category});
}))

//create new Category - change to PUSH for production
router.get('/category/new/:categoryName', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const { categoryName } = req.params;
    const newCategory = new Category({name: categoryName, sections: []});
    const savedCategory = await newCategory.save();
    res.send(savedCategory);
}))

//create new Section in Category
router.post('/category/:category/newSection', validateSection, catchAsync(async (req, res, next )=> {
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
router.get('/category/:category/removeSection/:sectionId', catchAsync(async(req, res, next) => {
    const { category, sectionId} = req.params;
    //delete Section ID from Category
    await Category.findOneAndUpdate({name: category}, {$pull: {sections: sectionId}});
    //delete Cards in Section
    await Card.deleteMany({section: sectionId});
    //delete Section
    await Section.findByIdAndDelete(sectionId);
    req.flash('success','Sekce byla odstraněna.');
    res.redirect(`/category/${category}`);
}))

module.exports = router;