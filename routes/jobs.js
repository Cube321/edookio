const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const JobEvent = require("../models/jobEvent");
const { isLoggedIn, isAdmin } = require("../utils/middleware");
const moment = require("moment");
const { search } = require("./questions");

router.get(
  "/admin/jobs",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    const { select } = req.query;

    let searchQuery = {};

    if (select === "error") {
      searchQuery = { finishedSuccessfully: { $ne: true } };
    }

    if (select === "demo") {
      searchQuery = { isDemo: true };
    }

    //get last 100 job events
    let jobEvents = await JobEvent.find(searchQuery)
      .sort({ date: -1 })
      .limit(100)
      .populate("user");

    jobEvents = jobEvents.map((job) => {
      job.dateFormatted = moment(job.date).format("DD.MM.YYYY HH:mm");
      return job;
    });

    res.render("admin/jobs", { jobEvents });
  })
);

module.exports = router;
