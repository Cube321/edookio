const express = require("express");
const Question = require("../models/question");
const Category = require("../models/category");
const Section = require("../models/section");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isEditor, isLoggedIn } = require("../utils/middleware");
const { OpenAI } = require("openai");
const question = require("../models/question");

const openai = new OpenAI({ apiKey: process.env.CHATGPT_SECRET });

//generate test questions via OpenAI
router.get(
  "/category/:categoryId/section/:sectionId/question/generate",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const { user } = req;
    const foundSection = await Section.findById(sectionId).populate("cards");
    if (!foundSection) {
      req.flash("error", "Balíček nebyl nalezen");
      return res.redirect(`/category/${categoryId}/section/${sectionId}/list`);
    }

    // Array to store promises
    const promises = [];

    foundSection.cards.forEach((card) => {
      // Push each asynchronous operation into the promises array
      promises.push(generateQuizQuestion(card, sectionId, categoryId, user));
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    //Increase numOfQuestions in category
    const foundCategory = await Category.findById(categoryId);

    foundCategory.numOfQuestions =
      foundCategory.numOfQuestions + foundSection.cards.length;
    await foundCategory.save();

    // When all asynchronous operations are completed
    res
      .status(200)
      .redirect(`/category/${categoryId}/section/${sectionId}/list`);
  })
);

//generate test questions via OpenAI EN
router.get(
  "/category/:categoryId/section/:sectionId/question/generateEN",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { categoryId, sectionId } = req.params;
    const { user } = req;
    const foundSection = await Section.findById(sectionId).populate("cards");
    if (!foundSection) {
      req.flash("error", "Balíček nebyl nalezen");
      return res.redirect(`/category/${categoryId}/section/${sectionId}/list`);
    }

    // Array to store promises
    const promises = [];

    foundSection.cards.forEach((card) => {
      // Push each asynchronous operation into the promises array
      promises.push(generateEnQuizQuestion(card, sectionId, categoryId, user));
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    //Increase numOfQuestions in category
    const foundCategory = await Category.findById(categoryId);

    foundCategory.numOfQuestions =
      foundCategory.numOfQuestions + foundSection.cards.length;
    await foundCategory.save();

    // When all asynchronous operations are completed
    res
      .status(200)
      .redirect(`/category/${categoryId}/section/${sectionId}/list`);
  })
);

async function generateQuizQuestion(card, sectionId, categoryId, user) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Create a quiz question for bachelor university students in Czech language with three answers of which only one is correct based on the following text: 

        ${card.pageA}
        ${card.pageB}
        
        Return response in the following parseable JSON format: 
        
        {
            "Q":"question",
            "CA":"correct-answer",
            "WA1":"wrong-answer-1",
            "WA2":"wrong-answer-2"
        }
        
        `,
      },
    ],
    model: "gpt-4o",
    temperature: 0.8,
  });

  try {
    const parsedResponse = JSON.parse(completion.choices[0].message.content);
    let newQuestion = new Question({
      category: categoryId,
      section: sectionId,
      author: user.email,
      question: parsedResponse.Q,
      correctAnswers: [parsedResponse.CA],
      wrongAnswers: [parsedResponse.WA1, parsedResponse.WA2],
      sourceCard: card._id,
    });

    const createdQuestion = await newQuestion.save();

    const foundSection = await Section.findById(sectionId);

    foundSection.questions.push(createdQuestion._id);
    await foundSection.save();
  } catch (error) {
    // Handle parsing error
    console.log("Error parsing JSON created by chatGPT", error);
  }
}

async function generateEnQuizQuestion(card, sectionId, categoryId, user) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Below you can see a flashcard where on one side there is an english legal term and a sentence with example usage. On the other side there is the Czech translation. Create a quiz question with three answers of which only one is correct where the question is the Czech word and the answers are the English words. For the wrong answers use english legal terms from the same area of law as the word on the flashcard and also from the same category of words (e.g. if the word is a type of contract, use other types of contracts as wrong answers).: 

        ${card.pageA}
        ${card.pageB}
        
        Return response in the following parseable JSON format: 
        
        {
            "Q":"question",
            "CA":"correct-answer",
            "WA1":"wrong-answer-1",
            "WA2":"wrong-answer-2"
        }
        
        `,
      },
    ],
    model: "gpt-4o",
    temperature: 0.8,
  });

  try {
    const parsedResponse = JSON.parse(completion.choices[0].message.content);
    let newQuestion = new Question({
      category: categoryId,
      section: sectionId,
      author: user.email,
      question: parsedResponse.Q,
      correctAnswers: [parsedResponse.CA],
      wrongAnswers: [parsedResponse.WA1, parsedResponse.WA2],
      sourceCard: card._id,
    });

    const createdQuestion = await newQuestion.save();

    const foundSection = await Section.findById(sectionId);

    foundSection.questions.push(createdQuestion._id);
    await foundSection.save();
  } catch (error) {
    // Handle parsing error
    console.log("Error parsing JSON created by chatGPT", error);
  }
}

//connect existing questions with cards in section using OpenAI
router.get(
  "/:sectionId/questions/connect",
  isLoggedIn,
  isEditor,
  catchAsync(async (req, res) => {
    const { sectionId } = req.params;

    // 1. Load the section with all cards and questions
    const foundSection = await Section.findById(sectionId).populate(
      "cards questions"
    );

    if (!foundSection) {
      req.flash("error", "Balíček nebyl nalezen");
      return res.redirect(`/category/${categoryId}/section/${sectionId}/list`);
    }

    const { cards, questions } = foundSection;

    // 2. Filter out questions that already have a sourceCard
    const questionsToConnect = questions.filter((q) => !q.sourceCard);

    // If there are no questions to connect, just redirect
    if (!questionsToConnect.length) {
      req.flash("info", "Žádné otázky k propojení.");
      return res.redirect(
        `/category/${foundSection.category}/section/${sectionId}/list`
      );
    }

    // 3. Create a single prompt that includes all relevant data
    //    Adjust the details and format to your liking.
    const systemPrompt = `
      You have an array of 'cards' in Czech, each with an ID, front text, and back text.
      Then you have an array of 'questions' (in Czech) that may relate to some of these cards.
      
      Your task:
      For EACH question, decide which card it most likely belongs to. 
      If none of the cards match, return "none".

      Return a JSON array of objects (with no extra text around it) with the following structure:
      [
        {
          "questionId": "some-question-id",
          "matchedCardId": "some-card-id or none"
        },
        ...
      ]

      Example output:
      [
        {
          "questionId": "64aa9b3e...",
          "matchedCardId": "64bb2c45..."
        },
        {
          "questionId": "64aa9b3f...",
          "matchedCardId": "none"
        }
      ]

      Here are your cards (array of objects):
      ${JSON.stringify(
        cards.map((card) => ({
          cardId: card._id,
          front: (card.pageA || "").replace(/\n/g, " "),
          back: (card.pageB || "").replace(/\n/g, " "),
        }))
      )}

      Here are the questions (array of objects):
      ${JSON.stringify(
        questionsToConnect.map((q) => ({
          questionId: q._id,
          question: q.question,
        }))
      )}
    `;

    try {
      // 4. Make a single request to OpenAI
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
        ],
        model: "gpt-4o", // or gpt-4 / gpt-3.5-turbo, whichever is available
        temperature: 0.3,
      });

      const cleanedContent = completion.choices[0].message.content
        .replace(/```json|```/g, "")
        .trim();

      // 5. Parse the JSON array from GPT
      let parsedResponse = [];
      try {
        parsedResponse = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error("Error parsing JSON from GPT:", parseError);
        req.flash(
          "error",
          "Nepodařilo se propojit otázky (chyba JSON od OpenAI)."
        );
        return res.redirect(
          `/category/${foundSection.category}/section/${sectionId}/list`
        );
      }

      // 6. Build an updatePromises array to store all question updates
      const updatePromises = [];
      for (const result of parsedResponse) {
        const { questionId, matchedCardId } = result;
        if (!questionId || !matchedCardId) continue; // skip if data is malformed

        // Find the question in memory (already fetched, so a simple find would do)
        const matchedQuestion = questionsToConnect.find(
          (q) => q._id.toString() === questionId
        );
        if (!matchedQuestion) continue; // skip if we can't find it

        // If GPT says "none", skip connecting
        if (matchedCardId === "none") continue;

        // Otherwise, update the question's sourceCard
        matchedQuestion.sourceCard = matchedCardId;

        // Save the question
        updatePromises.push(matchedQuestion.save());
      }

      // 7. Perform all updates concurrently
      await Promise.all(updatePromises);

      req.flash(
        "success",
        "Otázky byly propojeny s kartičkami (tam, kde to bylo možné)."
      );
      return res.redirect(
        `/category/${foundSection.category}/section/${sectionId}/list`
      );
    } catch (error) {
      console.error("Error while connecting questions to cards:", error);
      req.flash("error", "Nepodařilo se propojit otázky s kartičkami.");
      return res.redirect(
        `/category/${foundSection.category}/section/${sectionId}/list`
      );
    }
  })
);

module.exports = router;
