const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Stripe = require("../utils/stripe");
const { isLoggedIn } = require("../utils/middleware");
const User = require("../models/user");
const moment = require("moment");
const mail = require("../mail/mail_inlege");
const helpers = require("../utils/helpers");

let productToPriceMap = {
  YEARLY: process.env.PRODUCT_YEARLY,
  MONTHLY: process.env.PRODUCT_MONTHLY,
  CREDITS_1000: process.env.PRODUCT_CREDITS_1000,
  CREDITS_5000: process.env.PRODUCT_CREDITS_5000,
  CREDITS_10000: process.env.PRODUCT_CREDITS_10000,
  CREDITS_25000: process.env.PRODUCT_CREDITS_25000,
};

//Stripe checkout
router.post(
  "/payment/checkout",
  isLoggedIn,
  catchAsync(async (req, res) => {
    let session;
    if (req.body.product === "monthly") {
      session = await Stripe.createCheckoutSession(
        req.user.billingId,
        productToPriceMap.MONTHLY,
        "subscription"
      );
    }

    if (req.body.product === "yearly") {
      session = await Stripe.createCheckoutSession(
        req.user.billingId,
        productToPriceMap.YEARLY,
        "subscription"
      );
    }

    // credits_1000 (ONE-TIME!)
    if (req.body.product === "credits_1000") {
      session = await Stripe.createCheckoutSession(
        req.user.billingId,
        productToPriceMap.CREDITS_1000,
        "payment",
        { product: "credits_1000" }
      );
    }

    // credits_5000 (ONE-TIME!)
    if (req.body.product === "credits_5000") {
      session = await Stripe.createCheckoutSession(
        req.user.billingId,
        productToPriceMap.CREDITS_5000,
        "payment",
        { product: "credits_5000" }
      );
    }

    // credits_10000 (ONE-TIME!)
    if (req.body.product === "credits_10000") {
      session = await Stripe.createCheckoutSession(
        req.user.billingId,
        productToPriceMap.CREDITS_10000,
        "payment",
        { product: "credits_10000" }
      );
    }

    // credits_25000 (ONE-TIME!)
    if (req.body.product === "credits_25000") {
      session = await Stripe.createCheckoutSession(
        req.user.billingId,
        productToPriceMap.CREDITS_25000,
        "payment",
        { product: "credits_25000" }
      );
    }

    res.status(200).send({ sessionId: session.id });
  })
);

//payment successful
router.get("/payment/success", (req, res) => {
  res.status(200).render("payments/success");
});

//payment failed
router.get("/payment/failed", (req, res) => {
  res.status(200).render("payments/failed");
});

router.post(
  "/webhook",
  catchAsync(async (req, res) => {
    let event;
    try {
      event = Stripe.createWebhook(req.body, req.header("Stripe-Signature"));
    } catch (err) {
      console.log(err);
      return res.sendStatus(400);
    }

    const data = event.data.object;

    switch (event.type) {
      //manage subscription (new/update/cancel)
      case "customer.subscription.updated": {
        //changed payment period
        console.log("UPDATED RUNNING: webhook customer.subscription.updated");
        console.log(`data.plan.id: ${data.plan.id}`);
        let user = await User.findOne({ billingId: data.customer });
        if (!user) {
          console.log("Uživatel s tímto platebním ID nebyl nalezen");
          return res.sendStatus(404);
        }
        let today = Date.now();

        //handle failed payment of recurring subscription
        if (data.status === "past_due") {
          // code here
          console.log("PAST_DUE is running");
          try {
            await mail.adminInfoSubscriptionPaymentFailed(user, data.status);
          } catch (err) {
            console.log(
              "Failed sending e-mail adminInfoSubscriptionPaymentFailed: ",
              err
            );
          }
          await user.save();
          //break so the rest of the switch code below will not run
          break;
        }

        //handle subscription
        if (!data.canceled_at && data.plan.id == process.env.PRODUCT_YEARLY) {
          user.plan = "yearly";
          user.creditsMonthlyLimit = 1250;
          user.credits = 1250;
          user.creditsLastRecharge = today;
          user.endDate = moment(today).add("1", "year").format();
          //format endDate
          const endDate = moment(user.endDate).locale("cs").format("LL");
          //info emails
          if (user.isPremium) {
            try {
              await mail.adminInfoSubscriptionUpdated(user, endDate);
            } catch (err) {
              console.log(
                "Failed sending e-mail adminInfoSubscriptionUpdated: ",
                err
              );
            }
            //update date on user
            user.premiumDateOfUpdate = moment();
          } else {
            try {
              await mail.subscriptionCreated(user.email);
              await mail.adminInfoNewSubscription(user);
            } catch (err) {
              console.log("Failed sending e-mail subscriptionCreated: ", err);
            }
            user.premiumDateOfActivation = moment();
          }
          user.subscriptionSource = "stripe";
          user.isPremium = true;
        }

        if (!data.canceled_at && data.plan.id == process.env.PRODUCT_MONTHLY) {
          user.plan = "monthly";
          user.creditsMonthlyLimit = 1000;
          user.credits = 1000;
          user.creditsLastRecharge = today;
          user.endDate = moment(today).add("1", "month").format();
          //format endDate
          const endDate = moment(user.endDate).locale("cs").format("LL");
          //info emails
          if (user.isPremium) {
            try {
              await mail.adminInfoSubscriptionUpdated(user, endDate);
            } catch (err) {
              console.log(
                "Failed sending e-mail adminInfoSubscriptionUpdated: ",
                err
              );
            }
            //update date on user
            user.premiumDateOfUpdate = moment();
          } else {
            try {
              await mail.subscriptionCreated(user.email);
              await mail.adminInfoNewSubscription(user);
            } catch (err) {
              console.log("Failed sending e-mail subscriptionCreated: ", err);
            }
            user.premiumDateOfActivation = moment();
          }
          user.subscriptionSource = "stripe";
          user.isPremium = true;
        }

        //cancelation
        if (data.canceled_at && user.plan !== "none") {
          // cancelled
          user.premiumDateOfCancelation = moment();
          user.creditsMonthlyLimit = 100;
          user.plan = "none";
          const endDate = moment(user.endDate).locale("cs").format("LL");
          try {
            await mail.subscriptionCanceled(user.email, endDate);
            await mail.adminInfoSubscriptionCanceled(user, endDate);
          } catch (err) {
            console.log("Failed sending e-mail subscriptionCanceled: ", err);
          }
          user.monthlySubscriptionPrice = 0;
          user.subscriptionPrice = 0;
          user.subscriptionSource = "none";
        }
        user.premiumGrantedByAdmin = false;
        await user.save();
        break;
      }

      case "invoice.payment_succeeded": {
        // Extract payment details
        const user = await User.findOne({ billingId: data.customer });
        if (!user) {
          console.error(`User not found for customer ID: ${data.customer}`);
          return res.sendStatus(404);
        }

        const amountPaid = data.amount_paid / 100; // Convert cents to currency
        const originalPrice = data.subtotal / 100;

        let plan = "none";

        if (originalPrice === 229) {
          plan = "monthly";
        } else if (originalPrice === 1490) {
          plan = "yearly";
        }

        console.log(`User ${user.email} paid ${amountPaid} CZK`);

        await helpers.createInvoice(
          user._id,
          amountPaid,
          "subscription",
          "CZK",
          plan
        );

        user.subscriptionPrice = amountPaid;

        //count monthly subscription price
        if (plan === "monthly") {
          user.monthlySubscriptionPrice = amountPaid;
        } else if (plan === "yearly") {
          user.monthlySubscriptionPrice = amountPaid / 12;
        }

        await user.save();
        break;
      }

      // ONE-TIME PURCHASES:
      // -------------------------------------------------
      case "checkout.session.completed": {
        try {
          const session = data;
          // Safety check: only proceed if session.mode === 'payment'
          if (session.mode === "payment") {
            const { product } = session.metadata;

            if (product === "credits_1000") {
              const user = await User.findOne({ billingId: session.customer });
              if (!user) {
                console.log(
                  "No user found for this customer ID: ",
                  session.customer
                );
                return res.sendStatus(404);
              }
              user.extraCredits = user.extraCredits + 1000;

              await user.save();
              await helpers.createInvoice(
                user._id,
                290,
                "credits",
                "CZK",
                null,
                1000
              );
              await mail.creditsAddedConfirmationEmail(user.email, 1000);
              await mail.adminInfoCreditsPurchased(
                user.email,
                1000,
                290,
                "CZK"
              );
              console.log(`Added 1000 credits to ${user.email}`);
            }

            if (product === "credits_5000") {
              const user = await User.findOne({ billingId: session.customer });
              if (!user) {
                console.log(
                  "No user found for this customer ID: ",
                  session.customer
                );
                return res.sendStatus(404);
              }
              user.extraCredits = user.extraCredits + 5000;

              await user.save();
              await helpers.createInvoice(
                user._id,
                1190,
                "credits",
                "CZK",
                null,
                5000
              );
              await mail.creditsAddedConfirmationEmail(user.email, 5000);
              await mail.adminInfoCreditsPurchased(
                user.email,
                5000,
                1190,
                "CZK"
              );
              console.log(`Added 5000 credits to ${user.email}`);
            }

            if (product === "credits_10000") {
              const user = await User.findOne({ billingId: session.customer });
              if (!user) {
                console.log(
                  "No user found for this customer ID: ",
                  session.customer
                );
                return res.sendStatus(404);
              }
              user.extraCredits = user.extraCredits + 10000;

              await user.save();
              await helpers.createInvoice(
                user._id,
                1990,
                "credits",
                "CZK",
                null,
                10000
              );
              await mail.creditsAddedConfirmationEmail(user.email, 10000);
              await mail.adminInfoCreditsPurchased(
                user.email,
                10000,
                1990,
                "CZK"
              );
              console.log(`Added 10000 credits to ${user.email}`);
            }

            if (product === "credits_25000") {
              const user = await User.findOne({ billingId: session.customer });
              if (!user) {
                console.log(
                  "No user found for this customer ID: ",
                  session.customer
                );
                return res.sendStatus(404);
              }
              user.extraCredits = user.extraCredits + 25000;

              await user.save();
              await helpers.createInvoice(
                user._id,
                3990,
                "credits",
                "CZK",
                null,
                25000
              );
              await mail.creditsAddedConfirmationEmail(user.email, 25000);
              await mail.adminInfoCreditsPurchased(
                user.email,
                25000,
                3990,
                "CZK"
              );
              console.log(`Added 25000 credits to ${user.email}`);
            }
          }
        } catch (err) {
          console.log("Error in checkout.session.completed block:", err);
          return res.sendStatus(400);
        }

        break;
      }
    }
    res.sendStatus(200);
  })
);

//update subcription
router.post("/billing", async (req, res) => {
  const { customer } = req.body;
  const session = await Stripe.createBillingSession(customer);
  res.status(200).json({ url: session.url });
});

module.exports = router;
