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
const passport = require("passport");
const { error } = require("console");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/mobileApi/generatePackage",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  catchAsync(async (req, res) => {
    console.log("Creating new section from document...");

    const { name } = req.body;
    const { file } = req;
    const { categoryId } = req.query;
    const { user } = req;

    //create JobEvent
    let createdJobEvent = await JobEvent.create({
      user: user._id,
      source: "app",
      name,
      jobType: "document",
    });

    console.log("categoryId:", categoryId);

    const sectionSize = parseInt(req.body.sectionSize) || 20;
    console.log("Section size:", sectionSize);

    const cardsPerPage = parseInt(req.body.cardsPerPage) || 3;
    console.log("Cards per page:", cardsPerPage);

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      return res.status(404).json({ error: "Předmět nenalezen" });
    }

    //check if user is the author of the category
    if (foundCategory.author && !foundCategory.author.equals(user._id)) {
      await jobFailed(createdJobEvent, "Neautorizovaný uživatel");
      return res
        .status(400)
        .json({ error: "Nemáš oprávnění přidávat balíčky do tohoto předmětu" });
    }

    if (!file) {
      return res.status(400).json({
        error: "Nebyl nahrán žádný soubor",
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
        await jobFailed(createdJobEvent, "Nepodporovaný typ souboru");
        console.error("Unsupported file type:", file.mimetype);
        return res.status(400).json({
          error: "Nahrajte soubor ve formátu PDF, DOCX nebo PPTX",
        });
      }
    } catch (err) {
      console.error("Error extracting text:", err);
      helpers.incrementEventCount("errorExtractingText");
      await jobFailed(createdJobEvent, "Chyba při extrakci textu");
      res.status(400).json({
        error:
          "Nepodařilo se extrahovat text z dokumentu. Nahrajte prosím dokument ve vyšší kvalitě nebo to zkuste znovu.",
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

    if (extractedText.length < 100) {
      console.error("Error extracting text (text below 10 characters)");
      helpers.incrementEventCount("errorExtractingTextBelow10Chars");
      await jobFailed(
        createdJobEvent,
        "Nepodařilo se extrahovat text z dokumentu (méně než 100 znaků)"
      );
      return res.status(400).json({
        error:
          "Nepodařilo se extrahovat text z dokumentu. Nahrajte prosím dokument ve vyšší kvalitě nebo to zkuste znovu.",
      });
    }

    if (extractedText.length > charactersLimit) {
      await jobFailed(
        createdJobEvent,
        `Překročena maximální délka textu ${formatNumber(
          charactersLimit
        )} znaků (${pagesLimit} stran)`
      );
      return res.status(400).json({
        error: `Text je příliš dlouhý. Maximální délka textu je ${formatNumber(
          charactersLimit
        )} znaků (${pagesLimit} stran). Tvůj text má ${formatNumber(
          extractedText.length
        )} znaků.`,
        showPremiumButton: user.isPremium
          ? undefined
          : "zvýšit limit na 150 stran",
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
      return res.status(400).json({
        error: `Nemáš dostatek kreditů. Ke zpracování textu potřebuješ ${expectedCredits} AI kreditů.`,
        showPremiumButton: user.isPremium ? undefined : "navýšit kredity",
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

    await createdJobEvent.save();
    console.log("JobEvent created:", createdJobEvent._id);

    return res.json({ jobId: job.id, expectedTimeInSeconds, isPremium });
  })
);

router.post(
  "/mobileApi/generatePackageFromTopic",
  passport.authenticate("jwt", { session: false }),
  catchAsync(async (req, res) => {
    console.log("Creating new section from topic...");

    const { topic } = req.body;
    const { categoryId } = req.query;
    const { user } = req;

    //create JobEvent
    let createdJobEvent = await JobEvent.create({
      user: user._id,
      source: "app",
      name: topic,
      jobType: "topic",
    });

    console.log("categoryId:", categoryId);

    console.log("Topic:", topic);

    const sectionSize = 40;
    console.log("Section size:", sectionSize);

    const cardsPerPage = 10;
    console.log("Cards per page:", cardsPerPage);

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      return res.status(404).json({ error: "Předmět nenalezen" });
    }

    //check if user is the author of the category
    if (foundCategory.author && !foundCategory.author.equals(user._id)) {
      await jobFailed(createdJobEvent, "Neautorizovaný uživatel");
      return res
        .status(400)
        .json({ error: "Nemáš oprávnění přidávat balíčky do tohoto předmětu" });
    }

    createdJobEvent.categoryId = categoryId;
    createdJobEvent.sectionSize = sectionSize;
    createdJobEvent.cardsPerPage = cardsPerPage;

    createdJobEvent.expectedCredits = 20;

    let expectedCredits = 20;

    console.log("Expected credits:", expectedCredits);
    if (!user.admin && expectedCredits > user.credits + user.extraCredits) {
      await jobFailed(createdJobEvent, "Nedostatek kreditů");
      return res.status(400).json({
        error: `Nemáš dostatek kreditů. Ke zpracování textu potřebuješ ${expectedCredits} AI kreditů.`,
        showPremiumButton: user.isPremium ? undefined : "navýšit kredity",
      });
    }

    let extractedText = undefined;

    // Now, enqueue the job with the extracted text instead of a file path
    const job = await flashcardQueue.add({
      extractedText,
      name: topic,
      categoryId,
      user,
      sectionSize,
      cardsCreated: 0,
      questionsCreated: 0,
      cardsPerPage,
      jobEventId: createdJobEvent._id,
      requestedCards: 20,
    });

    let expectedTimeInSeconds = 20 + 15;
    let isPremium = user.isPremium;

    await createdJobEvent.save();
    console.log("JobEvent created:", createdJobEvent._id);

    return res.json({ jobId: job.id, expectedTimeInSeconds, isPremium });
  })
);

router.get(
  "/mobileApi/:id/getJobProgress",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
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
      const failedReason = state === "failed" ? job.failedReason : null;

      res.json({
        progress,
        state,
        lastJobCredits,
        credits: totalCredits,
        failedReason,
      });
    } catch (error) {
      console.error("Error fetching job progress:", error);
      res.status(500).json({ error: "Failed to fetch job progress" });
    }
  }
);

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
