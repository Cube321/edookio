const User = require('../models/user');
const Stats = require('../models/stats');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');
const mail = require('../mail/mail_inlege');

let cronHelpers = {};

cronHelpers.checkPremiumEnded = catchAsync(async() => {
    console.log('RUNNING CRON: checkPremiumEnded');
    let users = await User.find({});
    let endedUsers = [];
    users.forEach(user => {
        const today = Date.now();
        const {endDate} = user;
            if(moment(today).format() > moment(endDate).format()){
                user.isPremium = false;
                user.premiumGrantedByAdmin = false;
                user.endDate = null;
                user.plan = "none";
                user.save()
                mail.sendPremiumEnded(user.email);
                endedUsers.push(user.email);
            }
    })
    mail.sendCronReport('checkPremiumEnded', endedUsers);
})

cronHelpers.resetStreaks = catchAsync(async() => {
    console.log('RUNNING CRON: resetStreaks');
    let users = await User.find({});
    let counter = 0;
    users.forEach(user => {
            if(user.actionsToday > 0 || user.streakLength > 0){
                if(user.actionsToday < 10){
                    user.streakLength = 0;
                }
                user.actionsToday = 0;
                counter++;
                user.save();
            }
    })
    mail.sendCronReport('resetStreaks', counter);
})

cronHelpers.streakReminderEmail = catchAsync(async() => {
    console.log('RUNNING CRON: streakReminderEmail');
    let users = await User.find({});
    let counter = 0;
    users.forEach(user => {
            if(user.streakLength > 1 && !user.hasUnsubscribedFromStreak && user.actionsToday < 10){
                mail.sendStreakReminder(user.email, user.streakLength);
                console.log(`streak reminder sent to: ${user.email}`)
                counter++;
            }
    })
    mail.sendCronReport('streakReminderEmail', counter);
})

cronHelpers.resetMonthlyCounters = catchAsync(async() => {
    console.log('RUNNING CRON: resetMonthlyCounters');
    let users = await User.find({});
    //save last month clast results
    saveClash(users);
    let counter = 0;
    users.forEach(user => {
        if(user.questionsSeenThisMonth > 0 || user.cardsSeenThisMonth > 0){
            user.questionsSeenThisMonth = 0;
            user.cardsSeenThisMonth = 0;
            user.save();
            counter++;
        }
    })
    mail.sendCronReport('resetMonthlyCounters', counter);
})

//HELPERS
let saveClash = catchAsync(async(users) => {
    console.log('RUNNING CRON: saveClash');

    let faculties = {
        prfUp: 0,
        prfUk: 0,
        prfMuni: 0,
        prfZcu: 0,
        prfJina: 0,
        prfNestuduji: 0
    }

    users.forEach(user => {
        //count points
        if(user.faculty === "PrF UP"){
            faculties.prfUp = faculties.prfUp + user.cardsSeenThisMonth + user.questionsSeenThisMonth;
        };
        if(user.faculty === "PrF UK"){
            faculties.prfUk = faculties.prfUk + user.cardsSeenThisMonth + user.questionsSeenThisMonth;
        };
        if(user.faculty === "PrF MUNI"){
            faculties.prfMuni = faculties.prfMuni + user.cardsSeenThisMonth + user.questionsSeenThisMonth;
        };
        if(user.faculty === "PrF ZČU"){
            faculties.prfZcu = faculties.prfZcu + user.cardsSeenThisMonth + user.questionsSeenThisMonth;
        };
        if(user.faculty === "Jiná"){
            faculties.prfJina = faculties.prfJina + user.cardsSeenThisMonth + user.questionsSeenThisMonth;
        };
        if(user.faculty === "Nestuduji"){
            faculties.prfNestuduji = faculties.prfNestuduji + user.cardsSeenThisMonth + user.questionsSeenThisMonth;
        };
    });
    //order faculties by points top to bottom
    let facultiesOrdered = Object.entries(faculties);
    facultiesOrdered.sort((a, b) => b[1] - a[1]);
    //create object with date
    let date = new Date();
    let updatedDate = moment(date).subtract(1, 'days');
    var key = moment(updatedDate).format('MM/YYYY');
    let lastMonthData = {key: key, data: facultiesOrdered};
    //save faculties to DB
    await Stats.findOneAndUpdate(
            { eventName: 'clashSavedStats' },
            { $push: { payload: lastMonthData } },
            { upsert: true, new: true }
        );
    //send confirmation e-mail to admin
    mail.sendCronReport('saveClash', facultiesOrdered);
})

// Schedule the function to run at midnight on the first day of every month
cronHelpers.cronExpressionMonthly = '0 0 1 * *';

// Schedule the function to run at 4 am every day (5 am on summer time)
cronHelpers.cronExpressionDaily5AM = '0 3 * * *';

// Schedule the function to run at 2 am every day (3 am on summer time)
cronHelpers.cronExpressionDaily3AM = '0 1 * * *';

// Schedule the function to run at 8 pm (9 pm on summer time)
cronHelpers.cronExpressionDaily9PM = '0 19 * * *';

// Schedule the function to run every 1st second of every minute
cronHelpers.cronExpressionMinutes = '1 * * * * *';

// Schedule the function to run every 10th second of every minute
cronHelpers.cronExpressionMinutesLater = '10 * * * * *';



module.exports = cronHelpers;