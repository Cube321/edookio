const { cardSchema } = require("../schemas.js");
const { userSchema } = require("../schemas.js");
const { sectionSchema } = require("../schemas.js");
const { questionSchema } = require("../schemas.js");
const { nameSchema } = require("../schemas.js");
const User = require("../models/user");
const Section = require("../models/section");
const ExpressError = require("../utils/ExpressError");
const moment = require("moment");
const mail = require("../mail/mail");

const middleware = {};

middleware.isLoggedIn = async (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "Pro přístup nemáte dostatečná oprávnění.");
    return res.redirect("/auth/user/login");
  }
  if (req.user.isPremium) {
    await checkAndUpdatePremiumEndDate(req.user);
  }
  next();
};

const checkAndUpdatePremiumEndDate = async (user) => {
  const today = Date.now();
  const { endDate } = user;
  if (moment(today).format() > moment(endDate).format()) {
    const foundUser = await User.findById(user._id);
    foundUser.isPremium = false;
    foundUser.premiumGrantedByAdmin = false;
    foundUser.endDate = null;
    foundUser.subscriptionSource = "none";
    foundUser.plan = "none";
    await foundUser.save();
    mail.sendPremiumEnded(foundUser.email);
  }
};

middleware.isAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    req.flash("error", "Tuto operaci může provést pouze administrátor.");
    res.redirect("back");
  }
};

middleware.isEditor = (req, res, next) => {
  if (req.user.isEditor || req.user.admin) {
    next();
  } else {
    req.flash(
      "error",
      "Tuto operaci může provést pouze editor nebo administrátor."
    );
    res.redirect("back");
  }
};

//check if the user created the category
middleware.isCategoryAuthor = async (req, res, next) => {
  const { categoryId } = req.params;
  //is categoryId in createdCategories of user?
  if (req.user.createdCategories.includes(categoryId)) {
    next();
  } else {
    req.flash("error", "Tuto operaci může provést pouze autor.");
    res.redirect("back");
  }
};

//check if the user created the section
middleware.isSectionAuthor = async (req, res, next) => {
  const { sectionId } = req.params;
  //check author of the section
  const foundSection = await Section.findById(sectionId);
  if (foundSection.author.equals(req.user._id)) {
    next();
  } else {
    req.flash("error", "Tuto operaci může provést pouze autor.");
    res.redirect("back");
  }
};

middleware.isPremiumUser = async (req, res, next) => {
  if (req.user && req.user.isPremium) {
    await checkAndUpdatePremiumEndDate(req.user);
    next();
  } else {
    next();
  }
};

//has to contain all elements of a mongoose schema even if no validation on them is required
middleware.validateCard = (req, res, next) => {
  const { error } = cardSchema.validate(req.body);
  if (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  } else {
    next();
  }
};

middleware.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  } else {
    next();
  }
};

middleware.validateSection = (req, res, next) => {
  const { error } = sectionSchema.validate(req.body);
  if (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  } else {
    next();
  }
};

middleware.validateQuestion = (req, res, next) => {
  const { error } = questionSchema.validate(req.body);
  if (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  } else {
    next();
  }
};

middleware.validateName = (req, res, next) => {
  const { error } = nameSchema.validate(req.body);
  if (error) {
    req.flash("error", error.message);
    return res.redirect("/");
  } else {
    next();
  }
};

module.exports = middleware;
