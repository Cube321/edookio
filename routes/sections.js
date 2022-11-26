const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Section = require('../models/section');
const Category = require('../models/category');
const Card = require('../models/card');
const { isLoggedIn, isAdmin, validateSection, isPremiumUser } = require('../utils/middleware');
const {categories} = require('../utils/categories')

//show sections of category
router.get('/category/:category', isPremiumUser, catchAsync(async (req, res, next) => {
    const category = await Category.findOne({name: req.params.category}).populate('basicSections').populate('premiumSections').exec();
    if(!category){
        req.flash('error','Kategorie neexistuje.');
        return res.status(404).redirect('back');
    }
    let demoCat = {sections: []};
    if(!req.user){
        demoCat = await Category.findOne({name:"demo"});
    }
    let title = "";
    categories.forEach(c => {
        if(c.value === req.params.category){title = c.text};
    })
    res.status(200).render('category', {category, title, demoCat});
}))

//create new Category - new approach - service moved out of the route
router.get('/category/new/:categoryName', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const { categoryName } = req.params;
    await categoryService.create(categoryName);
    res.status(201).redirect(`/category/${categoryName}`);
}))

const categoryService = {};
categoryService.create = async (categoryName) => {
    const foundCategory = await Category.find({name: categoryName});
    if(foundCategory.length > 0){
        throw new Error('Kategorie již existuje!');
    }
    const newCategory = new Category({name: categoryName, sections: []});
    await newCategory.save();
}

//create new Section in Category
router.post('/category/:category/newSection', validateSection, isLoggedIn, isAdmin, catchAsync(async (req, res, next )=> {
    //check if category exists
    const foundCategory = await Category.findOne({name: req.params.category});
    if(!foundCategory){
        req.flash('error','Kategorie neexistuje.');
        return res.status(404).redirect('back');
    }
    //create new Section and add it to Category
    const categoryName = foundCategory.name;
    const {name, isPremium} = req.body;
    //isPremium logic
    let isPremiumBoolean = false;
    if(isPremium === "premium"){isPremiumBoolean = true};
    //create new section
    const newSection = new Section({
        name,
        category: categoryName,
        cards: [],
        isPremium: isPremiumBoolean
    })
    const savedSection = await newSection.save();
    if(savedSection.isPremium){
        foundCategory.premiumSections.push(savedSection._id);
    } 
    if(!savedSection.isPremium){
        foundCategory.basicSections.push(savedSection._id);
    } 
    await foundCategory.save();
    req.flash('success',`Sekce ${savedSection.name} byla vytvořena.`);
    res.status(200).redirect(`/category/${savedSection.category}`);
}))

//remove Section from Category and delete its Cards
router.get('/category/:category/removeSection/:sectionId', isLoggedIn, isAdmin, catchAsync(async(req, res, next) => {
    const { category, sectionId} = req.params;
    //delete Section ID from Category
    const foundSection = await Section.findById(sectionId);
    if(!foundSection){
        throw Error("Kategorie s tímto ID neexistuje");
    }
    let updatedCategory;
    if(foundSection.isPremium){
        updatedCategory = await Category.findOneAndUpdate({name: category}, {$pull: {basicSections: sectionId}});
        console.log('removed basic section from category array');
    } 
    if(foundSection.isPremium){
        updatedCategory = await Category.findOneAndUpdate({name: category}, {$pull: {premiumSections: sectionId}});
        console.log('removed premium section from category array');
    } 
    
    if(!updatedCategory){
        throw Error("Kategorie s tímto ID neexistuje");
    }
    //delete Cards in Section
    await Card.deleteMany({section: sectionId});
    //delete Section
    const deletedSection = await Section.findByIdAndDelete(sectionId);
    const foundCategory = await Category.findOne({name: req.params.category});
    foundCategory.numOfCards = foundCategory.numOfCards - deletedSection.cards.length;
    await foundCategory.save();
    req.flash('success','Sekce byla odstraněna.');
    res.status(200).redirect(`/category/${category}`);
}))

//changing order of the sections
router.get('/category/:category/sectionUp/:sectionId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const {sectionId, category} = req.params;
    const foundCategory = await Category.findOne({name: category});
    if(!foundCategory){
        throw Error("Kategorie s tímto ID neexistuje");
    }
    if(foundCategory.basicSections.includes(sectionId)){
        let fromIndex = foundCategory.basicSections.indexOf(sectionId);
        if(fromIndex !== 0){
        let toIndex = fromIndex--;
        let section = foundCategory.basicSections.splice(fromIndex, 1)[0];
        foundCategory.basicSections.splice(toIndex, 0, section);
        await foundCategory.save(); 
        }
    }
    if(foundCategory.premiumSections.includes(sectionId)){
        let fromIndex = foundCategory.premiumSections.indexOf(sectionId);
        if(fromIndex !== 0){
        let toIndex = fromIndex--;
        let section = foundCategory.premiumSections.splice(fromIndex, 1)[0];
        foundCategory.premiumSections.splice(toIndex, 0, section);
        await foundCategory.save(); 
        }
    }
    res.status(200).redirect(`/category/${category}`);
}))
router.get('/category/:category/sectionDown/:sectionId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const {sectionId, category} = req.params;
    const foundCategory = await Category.findOne({name: category});
    if(!foundCategory){
        throw Error("Kategorie s tímto ID neexistuje");
    }
    if(foundCategory.basicSections.includes(sectionId)){
        let fromIndex = foundCategory.basicSections.indexOf(sectionId);
        if(fromIndex < foundCategory.basicSections.length){
        let toIndex = fromIndex++;
        let section = foundCategory.basicSections.splice(fromIndex, 1)[0];
        foundCategory.basicSections.splice(toIndex, 0, section);
        await foundCategory.save(); 
        }
    }
    if(foundCategory.premiumSections.includes(sectionId)){
        let fromIndex = foundCategory.premiumSections.indexOf(sectionId);
        if(fromIndex < foundCategory.premiumSections.length){
        let toIndex = fromIndex++;
        let section = foundCategory.premiumSections.splice(fromIndex, 1)[0];
        foundCategory.premiumSections.splice(toIndex, 0, section);
        await foundCategory.save(); 
        }
    }
    res.status(200).redirect(`/category/${category}`);
}))

module.exports = router;