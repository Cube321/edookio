const express = require("express");
const router = express.Router();

//show VOP
router.get("/legal/vop", (req, res) => {
  res.render("legal/vop");
});

//show GDPR
router.get("/legal/gdpr", (req, res) => {
  res.render("legal/gdpr");
});

//show contact
router.get("/legal/contact", (req, res) => {
  res.render("legal/contact");
});

//show delete info for Google Play
router.get("/legal/googleplay", (req, res) => {
  res.render("legal/googleplay");
});

module.exports = router;
