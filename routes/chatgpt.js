const express = require('express');
const Question = require('../models/question');
const Category = require('../models/category');
const Section = require('../models/section');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isEditor, isLoggedIn } = require('../utils/middleware');
const {OpenAI} = require('openai');

const openai = new OpenAI({apiKey: process.env.CHATGPT_SECRET});

//list all questions
router.get('/category/:categoryId/section/:sectionId/question/generate', isLoggedIn, isEditor, catchAsync(async(req, res) => {
    const {categoryId, sectionId} = req.params;
    const {user} = req;
    const foundSection = await Section.findById(sectionId).populate('cards');
    if(!foundSection){
        req.flash('error', 'Balíček nebyl nalezen');
        return res.redirect(`/category/${categoryId}/section/${sectionId}/list`);
    }

    // Array to store promises
    const promises = [];

    foundSection.cards.forEach(card => {
        // Push each asynchronous operation into the promises array
        promises.push(generateQuizQuestion(card, sectionId, categoryId, user));
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    //Increase numOfQuestions in category
    const foundCategory = await Category.findById(categoryId);

    foundCategory.numOfQuestions = foundCategory.numOfQuestions + foundSection.cards.length;
    await foundCategory.save();
    
    // When all asynchronous operations are completed
    res.status(200).redirect(`/category/${categoryId}/section/${sectionId}/list`);
}))

async function generateQuizQuestion(card, sectionId, categoryId, user) {
    const completion = await openai.chat.completions.create({
      messages: [
        { 
        role: "system", 
        content: 
        `Create a quiz question for bachelor university students in Czech language with three answers of which only one is correct based on the following text: 

        ${card.pageA}
        ${card.pageB}
        
        Return response in the following parseable JSON format: 
        
        {
            "Q":"question",
            "CA":"correct-answer",
            "WA1":"wrong-answer-1",
            "WA2":"wrong-answer-2"
        }
        
        ` 
    }],
      model: "gpt-4-turbo",
      temperature: 0.8
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
            sourceCard: card._id
        })
        
        const createdQuestion = await newQuestion.save();

        const foundSection = await Section.findById(sectionId);

        foundSection.questions.push(createdQuestion._id);
        await foundSection.save();
    } catch (error) {
        // Handle parsing error
        console.log("Error parsing JSON created by chatGPT", error);
    }
  }


module.exports = router;