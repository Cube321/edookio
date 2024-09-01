const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Section = require("../models/section");
const Category = require("../models/category");
const User = require("../models/user");
const Card = require("../models/card");
const Question = require("../models/question");
const {
  isLoggedIn,
  isAdmin,
  validateSection,
  isPremiumUser,
  isEditor,
} = require("../utils/middleware");
const mongoose = require("mongoose");

//SHOW SECTIONS OF CATEGORY
router.get(
  "/category/:category",
  isPremiumUser,
  catchAsync(async (req, res, next) => {
    const category = await Category.findOne({ name: req.params.category })
      .populate("sections")
      .exec();
    if (!category) {
      req.flash("error", "Kategorie neexistuje.");
      return res.status(404).redirect("/");
    }
    //asign name of category
    let title = "";
    let categories = await Category.find({});
    categories.forEach((c) => {
      if (c.name === req.params.category) {
        title = c.text;
      }
    });
    //add data to user's unfinishedSections
    if (req.user) {
      category.sections.forEach((section, index) => {
        let unfinishedSectionIndex = req.user.unfinishedSections.findIndex(
          (x) => x.sectionId.toString() == section._id.toString()
        );
        if (unfinishedSectionIndex > -1) {
          category.sections[index].isUnfinished = true;
          category.sections[index].lastSeenCard =
            req.user.unfinishedSections[unfinishedSectionIndex].lastCard;
        }
        //check if the section is in the sections array of the user - if so, mark it as finished
        let finishedSectionIndex = req.user.sections.findIndex((x) => {
          return x.toString() == section._id.toString();
        });
        if (finishedSectionIndex > -1) {
          category.sections[index].isFinished = true;
        }

        //check if the section is in the finishedQuestions array of the user - if so, mark it as finished
        let finishedQuestionsIndex = req.user.finishedQuestions.findIndex(
          (x) => {
            return x.toString() == section._id.toString();
          }
        );
        if (finishedQuestionsIndex > -1) {
          category.sections[index].isFinishedQuestions = true;
        }
      });
    }
    //render category page
    res.status(200).render("category", { category, title });
  })
);

//CATEGORY (create, edit, delete)
//create new Category - post ROUTE
router.post(
  "/category/new",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res, next) => {
    let { text, value, icon, orderNum } = req.body;
    const foundCategory = await Category.find({ name: value });
    if (foundCategory.length > 0) {
      req.flash("error", "Předmět již existuje.");
      return res.redirect("/admin/categories");
    }
    const newCategory = new Category({
      name: value,
      sections: [],
      text,
      icon,
      orderNum,
    });
    let savedCategory = await newCategory.save();
    console.log(savedCategory);
    req.flash("success", "Předmět byl vytvořen.");
    res.status(201).redirect(`/admin/categories`);
  })
);

//edit Category - update in the DB
router.put(
  "/category/edit/:categoryId",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { categoryId } = req.params;
    let { text, icon, orderNum } = req.body;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Kategorie nebyla nalezena.");
      return res.redirect("/admin/categories");
    }
    await Category.findByIdAndUpdate(categoryId, { text, icon, orderNum });
    req.flash("success", "Změny byly uloženy.");
    res.status(201).redirect(`/admin/categories`);
  })
);

//remove Category - delete from DB
router.delete(
  "/category/remove/:categoryId",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { categoryId } = req.params;
    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Kategorie nebyla nalezena.");
      return res.redirect("/admin/categories");
    }
    if (foundCategory.sections.length === 0) {
      await Category.findByIdAndDelete(categoryId);
      req.flash("success", "Předmět byl odstraněn.");
    } else {
      req.flash(
        "error",
        "Kategorie obsahuje balíčky. Nejdříve odstraň balíčky, poté bude možné kategorii smazat."
      );
    }
    res.status(200).redirect("/admin/categories");
  })
);

//SECTIONS IN CATEGORY
//create new Section in Category
router.post(
  "/category/:category/newSection",
  validateSection,
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    //check if category exists
    const foundCategory = await Category.findOne({ name: req.params.category });
    if (!foundCategory) {
      req.flash("error", "Kategorie neexistuje.");
      return res.status(404).redirect("back");
    }
    //create new Section and add it to Category
    const categoryName = foundCategory.name;
    let { name, isPremium, desc, previousSection, jsonData } = req.body;
    //isPremium logic
    let isPremiumBoolean = false;
    if (isPremium === "premium") {
      isPremiumBoolean = true;
    }
    //create new section
    const newSection = new Section({
      name,
      category: categoryName,
      cards: [],
      questions: [],
      isPremium: isPremiumBoolean,
      shortDescription: desc,
      nextSection: "lastSection",
      previousSection,
    });
    const savedSection = await newSection.save();
    if (previousSection !== "lastSection") {
      const foundPreviousSection = await Section.findById(previousSection);
      foundPreviousSection.nextSection = savedSection._id;
      await foundPreviousSection.save();
    }
    foundCategory.sections.push(savedSection._id);
    await foundCategory.save();

    //import cards and questions from JSON if JSON is provided
    if (jsonData) {
      let sectionData = JSON.parse(jsonData);
      //create cards
      for (let card of sectionData.cards) {
        let newCard = new Card({
          section: savedSection._id,
          pageA: card.pageA,
          pageB: card.pageB,
          category: categoryName,
          author: card.author,
          importedCardId: card._id,
        });
        let savedCard = await newCard.save();
        foundCategory.numOfCards++;
        savedSection.cards.push(savedCard._id);
      }
      //create questions
      for (let question of sectionData.questions) {
        let newQuestion = new Question({
          section: savedSection._id,
          category: foundCategory._id,
          question: question.question,
          correctAnswers: [...question.correctAnswers],
          wrongAnswers: [...question.wrongAnswers],
          sourceCardForImport: question.sourceCard,
          author: question.author,
        });

        //find card with importedCardId equal to sourceCardForImport and save that card ID to question as sourceCard
        let foundCard = await Card.findOne({
          importedCardId: question.sourceCard,
        });
        if (foundCard) {
          newQuestion.sourceCard = foundCard._id;
        }

        let savedQuestion = await newQuestion.save();
        foundCategory.numOfQuestions++;
        savedSection.questions.push(savedQuestion._id);
      }
      await foundCategory.save();
      await savedSection.save();
    }

    req.flash("success", `Balíček ${savedSection.name} byl vytvořen.`);
    res.status(200).redirect(`/category/${savedSection.category}`);
  })
);

//remove Section from Category and delete its Cards
router.delete(
  "/category/:category/removeSection/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res, next) => {
    const { category, sectionId } = req.params;
    //delete Section ID from Category
    const foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    //remove sections from category array
    let updatedCategory = await Category.findOneAndUpdate(
      { name: category },
      { $pull: { sections: sectionId } }
    );
    if (!updatedCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    //delete Cards in Section
    await Card.deleteMany({ section: sectionId });
    //delete Questions in Section
    await Question.deleteMany({ section: sectionId });
    //delete Section
    const deletedSection = await Section.findByIdAndDelete(sectionId);
    const foundCategory = await Category.findOne({ name: req.params.category });
    foundCategory.numOfCards =
      foundCategory.numOfCards - deletedSection.cards.length;
    foundCategory.numOfQuestions =
      foundCategory.numOfQuestions - deletedSection.questions.length;
    await foundCategory.save();
    //remove section from list of unfinished sections of all users
    let searchQuery = mongoose.Types.ObjectId(sectionId);
    let foundUsersUnfinished = await User.find({
      unfinishedSections: { $elemMatch: { sectionId: searchQuery.toString() } },
    });
    for (let user of foundUsersUnfinished) {
      let updatedSections = user.unfinishedSections.filter(
        (section) => section.sectionId !== searchQuery.toString()
      );
      user.unfinishedSections = updatedSections;
      await user.save();
    }
    //remove section from list of finished sections of all users
    let foundUsersFinished = await User.find({ sections: searchQuery });
    for (let user of foundUsersFinished) {
      let updatedSections = user.sections.filter(
        (section) => section.toString() !== searchQuery.toString()
      );
      user.sections = updatedSections;
      await user.save();
    }

    //remove connection with previous section
    if (
      deletedSection.previousSection &&
      deletedSection.previousSection !== "lastSection"
    ) {
      let previousSection = await Section.findById(
        deletedSection.previousSection
      );
      if (previousSection) {
        previousSection.nextSection = deletedSection.nextSection;
        await previousSection.save();
      }
    }
    //flash a redirect
    req.flash("success", "Balíček byl odstraněn.");
    res.status(200).redirect(`/category/${category}`);
  })
);

//edit section RENDER
router.get(
  "/category/:category/editSection/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    const foundCategory = await Category.findOne({
      name: req.params.category,
    }).populate("sections");
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (!foundCategory) {
      throw Error("Kategorie s tímto označením neexistuje");
    }
    let previousSection = "";
    if (
      foundSection.previousSection &&
      foundSection.previousSection !== "lastSection"
    ) {
      previousSection = await Section.findById(foundSection.previousSection);
      if (!previousSection) {
        throw Error("Předchozí balíček s uvedeným ID neexistuje");
      }
    }
    res.render("sections/edit", {
      section: foundSection,
      category: foundCategory,
      previousSection,
    });
  })
);

//edit section UPDATE
router.put(
  "/category/:category/editSection/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    let previousSection = "";
    if (req.body.previousSection !== "lastSection") {
      previousSection = await Section.findById(req.body.previousSection);
      if (!previousSection) {
        throw Error("Předchozí balíček s uvedeným ID neexistuje");
      }
    }
    let { name, desc } = req.body;
    foundSection.name = name;
    foundSection.shortDescription = desc;
    if (previousSection !== "") {
      foundSection.previousSection = previousSection._id;
      previousSection.nextSection = foundSection._id;
      await previousSection.save();
    } else {
      foundSection.previousSection = "lastSection";
    }
    await foundSection.save();
    req.flash("success", "Informace byly aktualizovány.");
    res
      .status(201)
      .redirect(
        `/category/${req.params.category}/editSection/${req.params.sectionId}`
      );
  })
);

//changing order of the sections
//UP
router.get(
  "/category/:category/sectionUp/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { sectionId, category } = req.params;
    const foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      throw Error("Kategorie s tímto ID neexistuje");
    }
    if (foundCategory.sections.includes(sectionId)) {
      let fromIndex = foundCategory.sections.indexOf(sectionId);
      if (fromIndex !== 0) {
        let toIndex = fromIndex--;
        let section = foundCategory.sections.splice(fromIndex, 1)[0];
        foundCategory.sections.splice(toIndex, 0, section);
        await foundCategory.save();
      }
    }
    res.status(200).redirect(`/category/${category}`);
  })
);
//DOWN
router.get(
  "/category/:category/sectionDown/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { sectionId, category } = req.params;
    const foundCategory = await Category.findOne({ name: category });
    if (!foundCategory) {
      throw Error("Kategorie s tímto názvem neexistuje");
    }
    if (foundCategory.sections.includes(sectionId)) {
      let fromIndex = foundCategory.sections.indexOf(sectionId);
      if (fromIndex < foundCategory.sections.length) {
        let toIndex = fromIndex++;
        let section = foundCategory.sections.splice(fromIndex, 1)[0];
        foundCategory.sections.splice(toIndex, 0, section);
        await foundCategory.save();
      }
    }
    res.status(200).redirect(`/category/${category}`);
  })
);

//changing status of the section from FREE to PREMIUM and back
router.get(
  "/category/:category/sectionStatus/:sectionId/:changeDirection",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    let { category, sectionId, changeDirection } = req.params;
    let foundSection = await Section.findById(sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    if (changeDirection === "toZdarma") {
      foundSection.isPremium = false;
    }
    if (changeDirection === "toPremium") {
      foundSection.isPremium = true;
    }
    await foundSection.save();
    res.status(200).redirect(`/category/${category}`);
  })
);

//publish section
router.get(
  "/category/:category/section/:sectionId/publish",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const foundSection = await Section.findById(req.params.sectionId);
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    foundSection.isPublic = true;
    if (foundSection.questions.length > 0) {
      foundSection.testIsPublic = true;
    }
    await foundSection.save();
    req.flash("success", "Balíček byl zveřejněn");
    res.status(200).redirect(`/category/${req.params.category}`);
  })
);

//generate section data in JSON format based on sectionId
router.get(
  "/category/:category/generateJSON/:sectionId",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const foundSection = await Section.findById(req.params.sectionId).populate(
      "cards questions"
    );
    if (!foundSection) {
      throw Error("Balíček s tímto ID neexistuje");
    }

    let sectionData = {
      cards: foundSection.cards,
      questions: foundSection.questions,
    };

    res.status(200).json(sectionData);
  })
);

//list all cards in section
router.get(
  "/category/:category/section/:sectionId/listAllCards",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const section = await Section.findById(req.params.sectionId).populate(
      "cards"
    );
    if (!section) {
      throw Error("Balíček s tímto ID neexistuje");
    }
    res.status(200).render("sections/listAllCards", { section });
  })
);

module.exports = router;
