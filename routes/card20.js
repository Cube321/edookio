const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Card = require('../models/card');
const Section = require('../models/section');
const Category = require('../models/category');
const Stats = require('../models/stats'); 
const { isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');

//CARD 2.0 RENDER ROUTES
//render empty show card page
router.get('/category/:category/section/:sectionId/card20/:cardNum', catchAsync(async(req, res) => {
    let {sectionId, cardNum} = req.params;
    if(cardNum === "repeatSection"){
        cardNum = 1;
    }
    let foundSection = await Section.findById(req.params.sectionId).populate('cards');
    if(!foundSection){
        req.flash('error','Balíček se zadaným ID neexistuje.');
        return res.status(404).redirect('back');
    }
    //check if Premium access required and allowed
    if(foundSection.isPremium && !req.user.isPremium){
        req.flash('error','Je nám líto, tato sekce je přístupná pouze uživatelům Premium.');
        return res.status(403).redirect('back');
    }
    //handle lastSeenCard
    if(req.user){
        let user = req.user;
        //update lastSeenCard in unfinishedSection
        let unfinishedSectionIndex = user.unfinishedSections.findIndex(x => x.sectionId.toString() == sectionId.toString());
        if(unfinishedSectionIndex > -1){
            user.unfinishedSections[unfinishedSectionIndex].lastCard = parseInt(cardNum)
        } else {
            //create new unfinished section and push it to the array
            let newUnfinishedSection = {sectionId: sectionId, lastCard: 1};
            user.unfinishedSections.push(newUnfinishedSection);
            foundSection.countStarted++;
            await foundSection.save();
        };
        //mark modified nested objects - otherwise Mongoose does not see it and save it
        user.markModified('unfinishedSections');
        await user.save();
    }

    //xmas
    let xmas = false;
    if(process.env.xmas === "on"){
        xmas = true;
    }
    //icon for category
    let foundCategory = await Category.findOne({name: foundSection.category});
    if(!foundCategory){
        req.flash('error','Kategorie se zadaným názvem neexistuje.');
        return res.status(404).redirect('back');
    }
    res.render('cards/show20', {
        section: foundSection,
        xmas,
        categoryIcon: foundCategory.icon
    });
}))

//render finished page
router.get('/category/section/:sectionId/finished', catchAsync(async(req, res) => {
    console.log('running render finished page')
    let foundSection = await Section.findById(req.params.sectionId);
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
        if(req.user){
            let user = req.user;
            //remove section from unfinishedSections
            const filteredUnfinishedSections = user.unfinishedSections.filter(section => section.sectionId.toString() !== foundSection._id.toString());
            user.unfinishedSections = filteredUnfinishedSections;
            //add section to finished sections
            user.sections.push(foundSection._id);
            user.markModified('unfinishedSections');
            await user.save();
            
            //increase finishedSection count by 1
            foundSection.countFinished++;
            await foundSection.save();

            res.render('sections/finishedLive', {
                category: foundSection.category,
                section: foundSection,
                nextSection
            });
        } else {
            return res.status(200).render('sections/finishedDemo',{
                category: foundSection.category, 
                sectionName: foundSection.name
            });
        }
    
}))


//repeat section (incl. filter section out of the array of finished sections)
router.get('/category/:category/section/:sectionId/card20/repeatSection', isLoggedIn, catchAsync(async(req, res) => {
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
    res.status(200).redirect(`/category/${foundSection.category}/section/${foundSection._id}/card20/1`);
}))

module.exports = router;
