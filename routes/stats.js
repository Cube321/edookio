const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const moment = require('moment');

router.get('/admin/stats', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const {show} = req.query;
    const users = await User.find();

    const registrationsPerDay = countRegistrationsPerDay(users);
    const premiumActivationsPerDay = countPremiumActivationsPerDay(users);
    const premiumDeactivationsPerDay = countPremiumDeactivationsPerDay(users);
    const premiumProlongationsPerDay = countPremiumProlongationsPerDay(users);
    const registrationsPerDayByFaculties = countRegistrationsPerDayByFaculties(users);
    const registrationsPerDayBySource = countRegistrationsPerDayBySource(users);

    const data = {
        registrationsPerDay,
        premiumActivationsPerDay,
        premiumDeactivationsPerDay,
        premiumProlongationsPerDay,
        registrationsPerDayByFaculties,
        registrationsPerDayBySource
    }

    if(!show || show === 'month'){
        data.registrationsPerDay = data.registrationsPerDay.slice(-31);
        data.premiumActivationsPerDay = data.premiumActivationsPerDay.slice(-31);
        data.premiumDeactivationsPerDay = data.premiumDeactivationsPerDay.slice(-31);
        data.premiumProlongationsPerDay = data.premiumProlongationsPerDay.slice(-31);
        data.registrationsPerDayByFaculties = data.registrationsPerDayByFaculties.slice(-31);
        data.registrationsPerDayBySource = data.registrationsPerDayBySource.slice(-31);
    }

    if(show === 'quarter'){
        data.registrationsPerDay = data.registrationsPerDay.slice(-90);
        data.premiumActivationsPerDay = data.premiumActivationsPerDay.slice(-90);
        data.premiumDeactivationsPerDay = data.premiumDeactivationsPerDay.slice(-90);
        data.premiumProlongationsPerDay = data.premiumProlongationsPerDay.slice(-90);
        data.registrationsPerDayByFaculties = data.registrationsPerDayByFaculties.slice(-90);
        data.registrationsPerDayBySource = data.registrationsPerDayBySource.slice(-90);
    }

    if(show === 'halfyear'){
        data.registrationsPerDay = data.registrationsPerDay.slice(-180);
        data.premiumActivationsPerDay = data.premiumActivationsPerDay.slice(-180);
        data.premiumDeactivationsPerDay = data.premiumDeactivationsPerDay.slice(-180);
        data.premiumProlongationsPerDay = data.premiumProlongationsPerDay.slice(-180);
        data.registrationsPerDayByFaculties = data.registrationsPerDayByFaculties.slice(-180);
        data.registrationsPerDayBySource = data.registrationsPerDayBySource.slice(-180);
    }

    const dataJSON = JSON.stringify(data)

    res.status(200).render('admin/stats', {data: dataJSON});
}))

function countRegistrationsPerDay(users) {
    // Use the moment.js library to handle dates
    const today = moment();
    let dateCounts = [];

    // Initialize the dateCounts array with the last 365 days in reverse order (oldest first)
    for (let i = 364; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
        dateCounts.push({ [date]: 0 });
    }

    // Iterate through the user data and update the counts
    users.forEach(user => {
        const date = moment(user.dateOfRegistration).format('YYYY-MM-DD');

        // Check if the date exists in the dateCounts array and update the count
        const index = dateCounts.findIndex(item => Object.keys(item)[0] === date);
        if (index !== -1) {
            dateCounts[index][date] += 1;
        }
    });

    return dateCounts;
}

function countPremiumActivationsPerDay(users) {
    // Use the moment.js library to handle dates
    const today = moment();
    let dateCounts = [];

    // Initialize the dateCounts array with the last 365 days in reverse order (oldest first)
    for (let i = 364; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
        dateCounts.push({ [date]: 0 });
    }

    // Iterate through the user data and update the counts
    users.forEach(user => {
        const date = moment(user.premiumDateOfActivation).format('YYYY-MM-DD');

        // Check if the date exists in the dateCounts array and update the count
        const index = dateCounts.findIndex(item => Object.keys(item)[0] === date);
        if (index !== -1) {
            dateCounts[index][date] += 1;
        }
    });

    return dateCounts;
}

function countPremiumDeactivationsPerDay(users) {
    // Use the moment.js library to handle dates
    const today = moment();
    let dateCounts = [];

    // Initialize the dateCounts array with the last 365 days in reverse order (oldest first)
    for (let i = 364; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
        dateCounts.push({ [date]: 0 });
    }

    // Iterate through the user data and update the counts
    users.forEach(user => {
        const date = moment(user.premiumDateOfCancelation).format('YYYY-MM-DD');

        // Check if the date exists in the dateCounts array and update the count
        const index = dateCounts.findIndex(item => Object.keys(item)[0] === date);
        if (index !== -1) {
            dateCounts[index][date] += 1;
        }
    });

    return dateCounts;
}

function countPremiumProlongationsPerDay(users) {
    // Use the moment.js library to handle dates
    const today = moment();
    let dateCounts = [];

    // Initialize the dateCounts array with the last 365 days in reverse order (oldest first)
    for (let i = 364; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
        dateCounts.push({ [date]: 0 });
    }

    // Iterate through the user data and update the counts
    users.forEach(user => {
        const date = moment(user.premiumDateOfUpdate).format('YYYY-MM-DD');

        // Check if the date exists in the dateCounts array and update the count
        const index = dateCounts.findIndex(item => Object.keys(item)[0] === date);
        if (index !== -1) {
            dateCounts[index][date] += 1;
        }
    });

    return dateCounts;
}


function countRegistrationsPerDayByFaculties(users) {
    const today = moment();
    let dateCounts = [];

    // Initialize the dateCounts array with the last 365 days in reverse order (oldest first)
    for (let i = 364; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
        dateCounts.push({ [date]: {} });
    }

    // Iterate through the user data and update the counts
    users.forEach(user => {
        const date = moment(user.dateOfRegistration).format('YYYY-MM-DD');
        const faculty = user.faculty;

        // Find the date in the dateCounts array
        const index = dateCounts.findIndex(item => Object.keys(item)[0] === date);
        if (index !== -1) {
            if (!dateCounts[index][date][faculty]) {
                dateCounts[index][date][faculty] = 0;
            }
            dateCounts[index][date][faculty] += 1;
        }
    });

    return dateCounts;
}


function countRegistrationsPerDayBySource(users) {
    const today = moment();
    let dateCounts = [];

    // Initialize the dateCounts array with the last 365 days in reverse order (oldest first)
    for (let i = 364; i >= 0; i--) {
        const date = today.clone().subtract(i, 'days').format('YYYY-MM-DD');
        dateCounts.push({ [date]: {} });
    }

    // Iterate through the user data and update the counts
    users.forEach(user => {
        const date = moment(user.dateOfRegistration).format('YYYY-MM-DD');
        const source = user.source;

        // Find the date in the dateCounts array
        const index = dateCounts.findIndex(item => Object.keys(item)[0] === date);
        if (index !== -1) {
            if (!dateCounts[index][date][source]) {
                dateCounts[index][date][source] = 0;
            }
            dateCounts[index][date][source] += 1;
        }
    });

    return dateCounts;
}

module.exports = router;