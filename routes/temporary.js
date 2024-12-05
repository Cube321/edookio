const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

//TEMPORARY ROUTES
router.get(
  "/temporary/af",
  catchAsync(async (req, res) => {
    const { user } = req;
    user.appAnnouncementModalShown = false;
    await user.save();
    res.sendStatus(200);
  })
);

module.exports = router;
