const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Card = require('../models/card');
const Section = require('../models/section');
const Category = require('../models/category');
const Stats = require('../models/stats'); 
const moment = require('moment');
const { isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');

//API ROUTES FOR SHOW CARDS
//get Cards of Section
router.get('/api/getCards/section/:sectionId', catchAsync(async(req, res) => {
    let {sectionId} = req.params;
    let foundSection = await Section.findById(sectionId).populate('cards');
    if(!foundSection){
        return res.status(404).send({error: "Section not found"});
    }
    let cards = foundSection.cards;
    
    //DEMO MODE
    let demoCardsSeen = 0;
    if(!res.user && !req.session.demoCardsSeen){
        req.session.demoCardsSeen = 1;
        demoCardsSeen = 1;
    } else if (!req.user) {
        req.session.demoCardsSeen++;
        demoCardsSeen = req.session.demoCardsSeen;
    }
    //is user and is premium
    let user = "none";
    if(req.user){
        user = req.user;
    }
    //check if the section is unfinished
    let startAt = 0;
    if(req.user){
        let unfinishedSectionIndex = user.unfinishedSections.findIndex(x => x.sectionId.toString() == sectionId.toString());
        if(unfinishedSectionIndex > -1){
            startAt = user.unfinishedSections[unfinishedSectionIndex].lastCard - 1;
        }
        //increase cardsSeen by 1
        user.cardsSeen++;
        await user.save();
    }

    //mark saved cards if user is logged in
    if(req.user){
        let markedCards = [];
        cards.forEach(card => {
            newCard = {
                _id: card._id,
                cagegory: card.category,
                pageA: card.pageA,
                pageB: card.pageB,
                author: card.author,
                section: card.section
            }
            if(req.user.savedCards.indexOf(newCard._id) > -1){
                newCard.isSaved = true;
            }
            markedCards.push(newCard);
        })
        cards = markedCards;
    }
    
    res.status(200).send({
        cards,
        user,
        startAt,
        demoCardsSeen
    });
}))

//update last seen Card of Section
router.post('/api/updateLastSeenCard/section/:sectionId/:cardNum', catchAsync(async(req, res) => {
    let {sectionId, cardNum} = req.params;
    //DEMO MODE
    let demoCardsSeen = 0;
    if (!req.user) {
        req.session.demoCardsSeen++;
        demoCardsSeen = req.session.demoCardsSeen;
    }
    //update unfinished section
    if(req.user){
        let user = req.user;
        //update lastSeenCard in unifnishedSection
        let unfinishedSectionIndex = user.unfinishedSections.findIndex(x => x.sectionId.toString() == sectionId.toString());
        if(unfinishedSectionIndex > -1){user.unfinishedSections[unfinishedSectionIndex].lastCard = parseInt(cardNum)};
        //mark modified nested objects - otherwise Mongoose does not see it and save it
        user.markModified('unfinishedSections');
        //update date of user's last activity
        user.lastActive = moment();
        //increase cardSeen by 1
        user.cardsSeen++;
        await user.save();
    }
    res.status(201).send({demoCardsSeen});
}))



module.exports = router;