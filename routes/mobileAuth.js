const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const mail = require("../mail/mail_inlege");
const Stripe = require("../utils/stripe");
const uuid = require("uuid");
const moment = require("moment");

const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post(
  "/mobileAuth/createUser",
  catchAsync(async (req, res) => {
    try {
      let {
        email,
        password,
        passwordconfirmation,
        firstname,
        lastname,
        //facultySelectedValue,
        //sourceSelectedValue,
      } = req.body;
      const foundUser = await User.findOne({ email: email.toLowerCase() });

      if (foundUser) {
        return res.status(400).json({ message: "Uživatel již existuje." });
      }

      if (password !== passwordconfirmation) {
        return res.status(400).json({ message: "Hesla se musí shodovat." });
      }

      //create cookies object
      let cookies = {
        technical: true,
        analytical: true,
        marketing: true,
      };

      /*if (sourceSelectedValue === "neuvedeno") {
        sourceSelectedValue = "Neuvedeno";
      }*/
      let sourceSelectedValue = "Neuvedeno";

      const passChangeId = uuid.v1();
      const dateOfRegistration = Date.now();
      const customer = await Stripe.addNewCustomer(email);

      const newUser = new User({
        email: email.toLowerCase(),
        passwordJWT: password,
        username: email.toLowerCase(),
        admin: false,
        dateOfRegistration,
        firstname,
        lastname,
        passChangeId,
        billingId: customer.id,
        plan: "none",
        endDate: null,
        isGdprApproved: true,
        //faculty: facultySelectedValue,
        faculty: "Neuvedeno",
        source: sourceSelectedValue,
        cookies,
      });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.passwordJWT, salt);
      newUser.passwordJWT = hash;

      const createdUser = await User.register(newUser, password);

      //send info e-mails
      mail.welcome(createdUser.email);
      mail.adminInfoNewUser(createdUser);

      return res.status(201).json({
        message: "user created",
        user: { email: createdUser.email, id: createdUser._id },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

router.post(
  "/mobileAuth/loginUser",
  catchAsync(async (req, res) => {
    try {
      const { email, password } = req.body;
      //check if user exists
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (!userExists) {
        return res
          .status(400)
          .json({ message: "Nesprávný e-mail nebo heslo." });
      }

      if (userExists && !userExists.passwordJWT) {
        return res.status(400).json({
          message:
            "Pro přihlášení přes aplikaci je třeba nastavit nové heslo. (passwordChangeRequired)",
          code: "passwordChangeRequired",
        });
      }

      // check if password is correct
      const isMatch = await bcrypt.compare(password, userExists.passwordJWT);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Nesprávný e-mail nebo heslo." });
      } else {
        const payload = { id: userExists._id };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
        return res.status(200).json({
          message: "user logged in",
          accessToken: accessToken,
          email: userExists.email,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

router.post(
  "/mobileAuth/restorePassword",
  catchAsync(async (req, res) => {
    try {
      const { email } = req.body;
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (!userExists) {
        return res.status(400).json({ message: "Uživatel neexistuje." });
      }
      //create original passChangeId on user
      const passChangeId = uuid.v1();
      userExists.passChangeId = passChangeId;
      await userExists.save();
      //sent e-mail with link to user
      const changeLink = `/auth/user/setPassword/${passChangeId}`;
      const data = { link: changeLink, email: userExists.email };
      mail.forgottenPassword(data);
      res
        .status(200)
        .json({ message: "E-mail s odkazem na změnu hesla byl odeslán." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

router.get(
  "/mobileAuth/getProfile",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    try {
      // check if user exists
      const userExists = await User.findById(req.user.id);
      if (!userExists) {
        return res.status(400).json({ message: "Uživatel neexistuje." });
      }
      let endDate = "";
      let duplicatedUser = userExists.toObject();
      duplicatedUser.dateOfRegistration = moment(userExists.dateOfRegistration)
        .locale("cs")
        .format("LL");
      if (userExists.isPremium) {
        duplicatedUser.endDate = moment(duplicatedUser.endDate)
          .locale("cs")
          .format("LL");
      }
      return res.status(200).json({ user: duplicatedUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

router.delete(
  "/mobileAuth/deleteAccount",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Uživatel neexistuje." });
      }
      if (user.plan !== "none") {
        return res
          .status(404)
          .json({ message: "Před zrušením účtu je nutné zrušit přeplatné." });
      }
      await User.findByIdAndDelete(userId);
      mail.adminInfoUserDeleted(user.email);
      return res.status(200).json({ message: "Účet byl úspěšně smazán." });
    } catch (error) {
      console.log("Error deleting account:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

module.exports = router;
