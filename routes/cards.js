const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Card = require("../models/card");
const Section = require("../models/section");
const User = require("../models/user");
const Category = require("../models/category");
const Mistake = require("../models/mistake");
const mail = require("../mail/mail_inlege");
const { validateCard, isLoggedIn, isEditor } = require("../utils/middleware");
const { incrementEventCount } = require("../utils/helpers");

//CARDS (add, edit, remove)
//render new card page (GET)
router.get(
  "/category/:category/section/:sectionId/newCard",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    const { category, sectionId } = req.params;
    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Sekce s tímto ID neexistuje");
    }
    res.status(200).render("cards/new_editor", {
      category,
      sectionId,
      sectionName: foundSection.name,
    });
  })
);

//add new card - save (POST)
router.post(
  "/category/:category/section/:sectionId/newCard",
  validateCard,
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    let { pageA, pageB } = req.body;
    const author = req.user.email;
    const { category, sectionId } = req.params;

    //replace all instances of <p><br></p> with nothing (remove empty paragraphs)
    pageA = pageA.replace(/<p><br><\/p>/g, "");
    pageB = pageB.replace(/<p><br><\/p>/g, "");

    const foundSection = await Section.findById(sectionId);
    const foundCategory = await Category.findOne({ name: req.params.category });
    if (!foundSection) {
      throw Error("Sekce s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    const newCard = new Card({
      category,
      section: sectionId,
      categoryId: foundCategory._id,
      pageA,
      pageB,
      author,
    });
    const createdCard = await newCard.save();
    foundCategory.numOfCards++;
    await foundCategory.save();
    foundSection.cards.push(createdCard._id);
    await foundSection.save();
    req.flash("successOverlay", "Kartička byla přidána do databáze.");
    res
      .status(201)
      .redirect(`/category/${category}/section/${sectionId}/newCard`);
  })
);

//edit card - form (GET)
router.get(
  "/cards/edit/:id",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      req.flash("error", "Kartička nebyla nalezena.");
      return res.redirect("/");
    }
    const foundSection = await Section.findById(card.section);
    if (!foundSection) {
      throw Error("Sekce s tímto ID neexistuje");
    }
    res
      .status(200)
      .render("cards/edit_editor", { card, sectionName: foundSection.name });
  })
);

//edit card - save (PUT)
router.put(
  "/cards/edit/:id",
  validateCard,
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let { pageA, pageB } = req.body;

    //replace all instances of <p><br></p> with nothing (remove empty paragraphs)
    pageA = pageA.replace(/<p><br><\/p>/g, "");
    pageB = pageB.replace(/<p><br><\/p>/g, "");

    let author = req.user.email;
    const foundCard = await Card.findByIdAndUpdate(id, {
      pageA,
      pageB,
      author,
    });
    if (!foundCard) {
      throw Error("Kartička s tímto ID neexistuje");
    }
    req.flash("successOverlay", "Kartička byla aktualizována.");
    res.status(201).redirect(`/review/${foundCard.section}/showAll`);
  })
);

//remove card (GET)
router.get(
  "/cards/remove/:id",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCard = await Card.findById(id);
    if (!foundCard) {
      throw Error("Kartička s tímto ID neexistuje");
    }
    await Section.findByIdAndUpdate(foundCard.section, {
      $pull: { cards: id },
    });
    await Card.findByIdAndDelete(id);
    const foundCategory = await Category.findOne({ name: foundCard.category });
    foundCategory.numOfCards--;
    await foundCategory.save();

    //delete the sourceCard from connected question
    let connectedQuestion = await Question.findById(
      foundCard.connectedQuestionId
    );
    if (connectedQuestion) {
      connectedQuestion.sourceCard = null;
      await connectedQuestion.save();
    }

    //removed card from cards saved by users
    await User.updateMany({}, { $pull: { savedCards: id } });

    req.flash("successOverlay", "Kartička byla odstraněna.");
    res.status(201).redirect(`/review/${foundCard.section}/showAll`);
  })
);

//NAHLÁSTI CHYBU NA KARTĚ
//render report form
router.get(
  "/cards/report/:cardId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const foundCard = await Card.findById(req.params.cardId);
    if (!foundCard) {
      throw Error("Kartička s tímto ID neexistuje");
    }
    res.status(200).render("cards/report", { card: foundCard });
  })
);

//save the report
router.post(
  "/cards/report/:cardId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const foundCard = await Card.findById(req.params.cardId);
    if (!foundCard) {
      throw Error("Kartička s tímto ID neexistuje");
    }
    const newMistake = {
      content: req.body.reportMsg,
      card: foundCard._id,
      author: req.user.email,
    };
    await Mistake.create(newMistake);
    res.status(201).render("cards/reportSubmited");
  })
);

//show all mistakes
router.get(
  "/admin/mistakes",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const mistakes = await Mistake.find().populate("question card");
    res.status(200).render("admin/reports", { mistakes });
  })
);

//FAVOURITE CARDS LOGIC
//save card to favourites
router.post(
  "/cards/save/:userEmail/:cardId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let foundUser = await User.findOne({ email: req.params.userEmail });
    if (!foundUser) {
      return res.sendStatus(404);
    }
    let isCardAlreadySaved = isCardInArray(
      foundUser.savedCards,
      req.params.cardId
    );
    if (!isCardAlreadySaved) {
      foundUser.savedCards.push(req.params.cardId);
      await foundUser.save();
    }
    res.sendStatus(200);
  })
);

//remove card from favourites
router.post(
  "/cards/unsave/:userEmail/:cardId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    if (req.params.userEmail !== req.user.email) {
      req.flash(
        "error",
        "Kartičku z uložených může odebrat jen uživatel, který ji uložil."
      );
      return res.sendStatus(403);
    }
    let foundUser = await User.findOne({ email: req.params.userEmail });
    if (!foundUser) {
      return res.sendStatus(404);
    }
    let updatedSavedCards = foundUser.savedCards.filter(
      (item) => item.toString() !== req.params.cardId
    );
    foundUser.savedCards = updatedSavedCards;
    await foundUser.save();
    res.sendStatus(200);
  })
);

//show all saved cards
router.get(
  "/cards/saved",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let foundUser = await User.findById(req.user._id)
      .populate("savedCards")
      .select("savedCards");
    let categories = await Category.find({});
    // Remove objects with orderNum below 0
    const filteredArray = categories.filter((obj) => obj.orderNum > -1);
    sortByOrderNum(filteredArray);
    res.render("cards/savedCards", {
      savedCards: foundUser.savedCards,
      categories: filteredArray,
    });
  })
);

//STATS - demo limit reached count
router.get(
  "/stats/demoLimitReached",
  catchAsync(async (req, res) => {
    incrementEventCount("demoLimitReached");
    res.sendStatus(200);
  })
);

//HELPERS
function isCardInArray(arrayOfIds, cardIdString) {
  let arrayOfStrings = arrayOfIds.map((item) => item.toString());
  let isIncluded = arrayOfStrings.includes(cardIdString);
  if (isIncluded) {
    return true;
  } else {
    return false;
  }
}

function sortByOrderNum(array) {
  // Use the Array.prototype.sort() method to sort the array
  array.sort((a, b) => a.orderNum - b.orderNum);
  // Return the sorted array
  return array;
}

module.exports = router;
