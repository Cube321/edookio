const Category = require("../models/category");
const Section = require("../models/section");
const Card = require("../models/card");
const Question = require("../models/question");
const uuid = require("uuid");

const seedContent = async function (userId) {
  try {
    // 1) CREATE A NEW CATEGORY
    let shareId = uuid.v4().slice(0, 6);
    let categoryWithShareId = await Category.findOne({ share: shareId });
    while (categoryWithShareId) {
      shareId = uuid.v4().slice(0, 6);
      categoryWithShareId = await Category.findOne({ share: shareId });
    }

    const createdCategory = await Category.create({
      text: "Tvůj první předmět",
      icon: "subject_9.png",
      author: userId,
      shareId: shareId,
      sections: [],
    });

    // 2) CREATE ONE SECTION
    const newSection = await Section.create({
      name: "Ukázkový balíček",
      categoryId: createdCategory._id,
      author: userId,
      cards: [],
      questions: [],
    });

    // Link the section to the category
    createdCategory.sections.push(newSection._id);
    await createdCategory.save();

    // 3) PREPARE FIVE OBJECTS IN THE DUMMY CONTENT ARRAY ABOUT THE CZECH REPUBLIC
    const dummyContent = [
      {
        pageA: "Jaké je hlavní město České republiky?",
        pageB: "<b>Praha</b> je hlavní a největší město České republiky.",
        question: "Které město je hlavním městem ČR?",
        correctAnswer: "Praha",
        wrongAnswer1: "Brno",
        wrongAnswer2: "Ostrava",
      },
      {
        pageA: "Kdy vznikla samostatná Česká republika?",
        pageB:
          "Samostatná Česká republika vznikla <b>1. ledna 1993</b> po rozdělení Československa.",
        question: "Které datum označuje vznik samostatné ČR?",
        correctAnswer: "1. ledna 1993",
        wrongAnswer1: "28. října 1918",
        wrongAnswer2: "1. května 2004",
      },
      {
        pageA: "Jak se jmenuje nejvyšší hora České republiky?",
        pageB: "Nejvyšší hora ČR je <b>Sněžka</b> s nadmořskou výškou 1603 m.",
        question: "Jak se jmenuje nejvyšší hora ČR?",
        correctAnswer: "Sněžka",
        wrongAnswer1: "Praděd",
        wrongAnswer2: "Říp",
      },
      {
        pageA: "Jaký je oficiální jazyk v České republice?",
        pageB: "Úředním jazykem je <b>čeština</b>.",
        question: "Který jazyk je oficiálním jazykem ČR?",
        correctAnswer: "Čeština",
        wrongAnswer1: "Slovenština",
        wrongAnswer2: "Němčina",
      },
      {
        pageA: "Kolik sousedních států má Česká republika?",
        pageB:
          "ČR má <b>čtyři</b> sousední státy: Německo, Polsko, Slovensko a Rakousko.",
        question: "Kolik států sousedí s Českou republikou?",
        correctAnswer: "4",
        wrongAnswer1: "3",
        wrongAnswer2: "5",
      },
    ];

    // 4) INSERT CARDS AND QUESTIONS
    for (const contentItem of dummyContent) {
      // Create Card
      const newCard = await Card.create({
        categoryId: createdCategory._id,
        pageA: contentItem.pageA,
        pageB: contentItem.pageB,
        author: userId,
        section: newSection._id,
        connectedQuestionId: null,
      });

      // Create Question
      const newQuestion = await Question.create({
        category: createdCategory._id,
        categoryId: createdCategory._id,
        section: newSection._id,
        author: userId,
        question: contentItem.question,
        correctAnswers: [contentItem.correctAnswer],
        wrongAnswers: [contentItem.wrongAnswer1, contentItem.wrongAnswer2],
        sourceCard: newCard._id,
      });

      // Update Card to link the newly created Question
      newCard.connectedQuestionId = newQuestion._id;
      await newCard.save();

      // Push references to the Section
      newSection.cards.push(newCard._id);
      newSection.questions.push(newQuestion._id);
    }

    // Save the updated section
    await newSection.save();

    createdCategory.numOfCards = dummyContent.length;
    createdCategory.numOfQuestions = dummyContent.length;
    await createdCategory.save();

    console.log("Seeding completed.");

    return createdCategory._id;
  } catch (err) {
    console.error("Error seeding content:", err);
  }
};

module.exports = seedContent;
