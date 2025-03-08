const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const helpers = require("../utils/helpers");

router.get(
  "/blog",
  catchAsync(async (req, res) => {
    if (!req.session?.campaign) {
      await helpers.incrementEventCount(`marketingCampaign-blog`);
      req.session.campaign = "blog";
    }

    res.render("blog/blog");
  })
);

router.get(
  "/blog/:title",
  catchAsync(async (req, res) => {
    const { title } = req.params;

    if (!req.session?.campaign) {
      await helpers.incrementEventCount(`marketingCampaign-blog`);
      req.session.campaign = "blog";
    }

    if (title === "jak-se-efektivne-ucit") {
      return res.render("blog/post-1");
    }

    if (title === "jak-prekonat-prokrastinaci") {
      return res.render("blog/post-2");
    }

    if (title === "jak-se-ucit-v-souvislostech") {
      return res.render("blog/post-3");
    }

    if (title === "jak-si-zlepsit-pamet") {
      return res.render("blog/post-4");
    }

    if (
      title === "proc-jsou-opakovaci-karticky-a-testy-skvelou-studijní-pomuckou"
    ) {
      return res.render("blog/post-5");
    }

    req.flash("error", "Článek nebyl nalezen");
    return res.render("blog/blog");
  })
);

module.exports = router;
