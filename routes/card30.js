const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const CardsResult = require("../models/cardsResult");
const CardInfo = require("../models/cardInfo");
const { isLoggedIn } = require("../utils/middleware");
const { incrementEventCount } = require("../utils/helpers");

//CARD 3.0 RENDER ROUTES

//render empty show card page
router.get(
  "/category/:categoryId/section/:sectionId/card30/:cardNum",
  catchAsync(async (req, res) => {
    let { mode } = req.query;
    if (!mode) {
      mode = "all";
    }

    let foundSection = await Section.findById(req.params.sectionId).populate(
      "cards"
    );
    if (!foundSection) {
      req.flash("error", "Balíček se zadaným ID neexistuje.");
      return res.status(404).redirect("back");
    }
    const foundCategory = await Category.findById(foundSection.categoryId);
    if (!foundCategory) {
      req.flash("error", "Předmět se zadaným názvem neexistuje.");
      return res.status(404).redirect("back");
    }
    //handle lastSeenCard
    if (req.user) {
      foundSection.countStarted++;
      await foundSection.save();
    }
    res.render("cards/show30", {
      section: foundSection,
      categoryIcon: foundCategory.icon,
      mode,
    });
  })
);

//render empty show card page for SHUFFLE
router.get(
  "/category/:categoryId/randomCards",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    //icon for category
    let foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Předmět se zadaným názvem neexistuje.");
      return res.status(404).redirect("back");
    }
    incrementEventCount("startRandomCards");

    res.render("cards/show30shuffle", {
      category: foundCategory,
    });
  })
);

//render finished page
router.get(
  "/category/section/:sectionId/finished",
  catchAsync(async (req, res) => {
    let cardsCount = 0;
    if (req.query.cardsCount) {
      cardsCount = req.query.cardsCount;
    }
    let foundSection = await Section.findById(req.params.sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje.");
    }
    let foundCategory = await Category.findById(foundSection.categoryId);
    if (!foundCategory) {
      throw Error("Předmět s tímto ID neexistuje.");
    }

    if (req.user) {
      let user = req.user;

      //increase finishedSection count by 1
      foundSection.countFinished++;
      await foundSection.save();

      //create new CardsResult
      await CardsResult.create({
        user: user._id,
        category: foundCategory._id,
        section: foundSection._id,
        cardsType: "section",
        totalCards: cardsCount,
      });

      console.log("Cards result created");

      //count how many cards from this package are known to the user and how many are unknown or he has not seen them yet
      let knownCards = 0;

      for (let card of foundSection.cards) {
        let cardInfo = await CardInfo.findOne({
          user: user._id,
          card: card,
        });
        if (cardInfo && cardInfo.known) {
          knownCards++;
        }
      }
      const cardsTotal = foundSection.cards.length;

      //knowsAll
      let knowsAll = false;
      if (knownCards === cardsTotal) {
        knowsAll = true;
      }

      res.render("sections/finishedLive", {
        category: foundSection.categoryId,
        categoryId: foundCategory._id,
        section: foundSection,
        knownCards,
        cardsTotal,
        knowsAll,
      });
    } else {
      return res.status(200).render("sections/finishedDemo", {
        category: foundSection.categoryId,
        sectionName: foundSection.name,
        categoryId: foundCategory._id,
      });
    }
  })
);

//render finished page for SHUFFLE
router.get(
  "/category/:categoryId/finishedRandomCards",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    console.log("categoryId", categoryId);
    let foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Předmět se zadaným názvem neexistuje.");
      return res.status(404).redirect("back");
    }
    incrementEventCount("finishRandomCards");
    //create new CardsResult
    await CardsResult.create({
      user: req.user._id,
      category: foundCategory._id,
      cardsType: "random",
      totalCards: 20,
    });
    console.log("Cards result created");
    res.render("cards/finishedRandom", { categoryId });
  })
);

module.exports = router;
