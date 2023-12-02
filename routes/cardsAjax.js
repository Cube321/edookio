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
const { validateCard, isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');

//repeat section (incl. filter section out of the array of finished sections)
router.get('/category/:category/section/:sectionId/cardAjax/repeatSection', isLoggedIn, catchAsync(async(req, res) => {
    const {user} = req;
    const foundSection = await Section.findById(req.params.sectionId);
    if(!foundSection){
        throw Error("Sekce s tímto ID neexistuje");
    }
    const filteredSections = user.sections.filter(section => section.toString() !== foundSection._id.toString());
    user.sections = filteredSections;
    foundSection.countRepeated++;
    await foundSection.save();
    await user.save();
    res.status(200).redirect(`/category/${req.params.category}/section/${req.params.sectionId}/cardAjax/1?repeat=repeat`);
}))

//show Card of Section
router.get('/category/:category/section/:sectionId/cardAjax/:cardNum', catchAsync(async(req, res, next) => {
    const { sectionId, category } = req.params;
    const {user} = req;
    let cardNum = parseInt(req.params.cardNum);
    //DEMO MODE
    if(!user && !req.session.demoCardsSeen){
        req.session.demoCardsSeen = 1;
    } else if (!user && req.query.requestType !== "primaryData") {
        req.session.demoCardsSeen++;
    }
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
    //count section started
    if(cardNum === 1 && req.query.requestType !== "primaryData" && req.query.continue !== "continue" && req.query.repeat !== "repeat"){
        foundSection.countStarted++;
        await foundSection.save();
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
            if(req.query.redirectToFinished === "yes"){
                //remove section from unfinishedSections
                const filteredUnfinishedSections = user.unfinishedSections.filter(section => section.sectionId.toString() !== foundSection._id.toString());
                user.unfinishedSections = filteredUnfinishedSections;
                //add section to finished sections
                user.sections.push(foundSection._id);
            }
            //increase users cardsSeen by 1
            if(req.query.requestType !== "primaryData"){
                user.cardsSeen++;
                foundSection.countFinished++;
                await foundSection.save();
            }
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
                        nextSection = {name: "notValidId - udelejte prosim screen teto obrazovky a zaslete jej na mail jakub@inlege.cz"};
                    }
                }
            
            return res.status(200).render('sections/finishedLive',{category, section: foundSection, nextSection});
        } else {
            //user not logged in
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
    if(user && req.query.requestType !== "primaryData"){
        //increase users cardsSeen by 1
        user.cardsSeen++;
        //update lastSeenCard in unifnishedSection
        let unfinishedSectionIndex = user.unfinishedSections.findIndex(x => x.sectionId.toString() == foundSection._id.toString());
        if(unfinishedSectionIndex > -1 && req.query.continue !== "continue"){user.unfinishedSections[unfinishedSectionIndex].lastCard = cardNum - 1};
        //mark modified nested objects - otherwise Mongoose does not see it and save it
        user.markModified('unfinishedSections');
        await user.save();
    }
    if(user){
        //is card already saved?
        isCardSaved = isCardInArray(user.savedCards, cardId.toString());
    }
    let categories = await Category.find({});
    let iconPath = selectIconForSection(category, categories);
    const sectionLength = foundSection.cards.length;
    if((cardNum === 1 && requestedPreviousCardOne === false) || req.query.continue === "continue"){
        res.status(200).render('cards/showAjax', {
            card: foundCard, 
            nextNum, 
            sectionName: foundSection.name, 
            sectionLength, 
            progressStatus, 
            isCardSaved, 
            user, 
            numOfCards: foundSection.cards.length, 
            demoCardsSeen: req.session.demoCardsSeen,
            iconPath
        });
    } else {
        res.status(200).send({
            card: foundCard, 
            nextNum, 
            sectionName: foundSection.name, 
            sectionLength, 
            progressStatus, 
            isCardSaved, 
            user, 
            numOfCards: foundSection.cards.length, 
            demoCardsSeen: req.session.demoCardsSeen,
            iconPath
        });
    }
}))

//show one specific card (for editors only)
router.get('/cards/show/:id', isLoggedIn, isEditor, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    const section = await Section.findById(card.section);
    let categories = await Category.find({});
    const sectionLength = section.cards.length;
    const nextNum = 1;
    let isCardSaved = isCardInArray(req.user.savedCards, id);
    let iconPath = selectIconForSection(card.category, categories);
    res.status(200).render('cards/showAjax', {card, sectionName: section.name, nextNum, sectionLength, progressStatus: 0, isCardSaved, iconPath});
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

function selectIconForSection(category, categories){
    let iconPath = "";
    categories.forEach(cat => {
        if(cat.name === category){
            iconPath = `/img/${cat.icon}`
        }
    })
    return iconPath;
}



module.exports = router;