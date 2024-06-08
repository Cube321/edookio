const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const mail = require('../mail/mail_inlege');

const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const isJWTLoggedIn = passport.authenticate("jwt", { session: false });

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

router.post('/mobileAuth/createUser', catchAsync(async(req, res) => {
    try {
        const {email, password} = req.body;
        const foundUser = await User.findOne({email: email.toLowerCase()});

        if(foundUser){
            return res.status(400).json({message: 'Uživatel již existuje.'});
        }

        const newUser = new User({
            email: email.toLowerCase(),
            passwordJWT: password,
            username: email.toLowerCase()
        })

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newUser.passwordJWT, salt);
        newUser.passwordJWT = hash;

        const createdUser = await User.register(newUser, password);
        
        //send info e-mails
        mail.welcome(createdUser.email);
        mail.adminInfoNewUser(createdUser);

        return res.status(201).json({message: "user created", user: { email: createdUser.email, id: createdUser._id }});
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
}))

router.post('/mobileAuth/loginUser', catchAsync(async(req, res) => {
    try {
        const {email, password} = req.body;
        //check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (!userExists){
            return res.status(400).json({ message: "Nesprávný e-mail nebo heslo." });
        }
        
        if (userExists && !userExists.passwordJWT){
            return res.status(400).json({ message: "Pro přihlášení přes aplikace je třeba nastavit nové heslo." });
        }
    
        // check if password is correct
        const isMatch = await bcrypt.compare(password, userExists.passwordJWT);
        if (!isMatch){
            return res.status(400).json({ message: "Nesprávný e-mail nebo heslo." });
        } else {
            const payload = {id: userExists._id};
            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.status(200).json({ message: "user logged in", accessToken: accessToken, email: userExists.email });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
}))

router.get('/mobileAuth/getProfile', passport.authenticate("jwt", { session: false }), catchAsync(async(req, res) => {
    try {
        // check if user exists
        const userExists = await User.findById(req.user.id);
        if (!userExists){
            return res.status(400).json({ message: "Uživatel neexistuje." });
        }
        return res.status(200).json({ user: userExists });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
      }
}))



module.exports = router;