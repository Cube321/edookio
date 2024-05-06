const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const moment = require('moment');
const user = require('../models/user');

//SHOW LEADERBOARD
router.get('/leaderboard', isLoggedIn, catchAsync(async(req, res) => {
    let users = await User.find();
    let {order} = req.query;
    let {user} = req;

    users.forEach(user => {
        user.pointsTotal = user.cardsSeen + user.questionsSeenTotal;
        user.pointsMonth = user.cardsSeenThisMonth + user.questionsSeenThisMonth;
        user.pointsToday = user.actionsToday;
    })

    let positionInArray = undefined;
    let isInTop = true;
    let topUsers = [];

    // Function to check if the user is in the array
    function isObjectInArray(array, object) {
        for (let i = 0; i < array.length; i++) {
            if (JSON.stringify(array[i]) === JSON.stringify(object)) {
                return i;
            }
        }
        return undefined;
    }

    if(order === "day"){
        users.sort(function(a, b) {
            return b.pointsToday - a.pointsToday;
        });
        positionInArray = isObjectInArray(users, user);
        if(positionInArray >= 9){
            isInTop = false;
        };
        topUsers = users.slice(0, 10);
    } else if (order === "total"){
        users.sort(function(a, b) {
            return b.pointsTotal - a.pointsTotal;
        });
        positionInArray = isObjectInArray(users, user);
        if(positionInArray >= 49){
            isInTop = false;
        };
        topUsers = users.slice(0, 50);
    } else {
        users.sort(function(a, b) {
            return b.pointsMonth - a.pointsMonth;
        });
        positionInArray = isObjectInArray(users, user);
        if(positionInArray >= 24){
            isInTop = false;
        };
        topUsers = users.slice(0, 25);
    }

    //give nickname to each user that does not have any yet
    users.forEach(user => {
        if(!user.nickname){
            if(user.lastname.charAt(user.lastname.length - 1) === "á"){
                let firstPart = user.firstname.substring(0, 3);
                let lastPart = user.lastname.substring(0, 3);
                user.nickname = `${firstPart}${lastPart}${Math.round(user.email.length/2)}`
            } else {
                let firstPart = user.firstname.substring(0, 3);
                let lastPart = user.lastname.substring(0, 3);
                user.nickname = `${firstPart}${lastPart}${Math.round(user.email.length/2)}`
            }
        }
    })

    res.status(200).render('leaderboard', {topUsers, positionInArray, isInTop, order});
}))

//ADD or CHANGE NICKNAME




module.exports = router;