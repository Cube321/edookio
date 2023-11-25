const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Card = require('../models/card');
const Section = require('../models/section');
const User = require('../models/user');
const Category = require('../models/category');
const moment = require('moment');
const { categories } = require('../utils/categories');
const { validateCard, isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');


//show a specific card
router.get('/cards/show/:id', isLoggedIn, isEditor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    const section = await Section.findById(card.section);
    const sectionLength = section.cards.length;
    const nextNum = 1;
    let isCardSaved = isCardInArray(req.user.savedCards, id);
    res.status(200).render('cards/showAjax', {card, sectionName: section.name, nextNum, sectionLength, progressStatus: 0, isCardSaved});
}))

//render new card page (GET)
router.get('/category/:category/section/:sectionId/newCard', isLoggedIn, isEditor, catchAsync(async(req, res, next) => {
    const {category, sectionId} = req.params;
    const foundSection = await Section.findById(sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    res.status(200).render('cards/new', {category, sectionId, sectionName: foundSection.name});
}))

//list all cards in section
router.get('/category/:category/section/:sectionId/listAllCards', isLoggedIn, isEditor, catchAsync(async(req, res) => {
    const section = await Section.findById(req.params.sectionId).populate('cards');
    if(!section){
        throw Error("Sekce s tímto ID neexistuje");
    }
    res.status(200).render('sections/listAllCards', {section});
}))

//publish section
router.get('/category/:category/section/:sectionId/publish', isLoggedIn, isEditor, catchAsync(async(req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    foundSection.isPublic = true;
    await foundSection.save();
    req.flash('success','Sekce byla zveřejněna');
    res.status(200).redirect(`/category/${req.params.category}`);
}))

//add new card - save (POST)
router.post('/category/:category/section/:sectionId/newCard', validateCard, isLoggedIn, isEditor, catchAsync(async (req, res, next) => {
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
    const foundCategory = await Category.findOne({name: req.params.category});
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    if(!foundCategory){
        throw Error("Kategorie s tímto ID neexistuje");
    }
    const createdCard = await newCard.save();
    foundCategory.numOfCards++;
    await foundCategory.save();
    foundSection.cards.push(createdCard._id);
    await foundSection.save();
    req.flash('success','Kartička byla přidána do databáze.');
    res.status(201).redirect(`/category/${category}/section/${sectionId}/newCard`);
}))

//edit card - form (GET)
router.get('/cards/edit/:id', isLoggedIn, isEditor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    res.status(200).render('cards/edit', {card, categories});
}))

//edit card - save (PUT)
router.put('/cards/edit/:id', validateCard, isLoggedIn, isEditor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const {pageA, pageB, author} = req.body;
    const foundCard = await Card.findByIdAndUpdate(id, {pageA, pageB, author});
    if(!foundCard){
        throw Error("Kartička s tímto ID neexistuje");
    }
    req.flash('success','Kartička byla aktualizována.');
    res.status(201).redirect(`/category/${foundCard.category}/section/${foundCard.section}/listAllCards`);
}))

//remove card (GET)
router.get('/cards/remove/:id', isLoggedIn, isEditor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const foundCard = await Card.findById(id);
    if(!foundCard){
        throw Error("Kartička s tímto ID neexistuje");
    }
    await Section.findByIdAndUpdate(foundCard.section, {$pull: {cards: id}});
    await Card.findByIdAndDelete(id);
    const foundCategory = await Category.findOne({name: foundCard.category});
    foundCategory.numOfCards--;
    await foundCategory.save();
    
    //removed card from cards saved by users
    await User.updateMany({}, {$pull: {savedCards: id}});

    req.flash('success','Kartička byla odstraněna.');
    res.status(201).redirect(`/category/${foundCard.category}/section/${foundCard.section}/listAllCards`);
}))




//NAHLÁSTI CHYBU NA KARTĚ 
//render success page
router.get('/cards/report/success', (req,res) => {
    res.status(200).render('cards/reportSubmited')
})

router.get('/cards/report/solved/:cardId/:userEmail', isLoggedIn, isEditor, catchAsync(async(req,res) => {
    const foundCard = await Card.findById(req.params.cardId);
    if(!foundCard){
        throw Error("Kartička s tímto ID neexistuje");
    }
    const updatedReports = foundCard.factualMistakeReports.map(report => {
        if(report.user === req.params.userEmail){
            report.solved = true;
            return report;
        } else {
            return report;
        }
    });
    foundCard.factualMistakeReports = updatedReports;
    await Card.findByIdAndUpdate(req.params.cardId, foundCard);
    console.log(foundCard);
    res.status(200).redirect('/admin/listAllReports');
}))

//render report form
router.get('/cards/report/:cardId', isLoggedIn, catchAsync(async(req, res) => {
    const foundCard = await Card.findById(req.params.cardId);
    if(!foundCard){
        throw Error("Kartička s tímto ID neexistuje");
    }
    res.status(200).render('cards/report', {card: foundCard});
}))

//receive the message
router.post('/cards/report/:cardId', isLoggedIn, catchAsync(async(req, res) => {
    const foundCard = await Card.findById(req.params.cardId);
    if(!foundCard){
        throw Error("Kartička s tímto ID neexistuje");
    }
    const newReport = {
        date: Date.now(),
        reportMsg: req.body.reportMsg,
        solved: false,
        user: req.user.email
    }
    foundCard.factualMistakeReports.push(newReport);
    await foundCard.save();
    console.log(foundCard);
    res.status(201).redirect('/cards/report/success');
}))





//FAVOURITE CARDS LOGIC
//save card to favourites
router.post('/cards/save/:userEmail/:cardId', isLoggedIn, catchAsync(async(req, res) => {
    let foundUser = await User.findOne({email: req.params.userEmail});
    if(!foundUser){
        return res.sendStatus(404);
    }
    let isCardAlreadySaved = isCardInArray(foundUser.savedCards, req.params.cardId);
    if(!isCardAlreadySaved){
        foundUser.savedCards.push(req.params.cardId);
        await foundUser.save();
    }
    res.status(200).sendStatus(200);
}))

//remove card from favourites
router.post('/cards/unsave/:userEmail/:cardId', isLoggedIn, catchAsync(async(req, res) => {
    if(req.params.userEmail !== req.user.email){
        req.flash('error','Kartičku z uložených může odebrat jen uživatel, který ji uložil.')
        return res.redirect('back');
    }
    let foundUser = await User.findOne({email: req.params.userEmail});
    if(!foundUser){
        return res.sendStatus(404);
    }
    let updatedSavedCards = foundUser.savedCards.filter((item) => item.toString() !== req.params.cardId);
    foundUser.savedCards = updatedSavedCards;
    await foundUser.save();
    res.status(200).sendStatus(200);
}))

//show all saved cards
router.get('/cards/saved', isLoggedIn, catchAsync(async(req, res) => {
    let foundUser = await User.findById(req.user._id).populate('savedCards').select('savedCards');
    res.render('cards/savedCards', {savedCards: foundUser.savedCards, categories});
}))



//HELPERS
function isCardInArray(arrayOfIds, cardIdString) {
    let arrayOfStrings = arrayOfIds.map(item => item.toString());
    let isIncluded = arrayOfStrings.includes(cardIdString);
    if(isIncluded){
        return true;
    } else {
        return false;
    }
}



module.exports = router;