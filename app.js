if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');


app.use("/webhook", bodyParser.raw({ type: "application/json" }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//routes
const cardRoutes = require('./routes/cards');
const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const sectionRoutes = require('./routes/sections');
const paymentRoutes = require('./routes/payments');
const legalRoutes = require('./routes/legal');
const CardAjaxRoutes = require('./routes/cardsAjax');

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {dbName: process.env.DB_NAME})
    .then(() => {
        console.log("Connected to MongoDB!")
    })
    .catch(err => {
        console.log("Oh no, error connecting to MongoDB")
        console.log(err)
    })

app.use(express.urlencoded({extended: true})); //for html forms
app.use(express.json()); //for JSON data
//app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize({
    replaceWith: '_', 
  }));

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        dbName: process.env.DB_NAME,
        secret: process.env.SESSION_SECRET,
        touchAfter: 24 * 3600
    }),
    name: 'ulpianus',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,    //cookies available only on HTTPS protocol - apply in production
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //one week
        maxAge: 1000 * 60 * 60 * 24 * 7 // one week
    }
}

//session has to ge before the passport.session
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://www.googletagmanager.com/",
    "https://region1.google-analytics.com/",
    "https://js.stripe.com/"

];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://region1.google-analytics.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://ka-f.fontawesome.com/",
    "https://region1.google-analytics.com/"

];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["https://js.stripe.com/"],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self' https: data:", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//has to follow after app.use(flash())
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.cookiesAgreed = req.session.cookiesAgreed;
    //gives access to currectUser on all templates
    res.locals.currentUser = req.user;
    next();
})

app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

//use routes
app.use('/', cardRoutes);
app.use('/', adminRoutes);
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/', sectionRoutes);
app.use('/', paymentRoutes);
app.use('/', legalRoutes);
app.use('/', CardAjaxRoutes);

//error handling - has to be at the end!
//catch all for any error - all errors go here
app.use((err, req, res, next) => {
    const {statusCode = 500, message = 'Něco se pokazilo.', stack = "empty"} = err;
    //res.status(statusCode).render('error', {message, stack});
    if(err.name === "CastError"){
        req.flash('error', "Záznam nebyl v databázi nalezen - pravděpodobně nesprávný formát ID");
        console.log(err);
        return res.status(404).redirect('/');
    }
    req.flash('error', err.message);
    console.log(err);
    res.status(400).redirect('/');
})

app.all('*', (req, res, next) => {
    console.log(`************************ 404 **********************`);
    console.log(req.path);
    req.flash('error', 'Stránka nebyla nalezena.');
    res.status(404).redirect('/');
})

//exports app - requested in server.js - required for proper testing
module.exports = app;