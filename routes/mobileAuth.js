const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const mail = require("../mail/mail");
const Stripe = require("../utils/stripe");
const uuid = require("uuid");
const moment = require("moment");

const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const seedContent = require("../utils/seed");

const { validateEditUserApi } = require("../utils/middleware");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post(
  "/mobileAuth/createUser",
  catchAsync(async (req, res) => {
    try {
      let { email, password } = req.body;
      const foundUser = await User.findOne({ email: email.toLowerCase() });

      if (foundUser) {
        return res.status(400).json({ message: "Uživatel již existuje." });
      }

      //create cookies object
      let cookies = {
        technical: true,
        analytical: true,
        marketing: true,
      };

      let sourceSelectedValue = "Neuvedeno";

      const passChangeId = uuid.v1();
      const dateOfRegistration = Date.now();
      const customer = await Stripe.addNewCustomer(email);

      //create nickname
      let randomNumber = Math.floor(Math.random() * 9000) + 1000;
      let nickname = `${email.substring(0, 5)}${randomNumber}`;

      const newUser = new User({
        email: email.toLowerCase(),
        nickname,
        passwordJWT: password,
        username: email.toLowerCase(),
        admin: false,
        dateOfRegistration,
        passChangeId,
        billingId: customer.id,
        plan: "none",
        endDate: null,
        isGdprApproved: true,
        source: sourceSelectedValue,
        cookies,
        registrationPlatform: "mobile",
        isEmailVerified: false,
      });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.passwordJWT, salt);
      newUser.passwordJWT = hash;

      const createdUser = await User.register(newUser, password);

      //seed content
      let createdCategoryId = await seedContent(createdUser._id);
      createdUser.createdCategories.push(createdCategoryId);
      await createdUser.save();

      //send info e-mails
      mail.welcome(createdUser.email);
      mail.emailVerification(createdUser.email, createdUser._id);
      mail.adminInfoNewUser(createdUser);

      return res.status(201).json({
        message: "user created",
        user: { email: createdUser.email, userId: createdUser._id },
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
      let userExists = await User.findOne({ email: email.toLowerCase() });

      if (!userExists) {
        return res
          .status(400)
          .json({ message: "Nesprávný e-mail nebo heslo." });
      }

      if (
        userExists &&
        !userExists.passwordJWT &&
        userExists.registrationMethod === "google"
      ) {
        return res.status(400).json({
          message:
            "Pro přihlášení přes aplikaci je třeba nastavit heslo. (passwordSetUpRequired)",
          code: "passwordSetUpRequired",
        });
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
          userId: userExists._id,
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
      userExists.usedMobileApp = true;
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
      await userExists.save();
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

router.post(
  "/mobileAuth/notificationsAllowed",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Uživatel neexistuje." });
      }
      user.appNotificationsAllowed = true;
      await user.save();
      return res.status(200).json({ message: "Notifikace povoleny." });
    } catch (error) {
      console.log("Error setting notifications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);

router.post(
  "/mobileAuth/storePushToken",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { pushToken, error } = req.body;
      const userId = req.user._id;

      if (error) {
        console.log("Error storing push token:");
        console.log(error);
        return res.status(400).json({ error: "Error storing push token" });
      }

      console.log("Storing push token for user:", pushToken);

      // Find the user in DB and store the token
      const user = await User.findById(userId);
      user.expoPushToken = pushToken;
      await user.save();

      res.json({ success: true });
    } catch (error) {
      console.error("Error storing push token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/mobileAuth/saveSource",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log("Saving source for user:", req.user.email);
      const userId = req.user.id;
      const { source } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Uživatel neexistuje." });
      }
      user.source = source;
      await user.save();
      return res.status(200).json({ message: "Zdroj uložen." });
    } catch (error) {
      console.log("Error saving source:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//markUser mobileAuth
router.post(
  "/mobileAuth/markUser",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { action } = req.body;
      const { user } = req;

      if (action === "bonus100shown") {
        user.bonus100shown = true;
        console.log("Marking user as bonus100shown (mobileApi):", user.email);
      }

      if (action === "bonus500shown") {
        user.bonus500shown = true;
        console.log("Marking user as bonus500shown (mobileApi):", user.email);
      }

      await user.save();
      return res.status(200).json({ message: "User marked" });
    } catch (error) {
      console.log("Error saving bonus500Shown:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/mobileAuth/googleLogin",
  catchAsync(async (req, res) => {
    try {
      const { idToken } = req.body;
      const { platform } = req.body;
      if (!idToken) {
        return res.status(400).json({ message: "Missing Google ID token" });
      }

      let clientId = process.env.GOOGLE_CLIENT_ID;

      if (platform === "ios") {
        clientId = process.env.GOOGLE_CLIENT_ID_IOS;
      }

      //Android Google Login Does Not Work
      if (platform === "android") {
        clientId = process.env.GOOGLE_CLIENT_ID_ANDROID;
      }

      // 1. Verify token with Google
      const ticket = await client.verifyIdToken({
        idToken,
        audience: clientId,
      });
      const payload = ticket.getPayload();
      // payload includes .email, .sub (Google ID), .given_name, .family_name, etc.

      if (!payload) {
        return res.status(401).json({ message: "Invalid Google token" });
      }

      // 2. Check if user already exists by googleId or by email
      let user = await User.findOne({ googleId: payload.sub });
      let userByEmail = await User.findOne({
        email: payload.email.toLowerCase(),
      });

      // 3. If no user, create new
      if (!user && !userByEmail) {
        let admin = false;
        //create cookies object
        let cookies = {
          technical: true,
          analytical: true,
          marketing: true,
        };
        const passChangeId = uuid.v1();
        const customer = await Stripe.addNewCustomer(
          payload.email.toLowerCase()
        );

        user = new User({
          googleId: payload.sub,
          email: payload.email.toLowerCase(),
          username: payload.email.toLowerCase(),
          firstname: payload.given_name || "",
          lastname: payload.family_name || "",
          isEmailVerified: true, // Google ensures verified email
          dateOfRegistration: Date.now(),
          registrationPlatform: "mobile",
          registrationMethod: "google",
          admin: admin,
          cookies: cookies,
          passChangeId: passChangeId,
          billingId: customer.id,
          plan: "none",
          endDate: null,
          isGdprApproved: true,
        });
        //seed content
        let createdCategoryId = await seedContent(user._id);
        user.createdCategories.push(createdCategoryId);

        await user.save();
        mail.welcome(user.email);
        mail.adminInfoNewUser(user);
      } else if (userByEmail && !user) {
        // user with that email exists => link googleId
        userByEmail.googleId = payload.sub;
        userByEmail.username = payload.email.toLowerCase();
        await userByEmail.save();
        user = userByEmail;
      }

      // 4. Create your own app's JWT
      const tokenPayload = { id: user._id };
      const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET);

      // 5. Return the JWT + user info
      return res.status(200).json({
        message: "Google login successful",
        accessToken,
        email: user.email,
        userId: user._id,
      });
    } catch (error) {
      console.log("googleLogin error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  })
);

//updateAcountData with userData
router.post(
  "/mobileAuth/updateAcountData",
  passport.authenticate("jwt", { session: false }),
  validateEditUserApi,
  async (req, res) => {
    try {
      const userData = req.body;
      const { user } = req;

      if (!userData) {
        return res.status(400).json({ message: "Missing user data" });
      }

      if (userData.dailyGoal < 10) {
        return res.status(400).json({ message: "Minimální denní cíl je 10" });
      }

      //check if nickname is unique
      if (userData.nickname) {
        const nicknameExists = await User.findOne({
          nickname: userData.nickname,
        });
        if (
          nicknameExists &&
          nicknameExists._id.toString() !== user._id.toString()
        ) {
          return res.status(400).json({ message: "Přezdívka je již obsazena" });
        }
      }

      user.firstname = userData.firstName;
      user.lastname = userData.lastName;
      user.nickname = userData.nickname;
      user.dailyGoal = userData.dailyGoal;
      await user.save();
      return res.status(200).json({ message: "User data updated" });
    } catch (error) {
      console.log("Error updating user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
