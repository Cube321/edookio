const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Stripe = require("../utils/stripe");
const { isLoggedIn } = require("../utils/middleware");
const User = require("../models/user");
const moment = require("moment");
const mail = require("../mail/mail_inlege");

let productToPriceMap = {
  YEARLY: process.env.PRODUCT_YEARLY,
  MONTHLY: process.env.PRODUCT_MONTHLY,
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
        productToPriceMap.MONTHLY
      );
    }
    if (req.body.product === "yearly") {
      session = await Stripe.createCheckoutSession(
        req.user.billingId,
        productToPriceMap.YEARLY
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
          user.creditsMonthlyLimit = 1000;
          user.credits = 1000;
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

        updatedUser = createOpenInvoice(user, amountPaid, plan);

        updatedUser.subscriptionPrice = amountPaid;

        //count monthly subscription price
        if (plan === "monthly") {
          updatedUser.monthlySubscriptionPrice = amountPaid;
        } else if (plan === "yearly") {
          updatedUser.monthlySubscriptionPrice = amountPaid / 12;
        }

        await updatedUser.save();
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

//HELPERS
const createOpenInvoice = (user, amountPaid, plan) => {
  //create open invoice
  user.hasOpenInvoice = true;
  user.openInvoiceData = {
    amount: amountPaid,
    date: Date.now(),
    plan: plan,
  };
  return user;
};

module.exports = router;
