const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Card = require('../models/card');
const Section = require('../models/section');
const { categories } = require('../utils/categories');
const { validateCard, isLoggedIn } = require('../utils/middleware');
const section = require('../models/section');

//show a specific card
router.get('/cards/show/:id', catchAsync(async (req, res, next) => {
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

//show Card of Section
router.get('/category/:category/section/:sectionId/:cardNum', catchAsync(async(req, res, next) => {
    const { sectionId } = req.params;
    const cardNum = parseInt(req.params.cardNum);
    const foundSection = await Section.findById(sectionId);
    const cardNumEdited = cardNum - 1;
    let nextNum = parseInt(cardNum) + 1;
    if(foundSection.cards.length === cardNumEdited){
        req.flash('success','Balíček byl dokončen. Gratulujeme!');
        return res.redirect(`/category/${foundSection.category}`);
    }
    if(cardNumEdited < 0 || cardNum > foundSection.cards.length){
        req.flash('error','Zadané číslo karty nebylo nalezeno.');
        return res.redirect('/');
    }
    const cardId = foundSection.cards[cardNumEdited];
    const foundCard = await Card.findById(cardId);
    const sectionLength = foundSection.cards.length;
    res.render('cards/show', {card: foundCard, nextNum, sectionName: foundSection.name, sectionLength});
}))

//render new card page (GET)
router.get('/category/:category/:sectionId/newCard', isLoggedIn, catchAsync(async(req, res, next) => {
    const {category, sectionId} = req.params;
    const foundSection = await Section.findById(sectionId);
    res.render('cards/new', {category, sectionId, sectionName: foundSection.name});
}))

//add new card - save (POST)
router.post('/category/:category/:sectionId/newCard', validateCard, catchAsync(async (req, res, next) => {
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
    foundSection.cards.push(createdCard._id);
    await foundSection.save();
    req.flash('success','Kartička byla přidána do databáze.');
    res.redirect(`/cards/show/${createdCard.id}`);
}))

//edit card - form (GET)
router.get('/cards/edit/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    res.render('cards/edit', {card, categories});
}))

//edit card - save (PUT)
router.put('/cards/edit/:id', validateCard, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const {pageA, pageB, author} = req.body;
    await Card.findByIdAndUpdate(id, {pageA, pageB, author});
    req.flash('success','Kartička byla aktualizována.');
    res.redirect(`/cards/show/${id}`);
}))

//remove card (GET)
router.get('/cards/remove/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const foundCard = await Card.findById(id);
    await Section.findByIdAndUpdate(foundCard.section, {$pull: {cards: id}});
    await Card.findByIdAndDelete(id);
    req.flash('success','Kartička byla odstraněna.');
    res.redirect('/admin/listallcards');
}))

module.exports = router;