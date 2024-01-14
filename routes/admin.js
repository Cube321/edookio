const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Card = require('../models/card');
const Category = require('../models/category');
const Section = require('../models/section'); 
const Stats = require('../models/stats'); 
const { isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');
const moment = require('moment');
const mail = require('../mail/mail_inlege');

//ADMIN - SHOW ADMIN
//show all registered users
router.get('/admin/admin', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});
    const demoLimitReachedStats = await Stats.findOne({eventName: 'demoLimitReached'});
    registeredAfterDemoLimitStats = await Stats.findOne({eventName: 'registeredAfterDemoLimit'});
    if(!registeredAfterDemoLimitStats){registeredAfterDemoLimitStats = {eventCount: 0}}
    
    //count free and premium sections and cards separately
    const sectionsPremium = await Section.find({isPremium: true}).select('cards');
    const sectionsFree = await Section.find({isPremium: false}).select('cards');
    let cardsPremiumCount = 0;
    let cardsFreeCount = 0;
    let sectionsFreeCount = sectionsFree.length;
    let sectionsPremiumCount = sectionsPremium.length;
    sectionsPremium.forEach(section => {
        cardsPremiumCount = cardsPremiumCount + section.cards.length;
    })
    sectionsFree.forEach(section => {
        cardsFreeCount = cardsFreeCount + section.cards.length;
    })
        //count ratios - cards
        let cardsTotal = cardsFreeCount + cardsPremiumCount
        let freeCardRatio =  Math.round(100 / cardsTotal * cardsFreeCount);

        //count ratios
        let sectionsTotal = sectionsFreeCount + sectionsPremiumCount
        let freeSectionRatio =  Math.round(100 / sectionsTotal * sectionsFreeCount);
        let demoLimitRegistrationRatio = Math.round(100 / demoLimitReachedStats.eventCount * registeredAfterDemoLimitStats.eventCount);

    let updatedUsers = [];
    
    //count all users and premium users and count faculties
    let premiumUsersCount = 0;
    let activePremiumSubscriptions = 0;
    let registeredUsersCount = 0;
    let usersActiveInLastWeek = 0;
    let premiumActivationsInLastWeek = 0;
    let premiumUpdatesInLastWeek = 0;
    let premiumDeactivationsInLastWeek = 0;
    let unsubscribedUsersCount = 0;
    let totalCardsSeen = 0;
    let faculties = {prfUp: 0, prfUk: 0, prfMuni: 0, prfZcu: 0, prfJina: 0, prfNestuduji: 0, prfUchazec: 0, prfNeuvedeno: 0};
    let sources = {pratele: 0, ucitele: 0, instagram: 0, facebook: 0, google: 0, odjinud: 0, neuvedeno: 0};


    users.forEach(user => {
        let newUser = user;
        //mark user as active in the last 48 hours
        newUser.updatedDateOfRegistration = moment(user.dateOfRegistration).locale('cs').format('LL');
        if(user.lastActive){
            newUser.updatedLastActive = moment(user.lastActive).locale('cs').format('LL');
        } else {
            newUser.updatedLastActive = "-"
        }
        
        updatedUsers.push(newUser);

        //COUNTING
        //count Registered users
        registeredUsersCount = users.length;
        //count Premium users
        if(user.isPremium === true){premiumUsersCount++};
        //count users who are paying for Premium and have not canceled
        if(user.isPremium && user.plan !== "none" && !user.premiumGrantedByAdmin){activePremiumSubscriptions++}
        //count unsubscribed users
        if(user.hasUnsubscribed === true){unsubscribedUsersCount++};
        //count users active in the last week
        if(user.lastActive && moment(user.lastActive).isAfter(moment().subtract(1, 'week'))){usersActiveInLastWeek++};
        //count premium activations in the last week
        if(user.premiumDateOfActivation && moment(user.premiumDateOfActivation).isAfter(moment().subtract(1, 'week'))){premiumActivationsInLastWeek++};
        //count premium updates in the last week
        if(user.premiumDateOfUpdate && moment(user.premiumDateOfUpdate).isAfter(moment().subtract(1, 'week'))){premiumUpdatesInLastWeek++};
        //count premium deactivations in the last week
        if(user.premiumDateOfCancelation && moment(user.premiumDateOfCancelation).isAfter(moment().subtract(1, 'week'))){premiumDeactivationsInLastWeek++};
        //count faculties
        if(user.faculty === "PrF UP"){faculties.prfUp++};
        if(user.faculty === "PrF UK"){faculties.prfUk++};
        if(user.faculty === "PrF MUNI"){faculties.prfMuni++};
        if(user.faculty === "PrF ZČU"){faculties.prfZcu++};
        if(user.faculty === "Jiná"){faculties.prfJina++};
        if(user.faculty === "Uchazeč"){faculties.prfUchazec++};
        if(user.faculty === "Nestuduji"){faculties.prfNestuduji++};
        if(user.faculty === "Neuvedeno"){faculties.prfNeuvedeno++};
        //count sources
        if(user.source === "pratele"){sources.pratele++};
        if(user.source === "ucitele"){sources.ucitele++};
        if(user.source === "instagram"){sources.instagram++};
        if(user.source === "facebook"){sources.facebook++};
        if(user.source === "google"){sources.google++};
        if(user.source === "odjinud"){sources.odjinud++};
        if(user.source === "neuvedeno"){sources.neuvedeno++};
        //totalCardsCount
        totalCardsSeen = totalCardsSeen + user.cardsSeen;
    })
    updatedUsers.reverse();
    res.status(200).render('admin/admin', {
        users: updatedUsers, 
        premiumUsersCount, 
        registeredUsersCount, 
        usersActiveInLastWeek, 
        premiumActivationsInLastWeek,
        premiumUpdatesInLastWeek,
        premiumDeactivationsInLastWeek,
        faculties,
        cardsPremiumCount,
        cardsFreeCount,
        sectionsFreeCount,
        sectionsPremiumCount,
        freeCardRatio,
        freeSectionRatio,
        demoLimitReachedStats,
        registeredAfterDemoLimitStats,
        demoLimitRegistrationRatio,
        unsubscribedUsersCount,
        totalCardsSeen,
        activePremiumSubscriptions,
        sources
    });
}))

//ADMIN - SHOW ALL USERS
//show all registered users
router.get('/admin/users', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});    

    let updatedUsers = [];

    users.forEach(user => {
        let newUser = user;
        //mark user as active in the last 48 hours
        if(newUser.lastActive && moment(newUser.lastActive).isAfter(moment().subtract(48, 'hour'))){newUser.activeInLast48Hours = true};
        newUser.updatedDateOfRegistration = moment(user.dateOfRegistration).locale('cs').format('LL');
        if(user.lastActive){
            newUser.updatedLastActive = moment(user.lastActive).locale('cs').format('LL');
        } else {
            newUser.updatedLastActive = "-"
        }
        
        updatedUsers.push(newUser);
    })
    //reverse array of users
    updatedUsers.reverse();

    //render page
    res.status(200).render('admin/users', {
        users: updatedUsers
    });
}))


//DETAIL OF A USER (show)
//show details of user to admin
router.get('/admin/:userId/showDetail', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let user = await User.findById(req.params.userId).populate('sections', 'name');
    if(!user){
        req.flash('error','Uživatel nebyl nalezen.');
        return res.redirect('/admin/users');
    }
    let endDate = "";
    let dateOfRegistration = moment(user.dateOfRegistration).locale('cs').format('LLLL');
    if(user.lastActive){
        lastActive = moment(user.lastActive).locale('cs').format('LLLL');
    } else {
        lastActive = "-"
    }
    if(user.isPremium){
        endDate = moment(user.endDate).locale('cs').format('LLLL')
    }
    
    //format dates
    let premiumDateOfActivation = moment(user.premiumDateOfActivation).locale('cs').format('LLLL');
    let premiumDateOfUpdate = moment(user.premiumDateOfUpdate).locale('cs').format('LLLL');
    let premiumDateOfCancelation = moment(user.premiumDateOfCancelation).locale('cs').format('LLLL');
    premiumDateOfActivation === "Invalid date" ? premiumDateOfActivation = "-" : premiumDateOfActivation;
    premiumDateOfUpdate === "Invalid date" ? premiumDateOfUpdate = "-" : premiumDateOfUpdate;
    premiumDateOfCancelation === "Invalid date" ? premiumDateOfCancelation = "-" : premiumDateOfCancelation;

    //remove duplicate finished sections from user.sections
    let uniqueFinishedSectionsSet = new Set(user.sections);
    user.sections = [...uniqueFinishedSectionsSet];
    //render view
    res.status(200).render('admin/showUserDetail', {
        user, 
        endDate, 
        dateOfRegistration, 
        lastActive,
        premiumDateOfActivation,
        premiumDateOfUpdate,
        premiumDateOfCancelation
    });
}))

//set user.cardsSeen to 0
router.get('/admin/:userId/cardsSeenToZero', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let {userId} = req.params;
    await User.findByIdAndUpdate(userId, {cardsSeen: 0});
    req.flash('success','Vynulováno.');
    res.redirect(`/admin/${userId}/showDetail`);
}))

//get section name over AJAX based on sectionId (for showUserDetail page)
router.get('/admin/:sectionId/getNameOfSection', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let section = await Section.findById(req.params.sectionId).select('name');
    if(!section){
        return res.sendStatus(404);
    }
    res.status(200).send(section);
}))





//ADMIN - Upgrade to PREMIUM and downgrade to FREE
//upgrade to premium - ADMIN ROUTE
router.get('/admin/:userId/upgradeToPremium/:period', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const user = await User.findById(req.params.userId);
    let {period} = req.params;
    if(!user){
        throw Error("Uživatel s tímto ID neexistuje");
    }
    user.isPremium = true;
    user.premiumGrantedByAdmin = true;
    if(period === "addDay"){
        user.plan = "daily";
        user.endDate = moment().add(1,'days');
    }
    if(period === "addMonth"){
        user.plan = "monthly";
        user.endDate = moment().add(1,'months');
    }
    if(period === "add6Weeks"){
        user.plan = "monthly";
        user.endDate = moment().add(6,'weeks');
    }
    if(period === "addYear"){
        user.plan = "yearly";
        user.endDate = moment().add(1,'years');
    }
    if(period === "addDecade"){
        user.plan = "yearly";
        user.endDate = moment().add(10,'years');
    }
    await user.save();
    let endDate = moment(user.endDate).locale('cs').format('LL');
    mail.sendAdminGrantedPremium(user.email, endDate);
    req.flash('success','Uživatel je nyní Premium');
    res.status(201).redirect('/admin/users');
}))

//downgrade to FREE - ADMIN ROUTE
router.put('/admin/:userId/downgradeToFree/', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let user = await User.findById(req.params.userId);
    if(!user){
        throw Error("Uživatel s tímto ID neexistuje");
    }
    if(user.plan === "none" || user.premiumGrantedByAdmin){
        user.isPremium = false;
        user.premiumGrantedByAdmin = false;
        user.endDate = null;
        user.premiumDateOfActivation = null;
        user.premiumDateOfUpdate = null;
        user.premiumDateOfCancelation = null;
        user.plan = "none";
    } else {
        req.flash('error','Uživatel má stále aktivní předplatné na Stripe. Před odebráním Premium je třeba, aby jej uživatel zrušil (Můj účet -> Správa předplatného).');
        return res.status(200).redirect(`/admin/${user._id}/showDetail`);
    }
    await user.save();    
    req.flash('success','Premium ukončeno. Uživateli byl nastaven balíček Free.');
    res.status(201).redirect(`/admin/${user._id}/showDetail`);
}))



//EMAILS FROM ADMIN TO USERS
//email (render)
router.get('/admin/email', isLoggedIn, isAdmin, (req, res) => {
    res.status(200).render('admin/email')
})

//email (send)
router.post('/admin/email', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let allUsers = await User.find({});
    let {subjectAll, textAll, groupChoice} = req.body;
    //send e-mail to a group of users based on radio button choice
    //send to all users
    if(groupChoice === "radioAll"){
        allUsers.forEach(user => {
            mail.sendEmergencyEmail(user.email, subjectAll, textAll);
        })
    //send to users who did not unsubscribed
    } else if (groupChoice === "radioSelected"){
        //send email to subscribed users
        allUsers.forEach(user => {
            if (user.hasUnsubscribed === false){
                mail.sendEmailToSubscribedUsers(user.email, subjectAll, textAll);
            }
        })
    //send to Free users and those premiumGrantedByAdmin
    } else if (groupChoice === "radioFree"){
        //send email to Free users
        allUsers.forEach(user => {
            if (user.hasUnsubscribed === false && (!user.isPremium || user.premiumGrantedByAdmin)){
                mail.sendEmailToSubscribedUsers(user.email, subjectAll, textAll);
            }
        })
    } else if (groupChoice === "radioPremium"){
        //send email to Premium users
        allUsers.forEach(user => {
            if (user.hasUnsubscribed === false && (user.isPremium && !user.premiumGrantedByAdmin && user.plan !== "none")){
                mail.sendEmailToSubscribedUsers(user.email, subjectAll, textAll);
            }
        })
    } else if (groupChoice === "radioTest"){
        mail.sendTestEmail('pravnicime@gmail.com', subjectAll, textAll);
    //should never run, implies some problem with radio buttons
    } else {
        req.flash('fail','E-mail nebyl odeslán, něco se nepovedlo');
        return res.status(400).redirect('/admin/email');
    }
    //redirect back and flash admin with confirmation
    req.flash('success','E-mail byl odeslán všem uživatelům');
    res.status(200).redirect('/admin/email');
}))

// email (unsubscribe)
router.get('/admin/email/unsubscribe', catchAsync(async(req, res) => {
    let {email} = req.query;
    let user = await User.findOne({email});
    if(user){
        user.hasUnsubscribed = true;
        await user.save();
        req.flash('success','Zasílání informačních e-mailů na váš e-mail bylo zrušeno.');
        return res.redirect('/');
    } else {
        req.flash('error','Omlouváme se, něco se nepovedlo. Zkuste to prosím později.');
        return res.redirect('/');
    }
}))




//DELETE PROFILE LOGIC (admin route)
//delete account - ADMIN ROUTE
router.delete('/admin/:userId/deleteUser',isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.status(201).redirect('/admin/users');
}))





//CATEGORIES ADMIN VIEW
//list all categorie ADMIN + helper
router.get('/admin/categories', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    //get all categories
    let categories = await Category.find({}).populate('sections');
    //get all sections
    let sections = await Section.find({});
    //sort all categories by OrderNum
    sortByOrderNum(categories);
    //count S/D ratio for each section
    countSDratio(sections);
    //sort all sections by countStarted
    sortByCountStarted(sections);
    //count how many times where all sections in the category started
    countStartedAbsoluteAndAverage(categories);
    //render view
    res.render('admin/categories', {categories, sections});
}))

//helper - order categories by OrderNum function
function sortByOrderNum(array) {
    // Use the Array.prototype.sort() method to sort the array
    array.sort((a, b) => a.orderNum - b.orderNum);
    // Return the sorted array
    return array;
  }

//helper - order sections by countStarted function
function sortByCountStarted(array) {
    // Use the Array.prototype.sort() method to sort the array
    array.sort((a, b) => b.countStarted - a.countStarted);
    // Return the sorted array
    return array;
  }
  function countSDratio(array){
    array.forEach(sec => {
        sec.SDratio = Math.round(sec.countFinished / sec.countStarted * 100);
    })
    return array;
  }

  //count how many times were sections started in category and average for each section
  function countStartedAbsoluteAndAverage(categories) {
    let count = 0;
    categories.forEach(cat => {
        count = 0;
        cat.sections.forEach(sec => {
            count = count + sec.countStarted;
        })
        cat.countStartedAll = count;
        cat.countAverage = Math.round(count / cat.sections.length);
    })
    return categories;
  }

  //reset counters on section
  router.get('/admin/:sectionId/resetCounters', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    //reset counters on section
    await Section.findByIdAndUpdate(req.params.sectionId, {countStarted: 0, countFinished: 0, countRepeated: 0});
    //redirect back
    req.flash('success','Statistiky sekce byly vynulovány.')
    res.status(201).redirect('/admin/categories');
  }))





//EDITOR PERMISIONS LOGIC (grant and remove)
//give editor permisions to a user
router.post("/admin/:userId/makeEditor", isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let {userId} = req.params;
    let user = await User.findById(userId);
    if(!user){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/admin/users');
    }
    user.isEditor = true;
    await user.save();
    req.flash('success','Editorská oprávnění byla udělena.')
    res.redirect('/admin/users');
}))

//remove editor permisions from a user
router.post("/admin/:userId/removeEditor", isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    let {userId} = req.params;
    let user = await User.findById(userId);
    if(!user){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/admin/users');
    }
    user.isEditor = false;
    await user.save();
    req.flash('success','Editorská oprávnění byle odebrána.')
    res.redirect('/admin/users');
}))





//PROVIDE FEEDBACK LOGIC
//render feedback form
router.get('/legal/feedback', catchAsync(async(req, res) => {
    let user = {};
    if(req.user){
        user = req.user;
    }
    res.status(200).render('legal/feedback', {user});
}))


//send feedback
router.post('/legal/feedback', catchAsync(async(req, res) => {
    const {email, name, text} = req.body;
    mail.sendFeedback(email, name, text);
    req.flash('success','Feedback byl odeslán. Díky!')
    res.status(201).redirect(`/legal/feedback`);
}))




//INVOICES
//add new invoice
router.post('/invoice/new/:userId', catchAsync(async(req, res) => {
    let data = req.body;
    let {userId} = req.params;
    let foundUser = await User.findById(userId);
    if(!foundUser){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/admin/users');
    }
    let {invoiceNum, invoiceAmount, invoiceDate} = data;
    let newInvoice = {
        invoiceNum,
        invoiceDate,
        invoiceAmount
    }
    foundUser.invoices.unshift(newInvoice);
    await foundUser.save();
    req.flash('success','Faktura byla vložena');
    res.status(201).redirect(`/admin/${userId}/showDetail`);
}))

router.get('/invoice/remove/:userId/:invoiceNum', catchAsync(async(req, res) => {
    let {userId, invoiceNum} = req.params;
    let foundUser = await User.findById(userId);
    if(!foundUser){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/admin/users');
    }
    // Function to filter out an object based on invoiceNum
    function filterArrayOfInvoices(arr, invoiceNumber) {
        return arr.filter(invoice => invoice.invoiceNum !== invoiceNumber);
    }
    let filteredInvoices = filterArrayOfInvoices(foundUser.invoices, invoiceNum);
    foundUser.invoices = filteredInvoices;
    foundUser.save();
    req.flash('success','Faktura byla odstraněna')
    res.status(201).redirect(`/admin/${userId}/showDetail`);
}))

router.get('/invoice/request/:invoiceNum', catchAsync(async(req, res) => {
    let {invoiceNum} = req.params;
    let foundUser = await User.findById(req.user._id);
    if(!foundUser){
        req.flash('error','Uživatel neexistuje');
        return res.redirect('/');
    }
    foundUser.invoices.forEach(invoice => {
        if(invoice.invoiceNum === invoiceNum){
            invoice.isRequested = true;
        }
    })
    foundUser.markModified('invoices');
    await foundUser.save();
    mail.requestInvoice(req.user.email, invoiceNum);
    req.flash('success',`Faktura ${invoiceNum} byla vyžádána a bude doručena do e-mailové schránky ${req.user.email} do tří pracovních dnů.`);
    res.status(200).redirect(`/auth/user/profile`);
}))




module.exports = router;