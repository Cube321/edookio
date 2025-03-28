const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Card = require("../models/card");
const Question = require("../models/question");
const CardInfo = require("../models/cardInfo");
const Section = require("../models/section");
const User = require("../models/user");
const Category = require("../models/category");
const mail = require("../mail/mail");
const {
  validateCard,
  isLoggedIn,
  isCategoryAuthor,
} = require("../utils/middleware");
const { incrementEventCount } = require("../utils/helpers");

//CARDS (add, edit, remove)
//render new card page (GET)
router.get(
  "/category/:categoryId/section/:sectionId/newCard",
  isLoggedIn,
  isCategoryAuthor,
  catchAsync(async (req, res, next) => {
    const { categoryId, sectionId } = req.params;
    const { connectedQuestionId } = req.query;
    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Sekce s tímto ID neexistuje");
    }

    let connectedQuestion = null;

    if (connectedQuestionId) {
      connectedQuestion = await Question.findById(connectedQuestionId);
      if (!connectedQuestion) {
        throw Error("Otázka s tímto ID neexistuje");
      }
    }

    res.status(200).render("cards/new_editor", {
      categoryId,
      sectionId,
      sectionName: foundSection.name,
      connectedQuestion,
    });
  })
);

//add new card - save (POST)
router.post(
  "/category/:categoryId/section/:sectionId/newCard",
  validateCard,
  isLoggedIn,
  isCategoryAuthor,
  catchAsync(async (req, res, next) => {
    let { pageA, pageB } = req.body;
    const author = req.user._id;
    const { api } = req.query;
    const { categoryId, sectionId } = req.params;
    const { connectedQuestionId } = req.query;

    //replace all instances of <p><br></p> with nothing (remove empty paragraphs)
    pageA = pageA.replace(/<p><br><\/p>/g, "");
    pageB = pageB.replace(/<p><br><\/p>/g, "");

    pageA = cleanHtmlTags(pageA);
    pageB = cleanHtmlTags(pageB);

    const foundSection = await Section.findById(sectionId);
    const foundCategory = await Category.findById(categoryId);
    if (!foundSection) {
      throw Error("Sekce s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }

    const newCard = new Card({
      categoryId,
      section: sectionId,
      categoryId: foundCategory._id,
      pageA,
      pageB,
      author,
    });
    const createdCard = await newCard.save();

    //check if connectedQuestionId is valid objectID
    if (connectedQuestionId) {
      if (mongoose.Types.ObjectId.isValid(connectedQuestionId)) {
        const foundQuestion = await Question.findById(connectedQuestionId);
        if (foundQuestion) {
          foundQuestion.sourceCard = createdCard._id;
          newCard.connectedQuestionId = foundQuestion._id;
          await foundQuestion.save();
        }
      }
    }

    foundCategory.numOfCards++;
    await foundCategory.save();
    foundSection.cards.push(createdCard._id);
    await foundSection.save();

    //if the card is created via API, send the card ID back
    if (api) {
      return res.status(201).json({ cardId: createdCard._id });
    }

    req.flash("successOverlay", "Kartička byla přidána do databáze.");
    res
      .status(201)
      .redirect(`/category/${categoryId}/section/${sectionId}/newCard`);
  })
);

//edit card - form (GET)
router.get(
  "/cards/edit/:id",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const card = await Card.findById(id);
    if (!card) {
      req.flash("error", "Kartička nebyla nalezena.");
      return res.redirect("/");
    }
    //check if card author is the same as the logged in user (based on _id)
    if (!card.author.equals(req.user._id)) {
      req.flash("error", "Tuto kartičku může upravit jen její autor.");
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
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let { pageA, pageB } = req.body;

    //replace all instances of <p><br></p> with nothing (remove empty paragraphs)
    pageA = pageA.replace(/<p><br><\/p>/g, "");
    pageB = pageB.replace(/<p><br><\/p>/g, "");

    pageA = cleanHtmlTags(pageA);
    pageB = cleanHtmlTags(pageB);

    let author = req.user._id;
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
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCard = await Card.findById(id);
    if (!foundCard) {
      throw Error("Kartička s tímto ID neexistuje");
    }

    //check if card author is the same as the logged in user (based on _id)
    if (!foundCard.author.equals(req.user._id)) {
      req.flash("error", "Kartičku může odstranit jen její autor.");
      return res.redirect("/");
    }

    await Section.findByIdAndUpdate(foundCard.section, {
      $pull: { cards: id },
    });
    await Card.findByIdAndDelete(id);
    const foundCategory = await Category.findById(foundCard.categoryId);
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

    //delete cardInfo from all users
    await CardInfo.deleteMany({ card: id });

    //removed card from cards saved by users
    await User.updateMany({}, { $pull: { savedCards: id } });

    req.flash("successOverlay", "Kartička byla odstraněna.");
    res.status(201).redirect(`/review/${foundCard.section}/showAll`);
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
    let categories = await Category.find({ author: req.user._id });
    res.render("cards/savedCards", {
      savedCards: foundUser.savedCards,
      categories: categories,
    });
  })
);

//reset cards of user in section
router.get(
  "/category/:categoryId/section/:sectionId/resetCards",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    //validate with mongoose ObjectID
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      req.flash("error", "Neplatné ID balíčku.");
      return res.redirect(`/category/${categoryId}`);
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      req.flash("error", "Balíček s tímto ID neexistuje.");
      return res.redirect(`/category/${categoryId}`);
    }

    const cardIds = section.cards.map((card) => card._id);

    await CardInfo.deleteMany({
      user: req.user._id,
      card: { $in: cardIds },
    });

    res.redirect(
      `/category/${categoryId}/section/${sectionId}/card30/1?mode=unknown`
    );
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

//function to take a text with html tags and remove everything between < and > including the brackets except for <p> </p> <b> </b> <i> </i> <br> <br/> <strong> </strong> <em> </em> <li> </li> <ul> </ul>
function cleanHtmlTags(text) {
  const result = text.replace(
    /<(?!\/?(?:p|b|i|br|strong|em|li|ul)\b)[^>]*>/gi,
    ""
  );
  return result;
}

module.exports = router;
