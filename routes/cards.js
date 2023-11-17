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
const { validateCard, isLoggedIn, isAdmin } = require('../utils/middleware');

//demo flip
router.get("/demoFlip", (req, res)=> {
    res.render('flipCardByChatGPT');
})

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
    let isCardSaved = isCardInArray(req.user.savedCards, id);
    res.status(200).render('cards/show', {card, sectionName: section.name, nextNum, sectionLength, progressStatus: 0, isCardSaved});
}))

//render new card page (GET)
router.get('/category/:category/section/:sectionId/newCard', isLoggedIn, isAdmin, catchAsync(async(req, res, next) => {
    const {category, sectionId} = req.params;
    const foundSection = await Section.findById(sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    res.status(200).render('cards/new', {category, sectionId, sectionName: foundSection.name});
}))

//list all cards in section
router.get('/category/:category/section/:sectionId/listAllCards', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const section = await Section.findById(req.params.sectionId).populate('cards');
    if(!section){
        throw Error("Sekce s tímto ID neexistuje");
    }
    res.status(200).render('sections/listAllCards', {section});
}))

//publish section
router.get('/category/:category/section/:sectionId/publish', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    foundSection.isPublic = true;
    await foundSection.save();
    req.flash('success','Sekce byla zveřejněna');
    res.status(200).redirect(`/category/${req.params.category}`);
}))

//repeat section - filter section out of the array of finished sections
router.get('/category/:category/section/:sectionId/repeatSection', isLoggedIn, catchAsync(async(req, res) => {
    const {user} = req;
    const foundSection = await Section.findById(req.params.sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    const filteredSections = user.sections.filter(section => section.toString() !== foundSection._id.toString());
    user.sections = filteredSections;
    await user.save();
    res.status(200).redirect(`/category/${req.params.category}/section/${req.params.sectionId}/1`);
}))

//show Card of Section
router.get('/category/:category/section/:sectionId/:cardNum', isLoggedIn, catchAsync(async(req, res, next) => {
    const { sectionId, category } = req.params;
    const {user} = req;
    const cardNum = parseInt(req.params.cardNum);
    const foundSection = await Section.findById(sectionId);
    //update date of user's last activity
    if(user){
        user.lastActive = moment();
    }
    //check if section exists
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    //check if Premium access required and allowed
    if(foundSection.isPremium && !user.isPremium){
        req.flash('error','Je nám líto, tato sekce je přístupná pouze uživatelům Premium.');
        return res.status(403).redirect('back');
    }
    //add unfinished section
    if(user && cardNum === 1){
        //filter out this section if already in the array (case: user views card num 1 repeatedly)
        const filteredUnfinishedSections = user.unfinishedSections.filter(section => section.sectionId.toString() !== foundSection._id.toString());
        user.unfinishedSections = filteredUnfinishedSections;
        //create new unfinished section and push it to the array
        let newUnfinishedSection = {sectionId: sectionId, lastCard: 1};
        user.unfinishedSections.push(newUnfinishedSection);
    }
    //cards counting logic
    const cardNumEdited = cardNum - 1;
    let nextNum = parseInt(cardNum) + 1;
    
    //section finished logic
    if(foundSection.cards.length === cardNumEdited){
        if(req.user){
            //remove section from unfinishedSections
            const filteredUnfinishedSections = user.unfinishedSections.filter(section => section.sectionId.toString() !== foundSection._id.toString());
            user.unfinishedSections = filteredUnfinishedSections;
            //add section to finished sections
            user.sections.push(foundSection._id);
            await user.save();
            //get name of next section
                let nextSection = "notDefined";
                //check if string is valid ObjectID
                let isValidId = mongoose.isValidObjectId(foundSection.nextSection);
                if (isValidId){
                    nextSection = await Section.findById(foundSection.nextSection);
                    if(!nextSection){
                        nextSection = {name: "nenalezena"}
                    }
                } else {
                    if(foundSection.nextSection === "lastSection"){
                        nextSection = {name: "lastSection"};
                    } else {
                        nextSection = {name: "notValidId - udelejte prosim screen teto obrazovky a zaslete jej na mail info@inlege.cz"};
                    }
                }
            
            return res.status(200).render('sections/finishedLive', {category, section: foundSection, nextSection});
        } else {
            //user not logged in - in demo section
            return res.status(200).render('sections/finishedDemo', {category, sectionName: foundSection.name});
        }
        
    }
    if(cardNumEdited < 0 || cardNum > foundSection.cards.length){
        req.flash('error','Zadané číslo karty nebylo nalezeno.');
        return res.status(200).redirect('/');
    }
    //data for progress bar
    let progressStep = 100 / foundSection.cards.length;
    let progressStatus = progressStep * (cardNum);
    progressStatus = Math.round(progressStatus - 1);
    const cardId = foundSection.cards[cardNumEdited];
    const foundCard = await Card.findById(cardId);
    //
    let isCardSaved = false;
    //update users data
    if(user){
        //increase users cardsSeen by 1
        user.cardsSeen++;
        //update lastSeenCard in unifnishedSection
        let unfinishedSectionIndex = user.unfinishedSections.findIndex(x => x.sectionId.toString() == foundSection._id.toString());
        if(unfinishedSectionIndex > -1){user.unfinishedSections[unfinishedSectionIndex].lastCard = cardNum};
        //mark modified nested objects - otherwise Mongoose does not see it and save it
        user.markModified('unfinishedSections');
        //is card already saved?
        isCardSaved = isCardInArray(user.savedCards, cardId.toString());
        //save
        user.save();
    }
    const sectionLength = foundSection.cards.length;
    res.status(200).render('cards/show', {card: foundCard, nextNum, sectionName: foundSection.name, sectionLength, progressStatus, isCardSaved});
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
router.get('/cards/edit/:id', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    res.status(200).render('cards/edit', {card, categories});
}))

//edit card - save (PUT)
router.put('/cards/edit/:id', validateCard, isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
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
router.get('/cards/remove/:id', isLoggedIn, isAdmin, catchAsync(async (req, res, next) => {
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

router.get('/cards/report/solved/:cardId/:userEmail', isLoggedIn, isAdmin, catchAsync(async(req,res) => {
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
    let categoriesWithoutDemo = categories.filter(cat => cat.value !== "demo");
    res.render('cards/savedCards', {savedCards: foundUser.savedCards, categories: categoriesWithoutDemo});
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