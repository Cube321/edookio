// routes/flashcards.js (similar to your original code)
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { isLoggedIn, isCategoryAuthor } = require("../utils/middleware");
const Category = require("../models/category");
const JobEvent = require("../models/jobEvent");
const flashcardQueue = require("../jobs/flashcardQueue");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const textract = require("textract");
const helpers = require("../utils/helpers");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/category/:categoryId/newSectionFromDocument",
  isLoggedIn,
  isCategoryAuthor,
  upload.single("document"),
  catchAsync(async (req, res) => {
    const { name } = req.body;
    const { file } = req;
    const { categoryId } = req.params;
    const { user } = req;

    //create JobEvent
    let createdJobEvent = await JobEvent.create({
      user: user._id,
      source: "web",
      name,
      jobType: "document",
    });

    const sectionSize = parseInt(req.body.sectionSize) || 10;
    console.log("Section size:", sectionSize);

    const cardsPerPage = parseInt(req.body.cardsPerPage) || 3;
    console.log("Cards per page:", cardsPerPage);

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      return res.json({
        error: "Předmět nebyl nalezen.",
        errorHeadline: "Předmět nebyl nalezen v databázi.",
      });
    }

    if (!file) {
      return res.json({
        error: "Nahrajte soubor ve formátu PDF, DOCX nebo PPTX.",
        errorHeadline: "Nebyl nahrán žádný soubor",
      });
    }

    createdJobEvent.categoryId = categoryId;
    createdJobEvent.sectionSize = sectionSize;
    createdJobEvent.cardsPerPage = cardsPerPage;

    let extractedText = "";
    try {
      // Extract text directly in the route
      const dataBuffer = fs.readFileSync(file.path);
      console.log(
        "File read successfully:",
        file.path,
        "Size:",
        dataBuffer.length,
        "bytes"
      );

      if (file.mimetype === "application/pdf") {
        console.log("Extracting text from PDF...");
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
        console.log("PDF text extracted. Length:", extractedText.length);
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        console.log("Extracting text from DOCX...");
        const docxData = await mammoth.extractRawText({ buffer: dataBuffer });
        extractedText = docxData.value;
        console.log("DOCX text extracted. Length:", extractedText.length);
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        console.log("Extracting text from PPTX...");
        extractedText = await new Promise((resolve, reject) => {
          textract.fromBufferWithMime(
            file.mimetype,
            dataBuffer,
            (err, text) => {
              if (err) {
                console.error("Error extracting text from PPTX:", err);
                reject(err);
              } else {
                console.log("PPTX text extracted. Length:", text?.length || 0);
                resolve(text);
              }
            }
          );
        });
      } else {
        console.error("Unsupported file type:", file.mimetype);
        await jobFailed(createdJobEvent, "Nepodporovaný typ souboru");
        return res.json({
          error: "Nahrajte soubor ve formátu PDF, DOCX nebo PPTX.",
          errorHeadline: "Nepodporovaný typ souboru",
        });
      }
    } catch (err) {
      console.error("Error extracting text:", err);
      helpers.incrementEventCount("errorExtractingText");
      await jobFailed(
        createdJobEvent,
        "Nepodařilo se extrahovat text z dokumentu"
      );
      res.json({
        error:
          "Nepodařilo se extrahovat text z dokumentu. Nahrajte prosím dokument ve vyšší kvalitě nebo to zkuste znovu.",
        errorHeadline: "Chyba při extrakci textu",
      });
    } finally {
      console.log("Cleaning up uploaded file:", file.path);
      fs.unlinkSync(file.path);
      console.log("File removed successfully.");
    }

    let pagesLimit = 150;

    if (!user.isPremium) {
      pagesLimit = 25;
    }

    let charactersLimit = 1800 * pagesLimit;

    if (extractedText.length < 10) {
      console.error("Error extracting text (text below 10 characters)");
      helpers.incrementEventCount("errorExtractingTextBelow10Chars");
      await jobFailed(
        createdJobEvent,
        "Nepodařilo se extrahovat text z dokumentu (méně než 10 znaků)"
      );
      return res.json({
        error:
          "Nepodařilo se extrahovat text z dokumentu. Nahrajte prosím dokument ve vyšší kvalitě nebo to zkuste znovu.",
        errorHeadline: "Chyba při extrakci textu",
      });
    }

    if (extractedText.length > charactersLimit) {
      await jobFailed(
        createdJobEvent,
        `Překročena maximální délka textu ${formatNumber(
          charactersLimit
        )} znaků (${pagesLimit} stran)`
      );
      return res.json({
        error: `Maximální délka textu je ${formatNumber(
          charactersLimit
        )} znaků (${pagesLimit} stran). Tvůj text má ${formatNumber(
          extractedText.length
        )} znaků.`,
        errorHeadline: "Text je příliš dlouhý",
        showPremiumButton: !user.isPremium,
      });
    }

    let expectedCredits =
      Math.floor(extractedText.length / 1800) * cardsPerPage;

    createdJobEvent.extractedTextLength = extractedText.length;
    createdJobEvent.extractedTextPages = Math.floor(
      extractedText.length / 1800
    );
    createdJobEvent.expectedCredits = expectedCredits;

    console.log("Expected credits:", expectedCredits);
    if (!user.admin && expectedCredits > user.credits + user.extraCredits) {
      await jobFailed(createdJobEvent, "Nedostatek kreditů");
      return res.json({
        creditsRequired: expectedCredits,
        creditsLeft: user.credits,
        jobId: null,
      });
    }

    // Now, enqueue the job with the extracted text instead of a file path
    const job = await flashcardQueue.add({
      extractedText, // pass the extracted text directly
      name,
      categoryId,
      user,
      sectionSize,
      cardsCreated: 0,
      questionsCreated: 0,
      cardsPerPage,
      jobEventId: createdJobEvent._id,
    });

    let expectedTimeInSeconds = Math.floor(extractedText.length / 1800) + 15;
    let isPremium = user.isPremium;

    createdJobEvent.isPremium = isPremium;
    createdJobEvent.expectedTimeInSeconds = expectedTimeInSeconds;

    await createdJobEvent.save();
    console.log("JobEvent created:", createdJobEvent._id);

    return res.json({ jobId: job.id, expectedTimeInSeconds, isPremium });
  })
);

router.post(
  "/category/:categoryId/newSectionFromTopic",
  isLoggedIn,
  isCategoryAuthor,
  catchAsync(async (req, res) => {
    const { topic } = req.body;
    const { categoryId } = req.params;
    const { user } = req;

    console.log("Creating new section from topic:", topic);

    //create JobEvent
    let createdJobEvent = await JobEvent.create({
      user: user._id,
      source: "web",
      name: topic,
      jobType: "topic",
    });

    const sectionSize = 40;
    console.log("Section size:", sectionSize);

    const cardsPerPage = 10;
    console.log("Cards per page:", cardsPerPage);

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      return res.json({
        error: "Předmět nebyl nalezen.",
        errorHeadline: "Předmět nebyl nalezen v databázi.",
      });
    }

    createdJobEvent.categoryId = categoryId;
    createdJobEvent.sectionSize = sectionSize;
    createdJobEvent.cardsPerPage = cardsPerPage;

    let expectedCredits = 20;

    createdJobEvent.expectedCredits = expectedCredits;

    console.log("Expected credits:", expectedCredits);
    if (!user.admin && expectedCredits > user.credits + user.extraCredits) {
      await jobFailed(createdJobEvent, "Nedostatek kreditů");
      return res.json({
        creditsRequired: expectedCredits,
        creditsLeft: user.credits,
        jobId: null,
      });
    }
    let extractedText = undefined;

    // Now, enqueue the job with the extracted text instead of a file path
    const job = await flashcardQueue.add({
      extractedText, // pass the extracted text directly
      name: topic,
      categoryId,
      user,
      sectionSize,
      cardsCreated: 0,
      questionsCreated: 0,
      cardsPerPage,
      requestedCards: 20,
      jobEventId: createdJobEvent._id,
    });

    let expectedTimeInSeconds = 20 + 15;
    let isPremium = user.isPremium;

    createdJobEvent.isPremium = isPremium;
    createdJobEvent.expectedTimeInSeconds = expectedTimeInSeconds;

    await createdJobEvent.save();
    console.log("JobEvent created:", createdJobEvent._id);

    return res.json({ jobId: job.id, expectedTimeInSeconds, isPremium });
  })
);

router.get("/job/:id/progress", isLoggedIn, async (req, res) => {
  const jobId = req.params.id;
  const { lastJobCredits, credits, extraCredits } = req.user;

  let totalCredits = credits + extraCredits;

  try {
    const job = await flashcardQueue.getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const progress = job.progress();
    const state = await job.getState(); // pending, active, completed, etc.

    res.json({
      progress,
      state,
      lastJobCredits,
      credits: totalCredits,
    });
  } catch (error) {
    console.error("Error fetching job progress:", error);
    res.status(500).json({ error: "Failed to fetch job progress" });
  }
});

router.post(
  "/demo/generateContent",
  upload.single("document"),
  catchAsync(async (req, res) => {
    const { file } = req;
    const { user } = req;

    //create JobEvent
    let createdJobEvent = await JobEvent.create({
      source: "web",
      isDemo: true,
      name: "demo",
    });

    let name = "Můj balíček";

    const sectionSize = 40;
    const cardsPerPage = 1;

    if (!file) {
      return res.json({
        error: "Nahrajte soubor ve formátu PDF, DOCX nebo PPTX.",
        errorHeadline: "Nebyl nahrán žádný soubor",
      });
    }

    createdJobEvent.sectionSize = sectionSize;
    createdJobEvent.cardsPerPage = cardsPerPage;

    let extractedText = "";
    try {
      // Extract text directly in the route
      const dataBuffer = fs.readFileSync(file.path);
      console.log(
        "File read successfully:",
        file.path,
        "Size:",
        dataBuffer.length,
        "bytes"
      );

      if (file.mimetype === "application/pdf") {
        console.log("Extracting text from PDF...");
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
        console.log("PDF text extracted. Length:", extractedText.length);
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        console.log("Extracting text from DOCX...");
        const docxData = await mammoth.extractRawText({ buffer: dataBuffer });
        extractedText = docxData.value;
        console.log("DOCX text extracted. Length:", extractedText.length);
      } else if (
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {
        console.log("Extracting text from PPTX...");
        extractedText = await new Promise((resolve, reject) => {
          textract.fromBufferWithMime(
            file.mimetype,
            dataBuffer,
            (err, text) => {
              if (err) {
                console.error("Error extracting text from PPTX:", err);
                reject(err);
              } else {
                console.log("PPTX text extracted. Length:", text?.length || 0);
                resolve(text);
              }
            }
          );
        });
      } else {
        console.error("Unsupported file type:", file.mimetype);
        await jobFailed(createdJobEvent, "Nepodporovaný typ souboru");
        return res.json({
          error: "Nahrajte soubor ve formátu PDF, DOCX nebo PPTX.",
          errorHeadline: "Nepodporovaný typ souboru",
        });
      }
    } catch (err) {
      console.error("Error extracting text:", err);
      helpers.incrementEventCount("errorExtractingText");
      await jobFailed(
        createdJobEvent,
        "Nepodařilo se extrahovat text z dokumentu"
      );
      res.json({
        error:
          "Nepodařilo se extrahovat text z dokumentu. Nahrajte prosím dokument ve vyšší kvalitě nebo to zkuste znovu.",
        errorHeadline: "Chyba při extrakci textu",
      });
    } finally {
      console.log("Cleaning up uploaded file:", file.path);
      fs.unlinkSync(file.path);
      console.log("File removed successfully.");
    }

    let pagesLimit = 10;
    let charactersLimit = 1800 * pagesLimit;

    if (extractedText.length < 10) {
      console.error("Error extracting text (text below 10 characters)");
      await jobFailed(
        createdJobEvent,
        "Nepodařilo se extrahovat text z dokumentu (méně než 10 znaků)"
      );
      return res.json({
        error:
          "Nepodařilo se extrahovat text z dokumentu. Nahrajte prosím dokument ve vyšší kvalitě nebo to zkuste znovu.",
        errorHeadline: "Chyba při extrakci textu",
      });
    }

    if (extractedText.length > charactersLimit) {
      await jobFailed(
        createdJobEvent,
        `Překročena maximální délka textu ${formatNumber(
          charactersLimit
        )} znaků (${pagesLimit} stran)`
      );
      return res.json({
        error: `Maximální délka textu je ${formatNumber(
          charactersLimit
        )} znaků (${pagesLimit} stran). Tvůj text má ${formatNumber(
          extractedText.length
        )} znaků.`,
        errorHeadline: "Text je příliš dlouhý",
      });
    }

    const createdCategory = await Category.create({
      text: "Můj předmět",
      icon: "icon_knowledge.png",
      sections: [],
      isDemo: true,
    });

    // Now, enqueue the job with the extracted text instead of a file path
    const job = await flashcardQueue.add({
      extractedText, // pass the extracted text directly
      name,
      categoryId: createdCategory._id,
      user,
      sectionSize,
      cardsCreated: 0,
      questionsCreated: 0,
      cardsPerPage,
      jobEventId: createdJobEvent._id,
    });

    let expectedTimeInSeconds = Math.floor(extractedText.length / 1800) + 15;

    createdJobEvent.expectedTimeInSeconds = expectedTimeInSeconds;

    await createdJobEvent.save();
    console.log("JobEvent created:", createdJobEvent._id);

    return res.json({
      jobId: job.id,
      expectedTimeInSeconds,
      categoryId: createdCategory._id,
    });
  })
);

router.get("/demoJob/:id/progress", async (req, res) => {
  const jobId = req.params.id;
  const categoryId = req.query.categoryId;

  try {
    const job = await flashcardQueue.getJob(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const progress = job.progress();
    const state = await job.getState(); // pending, active, completed, etc.

    let foundCategory = null;

    if (state === "completed") {
      foundCategory = await Category.findById(categoryId);
      req.session.generatedSectionId = foundCategory?.sections[0];
      req.session.generatedCategoryId = categoryId;
      req.session.generatedContentDate = new Date();
    }

    res.json({
      progress,
      state,
      sectionId: foundCategory?.sections[0],
    });
  } catch (error) {
    console.error("Error fetching job progress:", error);
    res.status(500).json({ error: "Failed to fetch job progress" });
  }
});

//function to take a Number, transform it to string and add space every 3 digits from the end
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

async function jobFailed(createdJobEvent, errorMessage) {
  createdJobEvent.finishedSuccessfully = false;
  createdJobEvent.errorMessage = errorMessage;
  await createdJobEvent.save();
}

module.exports = router;
