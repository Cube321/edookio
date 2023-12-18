const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Stats = require('../models/stats'); 
const { isLoggedIn, isAdmin, isEditor } = require('../utils/middleware');
const moment = require('moment');
const mail = require('../mail/mail_inlege');

//RESTful routes for /blog
//index
router.get('/blog', catchAsync(async(req, res) => {
    res.status(200).render('blog/index', {});
}))

//new
router.get('/blog/new', catchAsync(async(req, res) => {
    res.sendStatus(200);
}))

//create
router.post('/blog', catchAsync(async(req, res) => {
    res.sendStatus(200);
}))

//show
router.get('/blog/:blogId', catchAsync(async(req, res) => {
    res.sendStatus(200);
}))

//edit
router.get('/blog/:blogId/edit', catchAsync(async(req, res) => {
    res.sendStatus(200);
}))

//update
router.patch('/blog/:blogId', catchAsync(async(req, res) => {
    res.sendStatus(200);
}))

//destroy
router.delete('/blog/:blogId', catchAsync(async(req, res) => {
    res.sendStatus(200);
}))

module.exports = router;