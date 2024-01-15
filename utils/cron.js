const User = require('../models/user');
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
                //user.save()
                mail.sendPremiumEnded(user.email);
                endedUsers.push(user.email);
            }
    })
    mail.sendCronReport('checkPremiumEnded', endedUsers);
})

// Schedule the function to run at midnight on the first day of every month
cronHelpers.cronExpressionMonthly = '0 0 1 * *';

// Schedule the function to run at midnight on the first day of every month
cronHelpers.cronExpressionDaily = '0 6 * * *';

// Schedule the function to run every 1st second of every minute
cronHelpers.cronExpressionMinutes = '1 * * * * *';



module.exports = cronHelpers;