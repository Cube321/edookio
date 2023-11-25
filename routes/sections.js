const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Section = require('../models/section');
const Category = require('../models/category');
const User = require('../models/user');
const Card = require('../models/card');
const { isLoggedIn, isAdmin, validateSection, isPremiumUser } = require('../utils/middleware');
const {categories} = require('../utils/categories')
const mongoose = require('mongoose');

//SHOW SECTIONS OF CATEGORY
router.get('/category/:category', isPremiumUser, catchAsync(async (req, res, next) => {

    const category = await Category.findOne({name: req.params.category}).populate('basicSections').populate('premiumSections').populate('sections').exec();
    if(!category){
        req.flash('error','Kategorie neexistuje.');
        return res.status(404).redirect('back');
    }
    //asign name of category
    let title = "";
    categories.forEach(c => {
        if(c.value === req.params.category){title = c.text};
    })
    //add data to user's unfinishedSections
    if(req.user){
        category.sections.forEach((section, index) => {
            let unfinishedSectionIndex = req.user.unfinishedSections.findIndex(x => x.sectionId.toString() == section._id.toString());
            if(unfinishedSectionIndex > -1){
                category.sections[index].isUnfinished = true;
                category.sections[index].lastSeenCard = req.user.unfinishedSections[unfinishedSectionIndex].lastCard;
            }
        })   
    }
    //render category page
    res.status(200).render('category', {category, title});
}))





//CATEGORY (create, edit, delete)
//create new Category - post ROUTE
router.post('/category/new', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    let {text, value, icon} = req.body;
    const foundCategory = await Category.find({name: value});
    if(foundCategory.length > 0){
        req.flash('error','Kategorie již existuje.')
        return res.redirect('/admin/categories');
    }
    const newCategory = new Category({name: value, sections: [], text, icon});
    let savedCategory = await newCategory.save();
    console.log(savedCategory);
    res.status(201).redirect(`/admin/categories`);
}))

//edit Category - render form
router.get('/category/edit/:categoryId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let {categoryId} = req.params;
    const foundCategory = await Category.findById(categoryId);
    if(!foundCategory){
        req.flash('error','Kategorie nebyla nelezena.')
        return res.redirect('/admin/categories');
    }
    res.status(200).render('admin/categoriesEdit', {category: foundCategory})
}))

//edit Category - update in the DB
router.put('/category/edit/:categoryId', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    let {categoryId} = req.params;
    let {text, icon} = req.body;
    const foundCategory = await Category.findById(categoryId);
    if(!foundCategory){
        req.flash('error','Kategorie nebyla nalezena.')
        return res.redirect('/admin/categories');
    }
    await Category.findByIdAndUpdate(categoryId, {text, icon});
    res.status(201).redirect(`/admin/categories`);
}))

//remove Category - delete from DB
router.delete('/category/remove/:categoryId', isLoggedIn, isAdmin, catchAsync(async(req, res)=> {
    let {categoryId} = req.params;
    const foundCategory = await Category.findById(categoryId);
    if(!foundCategory){
        req.flash('error','Kategorie nebyla nalezena.')
        return res.redirect('/admin/categories');
    }
    if (foundCategory.sections.length === 0){
        await Category.findByIdAndDelete(categoryId);
        req.flash('success','Kategorie byla odstraněna.');
    } else {
        req.flash('error',"Kategorie obsahuje balíčky. Nejdříve odstraň balíčky, poté bude možné kategorii smazat.");
    }
    res.status(200).redirect('/admin/categories');
}))






//SECTIONS IN CATEGORY
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
    const {name, isPremium, desc, nextSection} = req.body;
    //isPremium logic
    let isPremiumBoolean = false;
    if(isPremium === "premium"){isPremiumBoolean = true};
    //create new section
    const newSection = new Section({
        name,
        category: categoryName,
        cards: [],
        isPremium: isPremiumBoolean,
        shortDescription: desc,
        nextSection: nextSection
    })
    const savedSection = await newSection.save();
    foundCategory.sections.push(savedSection._id);
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
        throw Error("Sekce s tímto ID neexistuje");
    }
    let updatedCategory;
    //remove sections from category arrays
    if(!foundSection.isPremium){
        updatedCategory = await Category.findOneAndUpdate({name: category}, {$pull: {basicSections: sectionId, sections: sectionId}});
        console.log('removed basic section from category array');
    } 
    if(foundSection.isPremium){
        updatedCategory = await Category.findOneAndUpdate({name: category}, {$pull: {premiumSections: sectionId, sections: sectionId}});
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
    //remove section from list of unfinished sections of all users
    let searchQuery = mongoose.Types.ObjectId(sectionId);
    let foundUsersUnfinished = await User.find({ unfinishedSections: {$elemMatch: {sectionId: searchQuery.toString()}} });
    for (let user of foundUsersUnfinished) {
        let updatedSections = user.unfinishedSections.filter(section => section.sectionId !== searchQuery.toString())
        user.unfinishedSections = updatedSections;
        user.save();
    } 
    //remove section from list of finished sections of all users
    let foundUsersFinished = await User.find({ sections: searchQuery});
    for (let user of foundUsersFinished) {
        let updatedSections = user.sections.filter(section => section.toString() !== searchQuery.toString())
        user.sections = updatedSections;
        user.save();
    } 
    //flash a redirect
    req.flash('success','Sekce byla odstraněna.');
    res.status(200).redirect(`/category/${category}`);
}))

//edit section (name, description, next section)
router.get('/category/:category/editSection/:sectionId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    res.render('sections/edit', {section: foundSection});
}))

router.put('/category/:category/editSection/:sectionId',isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    let nextSection = req.body.next;
    let {name, desc} = req.body;
    foundSection.name = name;
    foundSection.shortDescription = desc;
    foundSection.nextSection = nextSection;
    await foundSection.save();
    res.status(201).redirect(`/category/${req.params.category}`);
}))

//changing order of the sections
router.get('/category/:category/sectionUp/:sectionId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const {sectionId, category} = req.params;
    const foundCategory = await Category.findOne({name: category});
    if(!foundCategory){
        throw Error("Kategorie s tímto ID neexistuje");
    }
    if(foundCategory.sections.includes(sectionId)){
        let fromIndex = foundCategory.sections.indexOf(sectionId);
        if(fromIndex !== 0){
        let toIndex = fromIndex--;
        let section = foundCategory.sections.splice(fromIndex, 1)[0];
        foundCategory.sections.splice(toIndex, 0, section);
        await foundCategory.save(); 
        }
    }
    res.status(200).redirect(`/category/${category}`);
}))
router.get('/category/:category/sectionDown/:sectionId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const {sectionId, category} = req.params;
    const foundCategory = await Category.findOne({name: category});
    if(!foundCategory){
        throw Error("Kategorie s tímto názvem neexistuje");
    }
    if(foundCategory.sections.includes(sectionId)){
        let fromIndex = foundCategory.sections.indexOf(sectionId);
        if(fromIndex < foundCategory.sections.length){
        let toIndex = fromIndex++;
        let section = foundCategory.sections.splice(fromIndex, 1)[0];
        foundCategory.sections.splice(toIndex, 0, section);
        await foundCategory.save(); 
        }
    }
    res.status(200).redirect(`/category/${category}`);
}))

router.get('/category/:category/sectionStatus/:sectionId/:changeDirection', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let {category, sectionId, changeDirection} = req.params;
    let foundSection = await Section.findById(sectionId);
    if(!foundSection){
        throw Error("Balíček s tímto ID neexistuje");
    }
    if(changeDirection === "toZdarma"){
        foundSection.isPremium = false;
    }
    if(changeDirection === "toPremium"){
        foundSection.isPremium = true;
    }
    await foundSection.save();
    res.status(200).redirect(`/category/${category}`);
}))



module.exports = router;