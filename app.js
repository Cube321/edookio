if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;

const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const Category = require("./models/category");
const texts = require(`./utils/texts.${process.env.PROJECT}`);
const cron = require("node-cron");
const cronHelpers = require(`./utils/cron`);

app.use("/webhook", bodyParser.raw({ type: "application/json" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CRON JOBS
//check if premium ended for each user every day at 5AM
cron.schedule(
  cronHelpers.cronExpressionDaily5AM,
  cronHelpers.checkPremiumEnded
);
//resets monthly counters every first day of a month
cron.schedule(
  cronHelpers.cronExpressionMonthly,
  cronHelpers.resetMonthlyCounters
);
//handle streaks logic daily at 1AM
cron.schedule(cronHelpers.cronExpressionDaily3AM, cronHelpers.resetStreaks);
//save daily stats daily at 1AM
cron.schedule(cronHelpers.cronExpressionDaily3AM, cronHelpers.saveDailyStats);
//send streak reminder daily at 9PM
cron.schedule(
  cronHelpers.cronExpressionDaily9PM,
  cronHelpers.streakReminderEmail
);
//send infoEmail to users registered 3 days ago
cron.schedule(cronHelpers.cronExpressionDaily8PM, cronHelpers.sendInfoEmail);

//routes
const cardRoutes = require("./routes/cards");
const adminRoutes = require("./routes/admin");
const homeRoutes = require("./routes/home");
const authRoutes = require("./routes/auth");
const sectionRoutes = require("./routes/sections");
const paymentRoutes = require("./routes/payments");
const legalRoutes = require("./routes/legal");
const blogRoutes = require("./routes/blog");
const api30Routes = require("./routes/api30");
const card30Routes = require("./routes/card30");
const questionsRoutes = require("./routes/questions");
const invoicesRoutes = require("./routes/invoices");
const chatGptRoutes = require("./routes/chatgpt");
const leaderboardRoutes = require("./routes/leaderboard");
const mobileApiRoutes = require("./routes/mobileApi");
const mobileAuthRoutes = require("./routes/mobileAuth");
const statsRoutes = require("./routes/stats");
const mobilePayments = require("./routes/mobilePayments");
const temporaryRoutes = require("./routes/temporary");
const dashboardRoutes = require("./routes/dashboard");
const documentRoutes = require("./routes/document");
const spaceRepetitionRoutes = require("./routes/spacedRepetition");

const dbUrl = process.env.DB_URL;

mongoose
  .connect(dbUrl, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Oh no, error connecting to MongoDB");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true })); //for html forms
app.use(express.json()); //for JSON data
//app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    dbName: process.env.DB_NAME,
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 3600,
  }),
  name: "ulpianus",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,    //cookies available only on HTTPS protocol - apply in production
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7 * 520, //ten years
    maxAge: 1000 * 60 * 60 * 24 * 7 * 520, // ten years
  },
};

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
  "https://js.stripe.com/",
  "https://googleads.g.doubleclick.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://region1.google-analytics.com/",
  "https://fonts.gstatic.com",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://ka-f.fontawesome.com/",
  "https://region1.google-analytics.com/",
  "https://www.google.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "https://js.stripe.com/",
        "https://td.doubleclick.net/",
        "https://www.googletagmanager.com/",
      ],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://images.unsplash.com/",
        "https://www.google.cz",
        "https://www.google.com",
      ],
      fontSrc: ["'self' https: data:", ...fontSrcUrls],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to fetch categories
app.use(async (req, res, next) => {
  try {
    const categories = await Category.find().select("text orderNum name");
    sortByOrderNum(categories);
    res.locals.categories = categories;
    res.locals.texts = texts;
    next();
  } catch (err) {
    next(err);
  }
});
//helper - order categories by OrderNum function
function sortByOrderNum(array) {
  // Use the Array.prototype.sort() method to sort the array
  array.sort((a, b) => a.orderNum - b.orderNum);
  // Return the sorted array
  return array;
}

//has to follow after app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.successOverlay = req.flash("successOverlay");
  res.locals.cookiesAgreed = req.session.cookiesAgreed;
  //gives access to currectUser on all templates
  res.locals.currentUser = req.user;
  next();
});

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));

//use routes
app.use("/", cardRoutes);
app.use("/", adminRoutes);
app.use("/", homeRoutes);
app.use("/", authRoutes);
app.use("/", sectionRoutes);
app.use("/", paymentRoutes);
app.use("/", legalRoutes);
app.use("/", blogRoutes);
app.use("/", api30Routes);
app.use("/", card30Routes);
app.use("/", questionsRoutes);
app.use("/", invoicesRoutes);
app.use("/", chatGptRoutes);
app.use("/", leaderboardRoutes);
app.use("/", mobileApiRoutes);
app.use("/", mobileAuthRoutes);
app.use("/", statsRoutes);
app.use("/", mobilePayments);
app.use("/", temporaryRoutes);
app.use("/", dashboardRoutes);
app.use("/", documentRoutes);
app.use("/", spaceRepetitionRoutes);

app.use("/.well-known", express.static(path.join(__dirname, ".well-known")));

//error handling - has to be at the end!
//catch all for any error - all errors go here
app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    message = "Něco se pokazilo.",
    stack = "empty",
  } = err;
  //res.status(statusCode).render('error', {message, stack});
  if (err.name === "CastError") {
    req.flash(
      "error",
      "Záznam nebyl v databázi nalezen - pravděpodobně nesprávný formát ID"
    );
    console.log(err);
    return res.status(404).redirect("/");
  }
  req.flash("error", err.message);
  console.log(err);
  res.status(400).redirect("/");
});

app.all("*", (req, res, next) => {
  console.log(`************************ 404 **********************`);
  console.log(req.path);
  req.flash("error", "Stránka nebyla nalezena.");
  res.status(404).redirect("/");
});

//exports app - requested in server.js - required for proper testing
module.exports = app;
