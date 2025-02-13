const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Category = require("../models/category");
const Section = require("../models/section");
const Stats = require("../models/stats");
const Feedback = require("../models/feedback");
const { isLoggedIn, isAdmin } = require("../utils/middleware");
const moment = require("moment");
const mail = require("../mail/mail");
const icons = require("../utils/icons");

//ADMIN - SHOW ADMIN
router.get(
  "/admin/admin",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const users = await User.find({});
    let startRandomTestStats = await Stats.findOne({
      eventName: "startRandomTest",
    });
    let startRandomCardsStats = await Stats.findOne({
      eventName: "startRandomCards",
    });
    if (!startRandomTestStats) {
      startRandomTestStats = { eventCount: 0 };
    }
    if (!startRandomCardsStats) {
      startRandomCardsStats = { eventCount: 0 };
    }
    //count cards and sections
    const sectionsFree = await Section.find().select("cards");
    let cardsFreeCount = 0;
    let sectionsFreeCount = sectionsFree.length;
    sectionsFree.forEach((section) => {
      cardsFreeCount = cardsFreeCount + section.cards.length;
    });

    let updatedUsers = [];

    //count all users and premium users
    let premiumUsersCount = 0;
    let activePremiumSubscriptions = 0;
    let PUCMonth = 0;
    let PUCYear = 0;
    let registeredUsersCount = 0;
    let usersActiveInLastWeek = 0;
    let premiumActivationsInLastWeek = 0;
    let premiumUpdatesInLastWeek = 0;
    let premiumDeactivationsInLastWeek = 0;
    let unsubscribedUsersCount = 0;
    let totalCardsSeen = 0;
    let totalQuestionsSeen = 0;
    let monthCardsSeen = 0;
    let monthQuestionsSeen = 0;
    let reachedQuestionsLimit = 0;
    let hasUnsubscribedFromStreak = 0;
    let sources = {
      pratele: 0,
      ucitele: 0,
      instagram: 0,
      facebook: 0,
      google: 0,
      odjinud: 0,
      neuvedeno: 0,
    };

    users.forEach((user) => {
      let newUser = user;
      if (newUser.source === "-") {
        newUser.source = "neuvedeno";
      }
      //mark user as active in the last 48 hours
      newUser.updatedDateOfRegistration = moment(user.dateOfRegistration)
        .locale("cs")
        .format("LL");
      if (user.lastActive) {
        newUser.updatedLastActive = moment(user.lastActive)
          .locale("cs")
          .format("LL");
      } else {
        newUser.updatedLastActive = "-";
      }

      updatedUsers.push(newUser);

      //COUNTING
      //count Registered users
      registeredUsersCount = users.length;
      //count Premium users
      if (user.isPremium === true) {
        premiumUsersCount++;
      }
      //count users who are paying for Premium and have not canceled
      if (
        user.isPremium &&
        user.plan !== "none" &&
        !user.premiumGrantedByAdmin
      ) {
        activePremiumSubscriptions++;
        if (user.plan === "monthly") {
          PUCMonth++;
        }
        if (user.plan === "yearly") {
          PUCYear++;
        }
      }
      //count unsubscribed users
      if (user.hasUnsubscribed === true) {
        unsubscribedUsersCount++;
      }
      //count free users who reached questions limit
      if (!user.isPremium && user.questionsSeenThisMonth > 100) {
        reachedQuestionsLimit++;
      }
      //count users active in the last week
      if (
        user.lastActive &&
        moment(user.lastActive).isAfter(moment().subtract(1, "week"))
      ) {
        usersActiveInLastWeek++;
      }
      //count premium activations in the last week
      if (
        user.premiumDateOfActivation &&
        moment(user.premiumDateOfActivation).isAfter(
          moment().subtract(1, "week")
        )
      ) {
        premiumActivationsInLastWeek++;
      }
      //count premium updates in the last week
      if (
        user.premiumDateOfUpdate &&
        moment(user.premiumDateOfUpdate).isAfter(moment().subtract(1, "week"))
      ) {
        premiumUpdatesInLastWeek++;
      }
      //count premium deactivations in the last week
      if (
        user.premiumDateOfCancelation &&
        moment(user.premiumDateOfCancelation).isAfter(
          moment().subtract(1, "week")
        )
      ) {
        premiumDeactivationsInLastWeek++;
      }
      //count users unsubscribed form streak email reminder
      if (user.hasUnsubscribedFromStreak) {
        hasUnsubscribedFromStreak++;
      }

      //count sources
      if (user.source === "pratele") {
        sources.pratele++;
      }
      if (user.source === "ucitele") {
        sources.ucitele++;
      }
      if (user.source === "instagram") {
        sources.instagram++;
      }
      if (user.source === "facebook") {
        sources.facebook++;
      }
      if (user.source === "google") {
        sources.google++;
      }
      if (user.source === "odjinud") {
        sources.odjinud++;
      }
      if (user.source === "neuvedeno") {
        sources.neuvedeno++;
      }

      //totalCardsCount
      totalCardsSeen = totalCardsSeen + user.cardsSeen;
      totalQuestionsSeen = totalQuestionsSeen + user.questionsSeenTotal;
      monthCardsSeen = monthCardsSeen + user.cardsSeenThisMonth;
      monthQuestionsSeen = monthQuestionsSeen + user.questionsSeenThisMonth;
    });
    updatedUsers.reverse();

    //get all stats
    let allStats = await Stats.find({});
    //order stats alphabetically by eventName
    allStats.sort(function (a, b) {
      return a.eventName.localeCompare(b.eventName);
    });

    res.status(200).render("admin/admin", {
      users: updatedUsers,
      premiumUsersCount,
      registeredUsersCount,
      usersActiveInLastWeek,
      premiumActivationsInLastWeek,
      premiumUpdatesInLastWeek,
      premiumDeactivationsInLastWeek,
      cardsFreeCount,
      sectionsFreeCount,
      startRandomTestStats,
      startRandomCardsStats,
      unsubscribedUsersCount,
      totalCardsSeen,
      totalQuestionsSeen,
      monthCardsSeen,
      monthQuestionsSeen,
      activePremiumSubscriptions,
      sources,
      reachedQuestionsLimit,
      hasUnsubscribedFromStreak,
      PUCMonth,
      PUCYear,
      allStats,
    });
  })
);

//ADMIN - SHOW ALL USERS
//show all registered users
router.get(
  "/admin/users",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const users = await User.find({});
    let { order } = req.query;
    let updatedUsers = [];

    users.forEach((user) => {
      let newUser = user;
      //mark user as active in the last 48 hours
      if (
        newUser.lastActive &&
        moment(newUser.lastActive).isAfter(moment().subtract(48, "hour"))
      ) {
        newUser.activeInLast48Hours = true;
      }
      newUser.updatedDateOfRegistration = moment(user.dateOfRegistration)
        .locale("cs")
        .format("LL");
      if (user.lastActive) {
        newUser.updatedLastActive = moment(user.lastActive)
          .locale("cs")
          .format("LL");
      } else {
        newUser.updatedLastActive = "-";
      }

      updatedUsers.push(newUser);
    });
    //reverse array of users
    updatedUsers.reverse();

    //order users by
    if (order === "cards") {
      updatedUsers.sort(function (a, b) {
        return b.cardsSeen - a.cardsSeen;
      });
    }

    if (order === "questions") {
      updatedUsers.sort(function (a, b) {
        return b.questionsSeenTotal - a.questionsSeenTotal;
      });
    }

    if (order === "streak") {
      updatedUsers.sort(function (a, b) {
        return b.streakLength - a.streakLength;
      });
    }

    //render page
    res.status(200).render("admin/users", {
      users: updatedUsers,
    });
  })
);

//show all active subsriptions
router.get(
  "/admin/activeSubscriptions",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const users = await User.find({ isPremium: true });

    let updatedUsers = [];

    users.forEach((user) => {
      if (user.plan !== "none" && !user.premiumGrantedByAdmin) {
        let newUser = user;
        newUser.updatedDateOfRegistration = moment(user.dateOfRegistration)
          .locale("cs")
          .format("LL");
        newUser.updatedDateOfActivation = moment(user.premiumDateOfActivation)
          .locale("cs")
          .format("LL");
        if (user.premiumDateOfUpdate) {
          newUser.updatedDateOfUpdate = moment(user.premiumDateOfUpdate)
            .locale("cs")
            .format("LL");
        } else {
          newUser.updatedDateOfUpdate = "-";
        }
        updatedUsers.push(newUser);
      }
    });
    //sort users according to the date of activation
    updatedUsers.sort(
      (a, b) =>
        moment(a.premiumDateOfActivation).valueOf() -
        moment(b.premiumDateOfActivation).valueOf()
    );
    updatedUsers.reverse();

    //render page
    res.status(200).render("admin/activeSubscriptions", {
      users: updatedUsers,
    });
  })
);

//DETAIL OF A USER (show)
//show details of user to admin
router.get(
  "/admin/:userId/showDetail",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let user = await User.findById(req.params.userId).populate(
      "invoicesDbObjects createdCategories"
    );
    if (!user) {
      req.flash("error", "Uživatel nebyl nalezen.");
      return res.redirect("/admin/users");
    }
    let endDate = "";
    let dateOfRegistration = moment(user.dateOfRegistration)
      .locale("cs")
      .format("LLLL");
    if (user.lastActive) {
      lastActive = moment(user.lastActive).locale("cs").format("LLLL");
    } else {
      lastActive = "-";
    }
    if (user.isPremium) {
      endDate = moment(user.endDate).locale("cs").format("LLLL");
    }

    //format dates
    let premiumDateOfActivation = moment(user.premiumDateOfActivation)
      .locale("cs")
      .format("LLLL");
    let premiumDateOfUpdate = moment(user.premiumDateOfUpdate)
      .locale("cs")
      .format("LLLL");
    let premiumDateOfCancelation = moment(user.premiumDateOfCancelation)
      .locale("cs")
      .format("LLLL");
    premiumDateOfActivation === "Invalid date"
      ? (premiumDateOfActivation = "-")
      : premiumDateOfActivation;
    premiumDateOfUpdate === "Invalid date"
      ? (premiumDateOfUpdate = "-")
      : premiumDateOfUpdate;
    premiumDateOfCancelation === "Invalid date"
      ? (premiumDateOfCancelation = "-")
      : premiumDateOfCancelation;

    //render view
    res.status(200).render("admin/showUserDetail", {
      user,
      endDate,
      dateOfRegistration,
      lastActive,
      premiumDateOfActivation,
      premiumDateOfUpdate,
      premiumDateOfCancelation,
    });
  })
);

//set user.cardsSeen to 0
router.get(
  "/admin/:userId/cardsSeenToZero",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { userId } = req.params;
    await User.findByIdAndUpdate(userId, { cardsSeen: 0 });
    req.flash("successOverlay", "Vynulováno - cardsSeen.");
    res.redirect(`/admin/${userId}/showDetail`);
  })
);

//set user.questionsSeenTotal to 0
router.get(
  "/admin/:userId/questionsSeenTotalToZero",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { userId } = req.params;
    await User.findByIdAndUpdate(userId, { questionsSeenTotal: 0 });
    req.flash("successOverlay", "Vynulováno - questionsSeenTotal.");
    res.redirect(`/admin/${userId}/showDetail`);
  })
);

//set user.actionsToday to 0
router.get(
  "/admin/:userId/actionsTodayToZero",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { userId } = req.params;
    await User.findByIdAndUpdate(userId, { actionsToday: 0 });
    req.flash("successOverlay", "Vynulováno - actionsToday.");
    res.redirect(`/admin/${userId}/showDetail`);
  })
);

//get section name over AJAX based on sectionId (for showUserDetail page)
router.get(
  "/admin/:sectionId/getNameOfSection",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let section = await Section.findById(req.params.sectionId).select("name");
    if (!section) {
      return res.sendStatus(404);
    }
    res.status(200).send(section);
  })
);

//ADMIN - Upgrade to PREMIUM and downgrade to FREE
//upgrade to premium - ADMIN ROUTE
router.get(
  "/admin/:userId/upgradeToPremium/:period",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.params.userId);
    let { period } = req.params;
    if (!user) {
      throw Error("Uživatel s tímto ID neexistuje");
    }
    user.isPremium = true;
    user.premiumGrantedByAdmin = true;
    if (period === "addDay") {
      user.plan = "daily";
      user.endDate = moment().add(1, "days");
    }
    if (period === "addMonth") {
      user.plan = "monthly";
      user.endDate = moment().add(1, "months");
    }
    if (period === "add6Weeks") {
      user.plan = "monthly";
      user.endDate = moment().add(6, "weeks");
    }
    if (period === "addYear") {
      user.plan = "yearly";
      user.endDate = moment().add(1, "years");
    }
    if (period === "addDecade") {
      user.plan = "yearly";
      user.endDate = moment().add(10, "years");
    }
    await user.save();
    let endDate = moment(user.endDate).locale("cs").format("LL");
    mail.sendAdminGrantedPremium(user.email, endDate);
    req.flash("successOverlay", "Uživatel je nyní Premium");
    res.status(201).redirect("/admin/users");
  })
);

//downgrade to FREE - ADMIN ROUTE
router.put(
  "/admin/:userId/downgradeToFree/",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let user = await User.findById(req.params.userId);
    if (!user) {
      throw Error("Uživatel s tímto ID neexistuje");
    }

    user.isPremium = false;
    user.premiumGrantedByAdmin = false;
    user.endDate = null;
    user.premiumDateOfActivation = null;
    user.premiumDateOfUpdate = null;
    user.premiumDateOfCancelation = null;
    user.plan = "none";

    await user.save();
    req.flash(
      "successOverlay",
      "Premium ukončeno. Uživateli byl nastaven balíček Free."
    );
    res.status(201).redirect(`/admin/${user._id}/showDetail`);
  })
);

//show all feedbacks
router.get("/admin/feedbacks", isLoggedIn, isAdmin, async (req, res) => {
  const feedbacks = await Feedback.find({});

  //edit the date on each feedback to be more readable
  feedbacks.forEach((feedback) => {
    feedback.updatedDate = moment(feedback.date).locale("cs").format("LL");
  });

  res.status(200).render("admin/feedbacks", { feedbacks });
});

//EMAILS FROM ADMIN TO USERS
//email (render)
router.get("/admin/email", isLoggedIn, isAdmin, (req, res) => {
  res.status(200).render("admin/email");
});

//NOTIFICATIONS FROM ADMIN TO USERS
//notification (render)
router.get("/admin/notifications", isLoggedIn, isAdmin, (req, res) => {
  res.status(200).render("admin/notifications");
});

//email (send)
router.post(
  "/admin/email",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let allUsers = await User.find({});
    let { subjectAll, textAll, groupChoice } = req.body;
    //send e-mail to a group of users based on radio button choice
    //send to all users
    if (groupChoice === "radioAll") {
      allUsers.forEach((user) => {
        mail.sendEmergencyEmail(user.email, subjectAll, textAll);
      });
      //send to users who did not unsubscribed
    } else if (groupChoice === "radioSelected") {
      //send email to subscribed users
      allUsers.forEach((user) => {
        if (user.hasUnsubscribed === false) {
          mail.sendEmailToSubscribedUsers(user.email, subjectAll, textAll);
        }
      });
      //send to Free users and those premiumGrantedByAdmin
    } else if (groupChoice === "radioFree") {
      //send email to Free users
      allUsers.forEach((user) => {
        if (
          user.hasUnsubscribed === false &&
          (!user.isPremium || user.premiumGrantedByAdmin)
        ) {
          mail.sendEmailToSubscribedUsers(user.email, subjectAll, textAll);
        }
      });
    } else if (groupChoice === "radioPremium") {
      //send email to Premium users
      allUsers.forEach((user) => {
        if (
          user.hasUnsubscribed === false &&
          user.isPremium &&
          !user.premiumGrantedByAdmin &&
          user.plan !== "none"
        ) {
          mail.sendEmailToSubscribedUsers(user.email, subjectAll, textAll);
        }
      });
    } else if (groupChoice === "radioTest") {
      mail.sendTestEmail("pravnicime@gmail.com", subjectAll, textAll);
      //should never run, implies some problem with radio buttons
    } else {
      req.flash("fail", "E-mail nebyl odeslán, něco se nepovedlo");
      return res.status(400).redirect("/admin/email");
    }
    //redirect back and flash admin with confirmation
    req.flash("successOverlay", "E-mail byl odeslán všem uživatelům");
    res.status(200).redirect("/admin/email");
  })
);

// email (unsubscribe)
router.get(
  "/admin/email/unsubscribe",
  catchAsync(async (req, res) => {
    let { email } = req.query;
    let user = await User.findOne({ email });
    if (user) {
      user.hasUnsubscribed = true;
      await user.save();
      req.flash(
        "successOverlay",
        "Zasílání informačních e-mailů na váš e-mail bylo zrušeno."
      );
      return res.redirect("/");
    } else {
      req.flash(
        "error",
        "Omlouváme se, něco se nepovedlo. Zkuste to prosím později."
      );
      return res.redirect("/");
    }
  })
);

// email (unsubscribed streak)
router.get(
  "/admin/email/unsubscribeStreak",
  catchAsync(async (req, res) => {
    let { email } = req.query;
    let user = await User.findOne({ email });
    if (user) {
      user.hasUnsubscribedFromStreak = true;
      await user.save();
      req.flash(
        "successOverlay",
        "Zasílání připomínek na váš e-mail bylo zrušeno."
      );
      return res.redirect("/");
    } else {
      req.flash(
        "error",
        "Omlouváme se, něco se nepovedlo. Zkuste to prosím později."
      );
      return res.redirect("/");
    }
  })
);

//DELETE PROFILE LOGIC (admin route)
//delete account - ADMIN ROUTE
router.delete(
  "/admin/:userId/deleteUser",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);
    res.status(201).redirect("/admin/users");
  })
);

//ADMIN PERMISIONS LOGIC (grant and remove)
//give admin permisions to a user
router.post(
  "/admin/:userId/makeAdmin",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { userId } = req.params;
    let { adminpass } = req.body;
    let user = await User.findById(userId);
    if (!user) {
      req.flash("error", "Uživatel neexistuje");
      return res.redirect("/admin/users");
    }
    if (adminpass !== process.env.adminRegKey) {
      req.flash("error", "Nesprávný administrátorský kód");
      return res.redirect("/admin/users");
    }
    user.admin = true;
    await user.save();
    req.flash("successOverlay", "Administrátorská oprávnění byla udělena.");
    res.redirect("/admin/users");
  })
);

//remove admin permisions from a user
router.post(
  "/admin/:userId/removeAdmin",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { userId } = req.params;
    let { adminpass } = req.body;
    let user = await User.findById(userId);
    if (!user) {
      req.flash("error", "Uživatel neexistuje");
      return res.redirect("/admin/users");
    }
    if (adminpass !== process.env.adminRegKey) {
      req.flash("error", "Nesprávný administrátorský kód");
      return res.redirect("/admin/users");
    }
    user.admin = false;
    await user.save();
    req.flash("successOverlay", "Administrátorská oprávnění byla odebrána.");
    res.redirect("/admin/users");
  })
);

//PROVIDE FEEDBACK LOGIC
//render feedback form
router.get(
  "/legal/feedback",
  catchAsync(async (req, res) => {
    let user = {};
    if (req.user) {
      user = req.user;
    }
    res.status(200).render("legal/feedback", { user });
  })
);

//send feedback
router.post(
  "/legal/feedback",
  catchAsync(async (req, res) => {
    const { email, name, text, school } = req.body;

    if (school) {
      req.flash("error", "Detekován bot. Zpráva byla odmítnuta.");
      return res.redirect("back");
    }

    mail.sendFeedback(email, name, text);
    req.flash("successOverlay", "Feedback byl odeslán. Díky!");
    res.status(201).redirect(`/legal/feedback`);
  })
);

//CONTACT FORM
//send message
router.post(
  "/legal/contactForm",
  catchAsync(async (req, res) => {
    const { email, name, text, school } = req.body;

    if (school) {
      req.flash("error", "Detekován bot. Zpráva byla odmítnuta.");
      return res.redirect("back");
    }

    mail.sendMessageFromContactForm(email, name, text);
    req.flash("successOverlay", "Zpráva byla odeslána.");
    res.status(201).redirect(`/legal/contact`);
  })
);

//route to set isEmailVerified to true
router.get("/admin/:userId/verifyEmail", async (req, res) => {
  let { userId } = req.params;
  await User.findByIdAndUpdate(userId, { isEmailVerified: true });
  req.flash("successOverlay", "E-mail byl ověřen.");
  res.redirect(`/admin/${userId}/showDetail`);
});

//SHOW RATINGS
router.get(
  "/admin/ratings",
  catchAsync(async (req, res) => {
    let { order } = req.query;
    let packages = await Section.find({});

    //order packages by
    if (order === "cards") {
      packages.sort(function (a, b) {
        return b.ratingCards - a.ratingCards;
      });
    }

    if (order === "questions") {
      packages.sort(function (a, b) {
        return b.ratingQuestions - a.ratingQuestions;
      });
    }

    res.status(201).render(`admin/ratings`, { packages });
  })
);

//route to add 100 credits to a user
router.get("/admin/:userId/addCredits", async (req, res) => {
  let { userId } = req.params;
  let { amount } = req.query;
  await User.findByIdAndUpdate(userId, { $inc: { extraCredits: amount } });
  req.flash(
    "successOverlay",
    `Uživateli bylo přidáno ${amount} extra kreditů.`
  );
  res.redirect(`/admin/${userId}/showDetail`);
});

//HELPERS
const monthsInCzech = [
  "Leden", // January
  "Únor", // February
  "Březen", // March
  "Duben", // April
  "Květen", // May
  "Červen", // June
  "Červenec", // July
  "Srpen", // August
  "Září", // September
  "Říjen", // October
  "Listopad", // November
  "Prosinec", // December
];

module.exports = router;
