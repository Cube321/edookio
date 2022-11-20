const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Card = require('../models/card');
const Section = require('../models/section');
const Category = require('../models/category');
const { categories } = require('../utils/categories');
const { validateCard, isLoggedIn, isAdmin } = require('../utils/middleware');
const section = require('../models/section');
const user = require('../models/user');

//show a specific card
router.get('/cards/show/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    const section = await Section.findById(card.section);
    const sectionLength = section.cards.length;
    const nextNum = 1;
    res.render('cards/show', {card, sectionName: section.name, nextNum, sectionLength});
}))

//render new card page (GET)
router.get('/category/:category/section/:sectionId/newCard', isLoggedIn, isAdmin, catchAsync(async(req, res, next) => {
    const {category, sectionId} = req.params;
    const foundSection = await Section.findById(sectionId);
    res.render('cards/new', {category, sectionId, sectionName: foundSection.name});
}))

router.get('/category/:category/section/:sectionId/listAllCards', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const section = await Section.findById(req.params.sectionId).populate('cards');
    res.render('sections/listAllCards', {section});
}))

router.get('/category/:category/section/:sectionId/publish', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    foundSection.isPublic = true;
    await foundSection.save();
    req.flash('success','Sekce byla zveřejněna');
    res.redirect(`/category/${req.params.category}`);
}))

router.get('/category/:category/section/:sectionId/repeatSection', isLoggedIn, catchAsync(async(req, res) => {
    const {user} = req;
    const foundSection = await Section.findById(req.params.sectionId);
    console.log(user.sections);
    const filteredSections = user.sections.filter(section => section.toString() !== foundSection._id.toString());
    user.sections = filteredSections;
    await user.save();
    console.log(user);
    res.redirect(`/category/${req.params.category}/section/${req.params.sectionId}/1`);
}))

//show Card of Section
router.get('/category/:category/section/:sectionId/:cardNum', isLoggedIn, catchAsync(async(req, res, next) => {
    const { sectionId, category } = req.params;
    const {user} = req;
    const cardNum = parseInt(req.params.cardNum);
    const foundSection = await Section.findById(sectionId);
    const cardNumEdited = cardNum - 1;
    let nextNum = parseInt(cardNum) + 1;
    if(foundSection.cards.length === cardNumEdited){
        if(req.user){
            user.sections.push(foundSection._id);
            await user.save();
            return res.render('sections/finished', {category, sectionName: foundSection.name, demo: false});
        } else {
            //user not logged in - in demo section
            return res.render('sections/finished', {category, sectionName: foundSection.name, demo: true});
        }
        
    }
    if(cardNumEdited < 0 || cardNum > foundSection.cards.length){
        req.flash('error','Zadané číslo karty nebylo nalezeno.');
        return res.redirect('/');
    }
    //data for progress bar
    let progressStep = Math.round(100 / foundSection.cards.length);
    let progressStatus = progressStep * (cardNum-1);
    const cardId = foundSection.cards[cardNumEdited];
    const foundCard = await Card.findById(cardId);
    //increase user's cardsSeen by 1
    user.cardsSeen++;
    user.save();
    const sectionLength = foundSection.cards.length;
    res.render('cards/show', {card: foundCard, nextNum, sectionName: foundSection.name, sectionLength, progressStatus});
}))

//add new card - save (POST)
router.post('/category/:category/section/:sectionId/newCard', validateCard, isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const {pageA, pageB, author} = req.body;
    const {category, sectionId } = req.params;
    const newCard = new Card({
        category,
        section: sectionId,
        pageA,
        pageB,
        author
    })
    const foundSection = await Section.findById(sectionId);
    const createdCard = await newCard.save();
    const foundCategory = await Category.findOne({name: req.params.category});
    foundCategory.numOfCards++;
    await foundCategory.save();
    foundSection.cards.push(createdCard._id);
    await foundSection.save();
    req.flash('success','Kartička byla přidána do databáze.');
    res.redirect(`/category/${category}/section/${sectionId}/listAllCards`);
}))

//edit card - form (GET)
router.get('/cards/edit/:id', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    res.render('cards/edit', {card, categories});
}))

//edit card - save (PUT)
router.put('/cards/edit/:id', validateCard, isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const {pageA, pageB, author} = req.body;
    const foundCard = await Card.findByIdAndUpdate(id, {pageA, pageB, author});
    req.flash('success','Kartička byla aktualizována.');
    res.redirect(`/category/${foundCard.category}/section/${foundCard.section}/listAllCards`);
}))

//remove card (GET)
router.get('/cards/remove/:id', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const foundCard = await Card.findById(id);
    await Section.findByIdAndUpdate(foundCard.section, {$pull: {cards: id}});
    await Card.findByIdAndDelete(id);
    const foundCategory = await Category.findOne({name: foundCard.category});
    foundCategory.numOfCards--;
    await foundCategory.save();
    req.flash('success','Kartička byla odstraněna.');
    res.redirect(`/category/${foundCard.category}/section/${foundCard.section}/listAllCards`);
}))

module.exports = router;