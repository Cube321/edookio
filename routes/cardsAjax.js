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

//repeat section - filter section out of the array of finished sections
router.get('/category/:category/section/:sectionId/cardAjax/repeatSection', isLoggedIn, catchAsync(async(req, res) => {
    const {user} = req;
    const foundSection = await Section.findById(req.params.sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    const filteredSections = user.sections.filter(section => section.toString() !== foundSection._id.toString());
    user.sections = filteredSections;
    await user.save();
    res.status(200).redirect(`/category/${req.params.category}/section/${req.params.sectionId}/cardAjax/1`);
}))

//show Card of Section
router.get('/category/:category/section/:sectionId/cardAjax/:cardNum', isLoggedIn, catchAsync(async(req, res, next) => {
    const { sectionId, category } = req.params;
    const {user} = req;
    let cardNum = parseInt(req.params.cardNum);
    if(!Number.isInteger(cardNum)){
        throw Error("Zadané číslo karty není ve správném formátu.");
    }
    //handle request for previous card if that card is #1
    let requestedPreviousCardOne = false;
    if(cardNum === 0){
        cardNum = 1;
        requestedPreviousCardOne = true;
    }
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
            
            return res.status(200).render('sections/finishedLive',{category, section: foundSection, nextSection});
        } else {
            //user not logged in - in demo section
            return res.status(200).render('sections/finishedDemo',{category, sectionName: foundSection.name});
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
    if((cardNum === 1 && requestedPreviousCardOne === false) || req.query.continue === "continue"){
        res.status(200).render('cards/showAjax', {card: foundCard, nextNum, sectionName: foundSection.name, sectionLength, progressStatus, isCardSaved, user, numOfCards: foundSection.cards.length});
    } else {
        res.status(200).send({card: foundCard, nextNum, sectionName: foundSection.name, sectionLength, progressStatus, isCardSaved, user, numOfCards: foundSection.cards.length});
    }
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