const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const Invoice = require("../models/invoice");
const Settings = require("../models/settings");
const { isLoggedIn, isAdmin } = require("../utils/middleware");
const moment = require("moment");

//add new invoice
router.post(
  "/invoice/new/:userId",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let data = req.body;
    let { userId } = req.params;
    let foundUser = await User.findById(userId);
    if (!foundUser) {
      req.flash("error", "Uživatel neexistuje");
      return res.redirect("/admin/users");
    }
    let { invoiceNum, invoiceDate, subscriptionPeriod } = data;

    let invoiceAmount = parseFloat(req.body.invoiceAmount);

    let newInvoice = {
      identificationNumber: invoiceNum,
      dateIssued: moment(invoiceDate).locale("cs").format("l"),
      amount: invoiceAmount,
      user: userId,
      subscriptionPeriod,
    };

    //save invoice to DB
    let createdInvoice = await Invoice.create(newInvoice);

    //save new invoice ID reference on user
    foundUser.invoicesDbObjects.unshift(createdInvoice._id);
    foundUser.hasOpenInvoice = false;
    foundUser.openInvoiceData = {};
    await foundUser.save();

    await Settings.findOneAndUpdate(
      { settingName: "lastInvoiceNumber" },
      { settingValue: invoiceNum },
      { upsert: true, new: true }
    );
    req.flash("successOverlay", "Faktura byla vložena");
    res.status(201).redirect(`/invoices/open`);
  })
);

//show one invoice
router.get(
  "/invoice/show/:invoiceId/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { invoiceId } = req.params;
    let foundInvoice = await Invoice.findById(invoiceId);
    if (!foundInvoice) {
      req.flash("error", "Faktura nebyla nalezena");
      return res.redirect("/auth/user/profile");
    }
    res.status(201).render(`invoices/showOne`, { invoice: foundInvoice });
  })
);

//show all invoices
router.get(
  "/invoices/issued",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let invoices = await Invoice.find({}).populate("user");
    invoices.reverse();
    let { show } = req.query;
    if (show === "lastMonth") {
      // Calculate the start and end of the previous calendar month
      const startOfLastMonth = moment().subtract(1, "month").startOf("month");
      const endOfLastMonth = moment().subtract(1, "month").endOf("month");

      let filteredInvoices = invoices.filter((invoice) => {
        let invoiceDate = moment(invoice.dateIssued, "DD.MM.YYYY");
        // Check if the invoice date is between the start and end of the previous month
        return invoiceDate.isBetween(
          startOfLastMonth,
          endOfLastMonth,
          null,
          "[]"
        );
      });

      invoices = filteredInvoices;
      return res.status(201).render(`invoices/issuedFull`, { invoices });
    }
    if (show === "full") {
      res.status(201).render(`invoices/issuedFull`, { invoices });
    } else {
      res.status(201).render(`invoices/issuedList`, { invoices });
    }
  })
);

//logic to remove invoices created after 01/05/2024
router.get(
  "/invoice/removeInvoice/:userId/:invoiceId",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { userId, invoiceId } = req.params;
    let foundUser = await User.findById(userId);
    if (!foundUser) {
      req.flash("error", "Uživatel neexistuje");
      return res.redirect("/admin/users");
    }

    //remove invoice object from DB
    await Invoice.findByIdAndDelete(invoiceId);

    // Function to filter out an object based on invoiceNum
    function filterArrayOfInvoices(arr, invoiceId) {
      return arr.filter((invoice) => invoice.toString() !== invoiceId);
    }
    let filteredInvoices = filterArrayOfInvoices(
      foundUser.invoicesDbObjects,
      invoiceId
    );
    foundUser.invoicesDbObjects = filteredInvoices;
    foundUser.save();
    req.flash("successOverlay", "Faktura byla odstraněna");
    res.status(201).redirect(`/admin/${userId}/showDetail`);
  })
);

//cancel open invoice
router.get(
  "/invoice/closeInvoice/:userId/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { userId } = req.params;
    let foundUser = await User.findById(userId);
    if (!foundUser) {
      req.flash("error", "Uživatel nebyl nalezen");
      return res.redirect("/invoices/open");
    }
    foundUser.hasOpenInvoice = false;
    foundUser.openInvoiceData = {};
    await foundUser.save();
    req.flash("successOverlay", "Koncept faktury byl odstraněn");
    res.status(201).redirect(`/invoices/open`);
  })
);

//export last month invoices in csv
router.get(
  "/invoices/exportLastMonth",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    // Determine the start and end of the previous calendar month
    const startOfLastMonth = moment().subtract(1, "month").startOf("month");
    const endOfLastMonth = moment().subtract(1, "month").endOf("month");

    // Get the name of the month and year for the title
    const reportMonth = moment().subtract(1, "month").format("MMMM YYYY");

    // Fetch all invoices
    let invoices = await Invoice.find({});

    // Filter for invoices in the last calendar month
    let filteredInvoices = invoices.filter((invoice) => {
      let invoiceDate = moment(invoice.dateIssued, "DD.MM.YYYY");
      return invoiceDate.isBetween(
        startOfLastMonth,
        endOfLastMonth,
        null,
        "[]"
      );
    });

    // Prepare CSV rows
    const csvRows = [];
    csvRows.push(`${reportMonth}`); // Add the title row

    // Prepare CSV headers
    const headers = ["Datum", "Číslo faktury", "Položka", "Částka", "Měna"];

    // Build CSV rows
    csvRows.push(headers.join(";")); // Header row
    filteredInvoices.forEach((inv) => {
      if (inv.subscriptionPeriod === "monthly") {
        inv.subscriptionPeriod = "InLege Premium - měsíční";
      } else if (inv.subscriptionPeriod === "halfyear") {
        inv.subscriptionPeriod = "InLege Premium - půlroční";
      } else if (inv.subscriptionPeriod === "yearly") {
        inv.subscriptionPeriod = "InLege Premium - roční";
      }

      if (inv.amountOfCredits !== 0 && inv.amountOfCredits !== undefined) {
        inv.subscriptionPeriod =
          "Edookio AI kredity - " + inv.amountOfCredits + " kreditů";
      }

      const row = [
        inv.dateIssued, // Date invoice was issued
        `CZ${inv.identificationNumber}`, // Invoice number
        inv.subscriptionPeriod, // Subscription version/period
        inv.amount, // Price/amount of the invoice
        "CZK", // Currency
      ];
      csvRows.push(row.join(";"));
    });

    const csvString = csvRows.join("\n");

    // Set headers to force download of CSV
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=last_month_invoices.csv"
    );
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.status(200).send(csvString);
  })
);

//LEGACY CODE  - old invoices before 01_05_2024 (still in use)
router.get(
  "/invoice/remove/:userId/:invoiceNum",
  isLoggedIn,
  isAdmin,
  catchAsync(async (req, res) => {
    let { userId, invoiceNum } = req.params;
    let foundUser = await User.findById(userId);
    if (!foundUser) {
      req.flash("error", "Uživatel neexistuje");
      return res.redirect("/admin/users");
    }
    // Function to filter out an object based on invoiceNum
    function filterArrayOfInvoices(arr, invoiceNumber) {
      return arr.filter((invoice) => invoice.invoiceNum !== invoiceNumber);
    }
    let filteredInvoices = filterArrayOfInvoices(
      foundUser.invoices,
      invoiceNum
    );
    foundUser.invoices = filteredInvoices;
    foundUser.save();
    req.flash("successOverlay", "Faktura byla odstraněna");
    res.status(201).redirect(`/admin/${userId}/showDetail`);
  })
);

router.get(
  "/invoice/request/:invoiceNum",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let { invoiceNum } = req.params;
    let foundUser = await User.findById(req.user._id);
    if (!foundUser) {
      req.flash("error", "Uživatel neexistuje");
      return res.redirect("/");
    }
    foundUser.invoices.forEach((invoice) => {
      if (invoice.invoiceNum === invoiceNum) {
        invoice.isRequested = true;
      }
    });
    foundUser.markModified("invoices");
    await foundUser.save();
    mail.requestInvoice(req.user.email, invoiceNum);
    req.flash(
      "success",
      `Faktura ${invoiceNum} byla vyžádána a bude doručena do e-mailové schránky ${req.user.email} do tří pracovních dnů.`
    );
    res.status(200).redirect(`/auth/user/profile`);
  })
);

module.exports = router;
