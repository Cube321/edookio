// routes/flashcards.js (similar to your original code)
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { isEditor, isLoggedIn } = require("../utils/middleware");
const Category = require("../models/category");
const flashcardQueue = require("../jobs/flashcardQueue");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const textract = require("textract");

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

router.post(
  "/category/:categoryId/newSectionFromDocument",
  isLoggedIn,
  isEditor,
  upload.single("document"),
  catchAsync(async (req, res) => {
    const { name, desc } = req.body;
    const { file } = req;
    const { categoryId } = req.params;
    const { user } = req;

    const sectionSize = parseInt(req.body.sectionSize) || 10;
    console.log("Section size:", sectionSize);

    const cardsPerPage = parseInt(req.body.cardsPerPage) || 3;
    console.log("Cards per page:", cardsPerPage);

    const foundCategory = await Category.findById(categoryId);
    if (!foundCategory) {
      req.flash("error", "Předmět nebyl nalezen.");
      return res.redirect("/");
    }

    if (!file) {
      req.flash("error", "Nebyl nahrán žádný soubor.");
      return res.redirect("back");
    }

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
        req.flash(
          "error",
          "Nepodporovaný typ souboru. Nahrajte PDF, DOCX nebo PPTX."
        );
        return res.redirect("back");
      }
    } catch (err) {
      console.error("Error extracting text:", err);
      req.flash(
        "error",
        "Chyba při extrakci textu z dokumentu. Zkuste to prosím ještě jednou."
      );
      return res.redirect("back");
    } finally {
      console.log("Cleaning up uploaded file:", file.path);
      fs.unlinkSync(file.path);
      console.log("File removed successfully.");
    }

    let expectedCredits =
      Math.floor(extractedText.length / 2000) * cardsPerPage * 2; // 2 credits per card (change for Edookio to 1)
    console.log("Expected credits:", expectedCredits);
    if (!user.admin && expectedCredits > user.credits) {
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
      desc,
      categoryId,
      user,
      sectionSize,
      cardsCreated: 0,
      questionsCreated: 0,
      cardsPerPage,
    });

    return res.json({ jobId: job.id });
  })
);

router.get("/job/:id/progress", isLoggedIn, isEditor, async (req, res) => {
  const jobId = req.params.id;
  const { lastJobCredits, credits } = req.user;

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
      credits,
    });
  } catch (error) {
    console.error("Error fetching job progress:", error);
    res.status(500).json({ error: "Failed to fetch job progress" });
  }
});

module.exports = router;
