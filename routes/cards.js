const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Card = require('../models/card');
const { categories } = require('../utils/categories');
const { validateCard } = require('../utils/middleware');



//show a random card from a category
router.get('/cards/getrandomcard/:category', catchAsync(async (req, res, next) => {
    const { category } = req.params;
    const cards = await Card.find({topic: category});
    if(cards && cards.length < 1){
        req.flash('error','Zadaná kategorie neobsahuje žádné kartičky.');
        return res.redirect('/');
    }
    const cardsAmount = cards.length;
    const randomNumber = Math.floor(Math.random() * (cardsAmount));
    const randomCard = cards[randomNumber];
    let topicText = "";
    for (let cat of categories){
        if(cat.value === category){
            topicText = cat.text
        }
    }
    res.render('cards/show', { card: randomCard, topicText });
}))

//show a specific card
router.get('/cards/show/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    let topicText = "";
    for (let cat of categories){
        if(cat.value === card.topic){
            topicText = cat.text
        }
    }
    res.render('cards/show', {card, topicText});
}))

//add new card - form (GET)
router.get('/cards/new', (req, res, next) => {
    try {
        res.render('cards/new', {categories});
    } catch (err){
        next(err);
    }
})

//add new card - save (POST)
router.post('/cards/new', validateCard, catchAsync(async (req, res, next) => {
    const { topic, pageA, pageB, author} = req.body;
    const newCard = new Card({
        topic,
        pageA,
        pageB,
        author
    })
    const createdCard = await newCard.save();
    req.flash('success','Kartička byla přidána do databáze.');
    res.redirect(`/cards/show/${createdCard.id}`);
}))

//edit card - form (GET)
router.get('/cards/edit/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card){
        req.flash('error','Kartička nebyla nalezena.');
        return res.redirect('/');
    }
    res.render('cards/edit', {card, categories});
}))

//edit card - save (PUT)
router.put('/cards/edit/:id', validateCard, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const {topic, pageA, pageB, author} = req.body;
    const newCard = await Card.findByIdAndUpdate(id, {topic, pageA, pageB, author}, {new: true});
    req.flash('success','Kartička byla aktualizována.');
    res.redirect(`/cards/show/${id}`);
}))

//remove card (DELETE)
router.delete('/cards/remove/:id', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    await Card.findByIdAndDelete(id);
    console.log("deleted");
    req.flash('success','Kartička byla odstraněna.');
    res.redirect('/admin/listallcards');
}))

module.exports = router;