const flashcardQueue = require("./jobs/flashcardQueue");
const Category = require("./models/category");
const Section = require("./models/section");
const Card = require("./models/card");
const User = require("./models/user");
const Question = require("./models/question");
const JobEvent = require("./models/jobEvent");
const { OpenAI } = require("openai");
const { splitTextIntoChunks } = require("./utils/document");
const mongoose = require("mongoose");
const helpers = require("./utils/helpers");

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || "development",
  tracesSampleRate: 1.0,
});

//connect to db
const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

mongoose.set("strictQuery", false);

// Connect to MongoDB
mongoose
  .connect(dbUrl, { dbName })
  .then(() => {
    console.log("Worker connected to MongoDB!");
  })
  .catch((err) => {
    console.error("Worker error connecting to MongoDB", err);
    process.exit(1);
  });

const openai = new OpenAI({ apiKey: process.env.CHATGPT_SECRET });

async function processDocumentJob(job) {
  try {
    let {
      extractedText,
      name,
      categoryId,
      user,
      sectionSize,
      cardsPerPage,
      jobEventId,
      requestedCards,
    } = job.data;

    await job.progress(1);
    let jobEvent = await JobEvent.findById(jobEventId);

    if (!extractedText && requestedCards) {
      console.log(
        "No extracted text provided. Getting text from OpenAI based on topic..."
      );
      await job.progress(8);
      extractedText = await getTextForTopic(name, requestedCards, jobEvent);
    }

    if (!extractedText) {
      throw new Error("No text provided or generated.");
    }

    console.log("Job data received. Text length:", extractedText.length);

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) throw new Error("Category not found.");

    let foundUser;
    let demoUser;
    let userId;

    if (!user) {
      demoUser = await User.findOne({ email: "demo@edookio.com" });
      userId = demoUser._id;
    } else {
      foundUser = await User.findById(user._id);
      if (!foundUser) throw new Error("User not found.");
      userId = foundUser._id;
    }

    console.log("Splitting text into chunks...");
    const maxTokensPerRequest = Math.floor(3000 / (cardsPerPage * 3));
    const textChunks = splitTextIntoChunks(extractedText, maxTokensPerRequest);
    console.log("Text split into", textChunks.length, "chunks.");

    await job.progress(10);

    const totalChunks = textChunks.length;
    let completedChunks = 0;

    // Create an array of promises
    const chunkPromises = textChunks.map((chunk, index) => {
      console.log("Sending text chunk to OpenAI for processing...", index);
      return openai.chat.completions
        .create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `Below is a text. You must create flashcards in Czech language from it. 
            
                    Use only the following HTML tags to format the answers:
      
                    <p> for paragraphs
                    <ul> for unordered lists
                    <li> for list items inside the <ul> tag
                    <strong> for bold text
                    <i> for italic text
      
                    Each answer has to be wrapped in one or more <p> tags. Use more if the answer contains multiple paragraphs. Always use the <b> tag to highlight the most important parts of the answer.
                    Formulate the questions clearly and concisely. The answers should be brief and to the point.
                    
                    You must produce at least 2 flashcards otherwise the job will be rejected.
      
                    Avoid creating questions that are too easy or too difficult. They should be on a level of a university student.
                    Also avoid creating questions that are too similar to each other.
      
                    Also, create a test question for each flashcard. The test question should be in the form of a multiple-choice question 
                    with three answers, only one correct. The correct answer should be very brief. The incorrect answers should be plausible but incorrect.
      
                    ${chunk}
                    
                    Return a parseable JSON array of objects:
                    [
                      {"flashcardQuestion": "Question1", "flashcardAnswer": "Answer1", "testQuestion": "TestQuestion1", "correctAnswer": "CorrectAnswer1", "wrongAnswerOne": "WrongAnswer", "wrongAnswerTwo": "WrongAnswer"},
                      {"flashcardQuestion": "Question2", "flashcardAnswer": "Answer2", "testQuestion": "TestQuestion2", "correctAnswer": "CorrectAnswer2", "wrongAnswerOne": "WrongAnswer", "wrongAnswerTwo": "WrongAnswer"}
                    ]
                    `,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        })
        .then((completion) => {
          const usage = completion.usage;
          const content = completion.choices[0].message.content;
          console.log("Received response from OpenAI for chunk", index);
          const cleanedContent = content.replace(/```json|```/g, "").trim();
          let flashcards;
          try {
            flashcards = JSON.parse(cleanedContent);
          } catch (err) {
            // If parsing fails, we throw an error
            throw new Error(
              `Error parsing JSON for chunk ${index}: ${err.message}`
            );
          }

          completedChunks++;
          const progressValue =
            10 + Math.floor((completedChunks / totalChunks) * 70);
          job.progress(progressValue);

          return { index, flashcards, usage };
        });
    });

    // Use Promise.allSettled() to handle partial failures
    const results = await Promise.allSettled(chunkPromises);

    // Filter successful results
    const successfulResults = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value); // 'value' contains { index, flashcards }

    // Sort by index to maintain order
    successfulResults.sort((a, b) => a.index - b.index);

    // Accumulate total usage
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalTokens = 0;

    for (const result of successfulResults) {
      totalPromptTokens += result.usage.prompt_tokens;
      totalCompletionTokens += result.usage.completion_tokens;
      totalTokens += result.usage.total_tokens;
    }

    console.log("Total tokens used:", totalTokens);

    // Calculate the pricing based on the provided rates
    const costPerPromptToken = 2.5 / 1000000; // $2.50 per 1,000,000 input tokens
    const costPerCompletionToken = 10 / 1000000; // $10 per 1,000,000 output tokens

    const priceForPrompt = totalPromptTokens * costPerPromptToken;
    const priceForCompletion = totalCompletionTokens * costPerCompletionToken;
    const totalPrice = priceForPrompt + priceForCompletion;

    console.log("Price for prompt tokens:", priceForPrompt.toFixed(6));
    console.log("Price for completion tokens:", priceForCompletion.toFixed(6));
    console.log("Total price:", totalPrice.toFixed(6));

    // Concatenate all flashcards from successful chunks
    let allFlashcards = [];
    for (const result of successfulResults) {
      allFlashcards = allFlashcards.concat(result.flashcards);
    }

    // Now you have partial results even if some chunks failed
    if (allFlashcards.length === 0) {
      throw new Error("No flashcards generated from any chunk.");
    }

    await job.progress(95);

    console.log("Saving flashcards and questions to database...");
    let sectionIndex = 0;
    let section = null;

    let cardsCreated = 0;
    let questionsCreated = 0;

    for (let i = 0; i < allFlashcards.length; i++) {
      if (i % sectionSize === 0) {
        sectionIndex++;
        section = new Section({
          name: `${name} ${sectionIndex}`,
          categoryId: categoryId,
          author: userId,
          cards: [],
          creationMethod: "ai",
        });
        await section.save();
        foundCategory.sections.push(section._id);
        await foundCategory.save();
      }

      const cardData = allFlashcards[i];
      const card = new Card({
        categoryId: categoryId,
        pageA: cardData.flashcardQuestion,
        pageB: cardData.flashcardAnswer,
        author: userId,
        section: section._id,
      });
      await card.save();
      cardsCreated++;
      foundCategory.numOfCards++;

      const question = new Question({
        category: categoryId,
        categoryId: categoryId,
        section: section._id,
        author: userId,
        question: cardData.testQuestion,
        correctAnswers: [cardData.correctAnswer],
        wrongAnswers: [cardData.wrongAnswerOne, cardData.wrongAnswerTwo],
        sourceCard: card?._id,
      });
      await question.save();

      if (card) {
        card.connectedQuestionId = question?._id;
        await card.save();
      }

      questionsCreated++;
      foundCategory.numOfQuestions++;

      section.cards.push(card._id);
      section.questions.push(question._id);
      await section.save();
    }

    await foundCategory.save();

    if (foundUser) {
      // Update user's counters outside the loop
      foundUser.generatedCardsCounterMonth += cardsCreated;
      foundUser.generatedQuestionsCounterMonth += questionsCreated;
      foundUser.generatedCardsCounterTotal += cardsCreated;
      foundUser.generatedQuestionsCounterTotal += questionsCreated;
      foundUser.usedCreditsMonth += cardsCreated;
      foundUser.usedCreditsTotal += cardsCreated;
      foundUser.lastJobCredits = cardsCreated;

      let creditsUsed = cardsCreated;
      let creditsToReduce = creditsUsed;

      if (foundUser.extraCredits > 0 && foundUser.extraCredits >= creditsUsed) {
        foundUser.extraCredits -= creditsUsed;
        creditsToReduce = 0;
      } else if (
        foundUser.extraCredits > 0 &&
        foundUser.extraCredits < creditsUsed
      ) {
        creditsToReduce = creditsUsed - foundUser.extraCredits;
        foundUser.extraCredits = 0;
      }

      if (foundUser.credits < creditsToReduce) {
        foundUser.credits = 0;
      } else {
        foundUser.credits -= creditsToReduce;
      }

      try {
        await foundUser.save();
        console.log("User saved successfully.");
      } catch (err) {
        console.error("Error saving user:", err);
        throw err; //
      }
    }

    if (jobEvent) {
      jobEvent.cardsCreated = cardsCreated;
      jobEvent.questionsCreated = questionsCreated;
      jobEvent.actualCredits = cardsCreated;
      jobEvent.finishedSuccessfully = true;

      // Save token usage details
      jobEvent.totalTokens = totalTokens;
      jobEvent.totalPromptTokens = totalPromptTokens;
      jobEvent.totalCompletionTokens = totalCompletionTokens;
      jobEvent.totalPriceUSD = totalPrice.toFixed(6);
      jobEvent.totalPriceCZK = (totalPrice * 22).toFixed(3);

      await jobEvent.save();
      console.log("Job event finished successfully");
    }

    await job.progress(100);

    console.log("Flashcards generated.");
    return "Flashcards generated successfully!";
  } catch (error) {
    console.error("Error processing document job:", error);
    Sentry.captureException(error);
    if (jobEvent) {
      jobEvent.finishedSuccessfully = false;
      jobEvent.errorMessage = "Selhalo zpracování - worker";
      await jobEvent.save();
    }
    helpers.incrementEventCount("workerGenerationError");
    throw error;
  }
}

flashcardQueue.process(async (job) => {
  console.log("Processing document job...");
  return await processDocumentJob(job);
});

//helper function to get text from OpenAi on a given topic where the length of the text is 225 times entered value
async function getTextForTopic(topic, textLength, jobEvent) {
  try {
    console.log("Getting text for topic:", topic);
    console.log("Requested text length:", textLength * 163);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `I would like to learn more about this topic: ${topic}. Create a text in the Czech language that has approximately ${
            textLength * 163
          } characters. The audience is university students. The text should be informative and engaging. If the topic does not make sense, tell me and include code "invalid_topic" in the response.`,
        },
      ],
      temperature: 0.7,
      max_tokens: textLength * 163,
    });

    const content = completion.choices[0].message.content;
    const usage = completion.usage;

    console.log("Generated text length:", content.length);

    //count textGenerationTokenPriceCZK and save it to jobEvent, different price for prompt and completion tokens
    const costPerPromptToken = 2.5 / 1000000; // $2.50 per 1,000,000 input tokens
    const costPerCompletionToken = 10 / 1000000; // $10 per 1,000,000 output tokens

    const priceForPrompt = usage.prompt_tokens * costPerPromptToken;
    const priceForCompletion = usage.completion_tokens * costPerCompletionToken;

    const totalPrice = priceForPrompt + priceForCompletion;

    if (jobEvent) {
      jobEvent.textGenerationTokenPriceCZK = (totalPrice * 22).toFixed(3);
      await jobEvent.save();
    }

    if (content.includes("invalid_topic")) {
      throw new Error("K tomuto tématu nelze vygenerovat žadný obsah");
    }

    console.log("Received response from OpenAI for topic:", topic);
    console.log(content);
    return content;
  } catch (error) {
    console.error("Error getting text for topic:", error);
    Sentry.captureException(error);
    if (jobEvent) {
      jobEvent.finishedSuccessfully = false;
      jobEvent.errorMessage = "Selhalo zpracování - worker topic";
      await jobEvent.save();
    }
    throw error;
  }
}
