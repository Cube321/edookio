const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Stats = require("../models/stats");
const TestResult = require("../models/testResult");
const CardsResult = require("../models/cardsResult");
const Category = require("../models/category");
const passport = require("passport");
const { isLoggedIn } = require("../utils/middleware");
const { validateUser, validateName } = require("../utils/middleware");
const seedContent = require("../utils/seed");
const uuid = require("uuid");
const mail = require("../mail/mail");
const Stripe = require("../utils/stripe");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const helpers = require("../utils/helpers");

//PROFILE (show)
//my profile view page
router.get(
  "/auth/user/profile",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { user } = req;
    await user.populate("invoicesDbObjects");
    let endDate = "";
    let dateOfRegistration = moment(user.dateOfRegistration)
      .locale("cs")
      .format("LL");
    if (user.isPremium) {
      endDate = moment(user.endDate).locale("cs").format("LL");
    }
    res
      .status(200)
      .render("auth/profile", { user, endDate, dateOfRegistration });
  })
);

//COOKIES LOGIC
//route after main "Povolit vše" btn clicked
router.get("/cookies-agreed", function (req, res) {
  req.session.cookiesAgreed = true;
  req.session.cookiesAnalyticke = true;
  req.session.cookiesMarketingove = true;
  res.sendStatus(200);
});

router.get("/cookies-agreed-form", function (req, res) {
  req.session.cookiesAgreed = true;
  req.session.cookiesAnalyticke = true;
  req.session.cookiesMarketingove = true;
  req.flash("successOverlay", "Nastavení cookies bylo uloženo.");
  res.status(200).redirect("/");
});

//cookies consent form RENDER
router.get(
  "/legal/cookies",
  catchAsync(async (req, res) => {
    let { cookiesAnalyticke, cookiesMarketingove } = req.session;
    res
      .status(200)
      .render("legal/cookiesForm", { cookiesAnalyticke, cookiesMarketingove });
  })
);

//cookies consent form POST
router.post(
  "/legal/cookies",
  catchAsync(async (req, res) => {
    let { analyticke, marketingove } = req.body;
    req.session.cookiesTechnicke = true;
    if (analyticke) {
      req.session.cookiesAnalyticke = true;
    } else {
      req.session.cookiesAnalyticke = false;
    }
    if (marketingove) {
      req.session.cookiesMarketingove = true;
    } else {
      req.session.cookiesMarketingove = false;
    }
    req.session.cookiesAgreed = true;
    req.flash("successOverlay", "Nastavení cookies bylo uloženo.");
    res.status(200).redirect("/");
  })
);

//REGISTER LOGIC
//register form user (GET)
router.get("/auth/user/new", (req, res) => {
  let requiresPremium = false;
  if (req.query.premium === "true") {
    requiresPremium = true;
  }

  res.status(200).render("auth/register_form", { requiresPremium });
});

//register form teacher (GET)
router.get("/auth/user/ucitel", (req, res) => {
  res.status(200).render("auth/register_teacher");
});

//register form admin (GET)
router.get("/auth/admin/new", (req, res) => {
  res.status(200).render("auth/admin_registr");
});

//register request (POST)
router.post(
  "/auth/user/new",
  validateUser,
  catchAsync(async (req, res, next) => {
    let { email, password, key, source, school } = req.body;
    let { shareId } = req.session;
    let { teacher, js } = req.query;

    if (!js) {
      req.flash("error", "Detekován bot. Registrace byla odmítnuta.");
      return res.redirect("back");
    }

    if (school) {
      req.flash("error", "Detekován bot. Registrace byla odmítnuta.");
      return res.redirect("back");
    }

    try {
      //check for admin key
      let admin = false;
      if (key === process.env.adminRegKey) {
        admin = true;
      }
      //create cookies object
      let cookies = {
        technical: true,
        analytical: true,
        marketing: true,
      };
      if (req.session.cookiesTechnicke) {
        cookies = {
          technical: req.session.cookiesTechnicke,
          analytical: req.session.cookiesAnalyticke,
          marketing: req.session.cookiesMarketingove,
        };
      }

      let registrationCampaign = null;
      if (req.session?.campaign) {
        registrationCampaign = req.session.campaign;
      }

      let landingPageVariant = null;
      if (req.session?.landingPageVariant) {
        landingPageVariant = req.session.landingPageVariant;
        helpers.incrementEventCount(
          `landingPageRegistered-${landingPageVariant}`
        );
      }

      //create nickname
      let randomNumber = Math.floor(Math.random() * 9000) + 1000;
      let nickname = `${email.substring(0, 5)}${randomNumber}`;

      //create hashed password for the JWT used with mobile app
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const passwordJWT = hash;

      //register user
      const passChangeId = uuid.v1();
      const dateOfRegistration = Date.now();
      const customer = await Stripe.addNewCustomer(email);
      const user = new User({
        email: email.toLowerCase(),
        username: email.toLowerCase(),
        nickname,
        passwordJWT,
        admin,
        dateOfRegistration,
        passChangeId,
        billingId: customer.id,
        plan: "none",
        endDate: null,
        isGdprApproved: true,
        source,
        cookies,
        isEmailVerified: false,
        registrationCampaign,
        landingPageVariant,
      });
      const newUser = await User.register(user, password);

      await new Promise((resolve, reject) => {
        req.login(newUser, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      //send info e-mails
      mail.welcome(newUser.email);
      mail.emailVerification(newUser.email, newUser._id);
      mail.adminInfoNewUser(newUser);

      //seed content
      let createdCategoryIds = await seedContent(newUser._id, teacher);
      newUser.createdCategories = createdCategoryIds;
      await newUser.save();

      //handle shareId
      if (shareId) {
        let sharedCategory = await Category.findOne({ shareId: shareId });
        if (sharedCategory) {
          newUser.sharedCategories.push(sharedCategory._id);
          await newUser.save();
          await helpers.incrementEventCount("registeredAfterShare");
          req.session.shareId = null;
        }
      }

      if (teacher) {
        newUser.isPremium = true;
        newUser.isTeacher = true;
        newUser.premiumGrantedByAdmin = true;
        newUser.credits = 10000;
        newUser.creditsMonthlyLimit = 10000;
        newUser.plan = "yearly";
        newUser.endDate = moment().add(100, "years");
        await newUser.save();
      }

      req.flash("successOverlay", "Skvělé! Účet byl vytvořen.");
      if (req.query.requiresPremium) {
        res.status(302).redirect("/premium");
      } else {
        res.status(302).redirect("/");
      }
    } catch (err) {
      if (
        err.message === "A user with the given username is already registered"
      ) {
        req.flash("error", "Uživatel již existuje.");
      } else {
        console.log(err);
        req.flash("error", "Jejda, něco se nepovedlo.");
      }
      res.status(400).redirect("/");
    }
  })
);

// Redirect user to Google's OAuth 2.0 server
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Handle callback after Google has authenticated the user
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/user/login",
    failureFlash:
      "Přihlášení Google bylo neúspěšné. Zkuste se přihlásit jménem a heslem.",
  }),
  (req, res) => {
    res.status(302).redirect("/");
  }
);

async function incrementEventCount(eventName) {
  try {
    await Stats.findOneAndUpdate(
      { eventName },
      { $inc: { eventCount: 1 } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error("Error updating event count:", err);
  }
}

//LOGIN LOGIC
//login form (GET)
router.get("/auth/user/login", (req, res) => {
  res.status(200).render("auth/login_form");
});

//route with middleware to lowercase the email before login
router.post(
  "/auth/user/login",
  catchAsync(async (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
  }),
  passport.authenticate("local", {
    failureFlash: "Nesprávné heslo nebo e-mail.",
    failureRedirect: "/auth/user/login",
  }),
  catchAsync(async (req, res) => {
    let { shareId } = req.session;
    //handle shareId
    if (shareId) {
      let sharedCategory = await Category.findOne({ shareId: shareId });
      if (sharedCategory) {
        req.user.sharedCategories.push(sharedCategory._id);
        await req.user.save();
        req.session.shareId = null;
      }
    }
    res.status(302).redirect("/");
  })
);

//logout request (GET)
router.get("/auth/user/logout", isLoggedIn, (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(201).redirect("/");
  });
});

//verify email logic
router.get(
  "/auth/user/verifyEmail/:userId",
  catchAsync(async (req, res) => {
    let user = await User.findById(req.params.userId);
    if (!user) {
      req.flash("error", "Uživatel neexistuje.");
      return res.redirect("/");
    }
    if (user.isEmailVerified) {
      req.flash("successOverlay", "E-mail již byl ověřen.");
      return res.redirect("/");
    }
    user.isEmailVerified = true;
    await user.save();
    req.flash("successOverlay", "E-mail byl ověřen.");
    res.status(200).redirect("/");
  })
);

//request email verification resend
router.get(
  "/auth/user/requestEmailVerification",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "Uživatel neexistuje.");
      return res.redirect("/");
    }
    if (user.isEmailVerified) {
      req.flash("successOverlay", "E-mail již byl ověřen.");
      return res.redirect("/");
    }
    mail.emailVerification(user.email, user._id);
    req.flash(
      "successOverlay",
      `Ověřovací e-mail byl odeslán na ${user.email}.`
    );
    res.status(200).redirect("/");
  })
);

//PASSWORD RELATED ROUTES
//change password (GET)
router.get("/auth/user/changePassword", isLoggedIn, (req, res) => {
  res.status(200).render("auth/change_password");
});

//change password (POST)
router.post(
  "/auth/user/changePassword",
  isLoggedIn,
  catchAsync(async (req, res) => {
    try {
      if (req.body.newpassword === req.body.newpasswordcheck) {
        const user = await User.findById(req.user._id);

        //create hashed password for the JWT used with mobile app
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.newpassword, salt);
        const passwordJWT = hash;

        user.passwordJWT = passwordJWT;
        await user.save();

        await user.changePassword(req.body.oldpassword, req.body.newpassword);
        req.flash("successOverlay", "Heslo bylo změněno");
        res.redirect("/auth/user/profile");
      } else {
        req.flash(
          "error",
          "Nové heslo a Nové heslo pro kontrolu se musí shodovat"
        );
        res.status(200).redirect("/auth/user/changePassword");
      }
    } catch (err) {
      if (err.message === "Password or username is incorrect") {
        req.flash("error", "Nesprávné heslo");
      } else {
        req.flash("error", "Omlouváme se, něco se nepovedlo");
      }
      res.status(400).redirect("/auth/user/changePassword");
    }
  })
);

//set up password (GET)
router.get("/auth/user/setUpPassword", isLoggedIn, (req, res) => {
  const passChangeId = req.user.passChangeId;
  res.status(200).render("auth/set_up_password", { passChangeId });
});

//request forgotten password form (GET)
router.get("/auth/user/requestPassword", (req, res) => {
  res.status(200).render("auth/request_password");
});

//request forgotten password (POST)
router.post(
  "/auth/user/requestPassword",
  catchAsync(async (req, res) => {
    const email = req.body.email.toLowerCase();
    const user = await User.findOne({ email });
    //check if user exists
    if (!user) {
      req.flash("error", "Uživatelské jméno neexistuje");
      return res.redirect("/auth/user/requestPassword");
    }
    //create original passChangeId on user
    const passChangeId = uuid.v1();
    user.passChangeId = passChangeId;
    await user.save();
    //sent e-mail with link to user
    const changeLink = `/auth/user/setPassword/${passChangeId}`;
    const data = { link: changeLink, email: user.email };
    mail.forgottenPassword(data);
    res.status(200).render("auth/password_sent");
  })
);

//set password FORM (GET)
router.get(
  "/auth/user/setPassword/:passChangeId",
  catchAsync(async (req, res) => {
    const user = await User.findOne({ passChangeId: req.params.passChangeId });
    const { passChangeId } = req.params;
    if (!user) {
      req.status(400).flash("error", "Uživatel s passChangeId nenalezen.");
      return res.redirect("/");
    } else {
      res.status(200).render("auth/set_password", { passChangeId });
    }
  })
);

//set password POST
router.post(
  "/auth/user/setPassword/:passChangeId",
  catchAsync(async (req, res) => {
    const user = await User.findOne({ passChangeId: req.params.passChangeId });
    if (!user) {
      req.flash("error", "Uživatel s passChangeId nenalezen.");
      return res.redirect("/");
    } else if (req.body.newpassword === req.body.newpasswordcheck) {
      await user.setPassword(req.body.newpassword);

      //create hashed password for the JWT used with mobile app
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.newpassword, salt);
      const passwordJWT = hash;

      user.passwordJWT = passwordJWT;

      await user.save();
      req.login(user, (err) => {
        if (err) return next(err);
      });
      req.flash("successOverlay", "Heslo bylo změněno");
      res.status(200).redirect("/");
    } else {
      req.flash(
        "error",
        "Nové heslo a Nové heslo pro kontrolu se musí shodovat"
      );
      res
        .status(400)
        .redirect(`/auth/user/setPassword/${req.params.passChangeId}`);
    }
  })
);

//DELETE ACOUNT LOGIC (user's route)
//delete account - USER ROUTE (deleting user's own account)
router.get(
  "/auth/user/deleteMyAccount",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let foundUser = await User.findById(req.user._id);
    if (foundUser.plan === "none") {
      await User.findByIdAndDelete(req.user._id);
      mail.adminInfoUserDeleted(foundUser.email);
      req.flash("successOverlay", "Tvůj účet byl odstraněn.");
      res.status(201).redirect("/");
    } else {
      req.flash(
        "error",
        "Zdá se, že máš stále aktivní předplatné. Před odstraněním účtu jej prosím zruš."
      );
      res.redirect("/auth/user/profile");
    }
  })
);

//CHANGE NICKNAME (LEADERBOARD)
router.post(
  "/auth/user/changeNickname",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let existingUser = await User.findOne({ nickname: req.body.nickname });
    if (existingUser) {
      req.flash(
        "error",
        "Tato přezdívka či jméno je již obsazena/o. Zvol si prosím jinou/é."
      );
      return res.redirect("/leaderboard");
    }
    let foundUser = await User.findById(req.user._id);
    if (!foundUser) {
      req.flash("error", "Uživatel s tímto ID nebyl nenalezen.");
      return res.redirect("/leaderboard");
    }
    foundUser.nickname = req.body.nickname;
    await foundUser.save();
    res.status(200).redirect("/leaderboard");
  })
);

//change firstname and lastname (POST)
router.post(
  "/auth/user/changeName",
  isLoggedIn,
  validateName,
  catchAsync(async (req, res) => {
    let foundUser = await User.findById(req.user._id);
    if (!foundUser) {
      req.flash("error", "Uživatel s tímto ID nebyl nenalezen.");
      return res.redirect("/auth/user/profile");
    }
    foundUser.firstname = req.body.firstname;
    foundUser.lastname = req.body.lastname;
    await foundUser.save();
    req.flash("successOverlay", "Jméno bylo změněno.");
    res.status(200).redirect("/auth/user/profile");
  })
);

//CHANGE DAILY GOAL
//route to change daily goal from profile page
router.post(
  "/auth/user/changeDailyGoal",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let dailyGoal = req.body.dailyGoal;
    let foundUser = await User.findById(req.user._id);
    if (!foundUser) {
      req.flash("error", "Uživatel s tímto ID nebyl nenalezen.");
      return res.redirect("/auth/user/profile");
    }
    foundUser.dailyGoal = dailyGoal;

    if (
      !foundUser.dailyGoalReachedToday &&
      foundUser.actionsToday >= dailyGoal
    ) {
      foundUser.dailyGoalReachedToday = true;
      foundUser.streakLength++;
    }

    await foundUser.save();
    req.flash("successOverlay", "Denní cíl byl změněn.");
    res.status(200).redirect("/auth/user/profile");
  })
);

//ACTIVITY ROUTE
//route to render user's activity page where he can see his test results and cards results sorted based on date (GET)
router.get(
  "/auth/user/activity",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "Uživatel nebyl nalezen.");
      return res.redirect("/");
    }
    let testResults = await TestResult.find({ user: user._id }).populate(
      "section category"
    );
    let cardsResults = await CardsResult.find({ user: user._id }).populate(
      "section category"
    );

    //mark the results as tests or cards
    testResults.forEach((result) => {
      result.type = "test";
    });
    cardsResults.forEach((result) => {
      result.type = "cards";
    });

    let allResults = testResults.concat(cardsResults);

    //sort the results by date and combine cards and tests
    allResults.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    //transform date to human readable format and update the array
    allResults.forEach((result) => {
      result.formattedDate = moment(result.date).locale("cs").format("LLL");
    });

    //count questions in the test by adding correct, incorrect and skipped
    allResults.forEach((result) => {
      if (result.type === "test") {
        result.totalQuestions =
          result.correct + result.incorrect + result.skipped;
      }
    });

    //set the number of cards or questions as a countTotal property
    allResults.forEach((result) => {
      if (result.type === "test") {
        result.countTotal = result.totalQuestions;
      } else {
        result.countTotal = result.totalCards;
      }
    });
    res.status(200).render("auth/activity", { allResults });
  })
);

module.exports = router;
