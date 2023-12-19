const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Stripe = require('../utils/stripe');
const {isLoggedIn} = require('../utils/middleware');
const User = require('../models/user');
const moment = require('moment');
const mail = require('../mail/mail_inlege');

let productToPriceMap = {
  YEARLY: process.env.PRODUCT_YEARLY,
  HALFYEAR: process.env.PRODUCT_HALFYEAR,
  MONTHLY: process.env.PRODUCT_MONTHLY,
  DAILY: process.env.PRODUCT_DAILY
}

let xmasDiscount = false;

if(process.env.XMAS === "on"){
  productToPriceMap = {
    YEARLY: process.env.PRODUCT_YEARLY_XMAS,
    HALFYEAR: process.env.PRODUCT_HALFYEAR_XMAS,
    MONTHLY: process.env.PRODUCT_MONTHLY_XMAS,
    DAILY: process.env.PRODUCT_DAILY_XMAS
  }
}


//Stripe checkout
router.post('/payment/checkout', isLoggedIn, catchAsync(async (req, res) => {
    let session;
    if(req.body.product === "monthly"){
        session = await Stripe.createCheckoutSession(req.user.billingId, productToPriceMap.MONTHLY)
      }
    if(req.body.product === "halfyear"){
      session = await Stripe.createCheckoutSession(req.user.billingId, productToPriceMap.HALFYEAR)
    }
    if(req.body.product === "yearly"){
        session = await Stripe.createCheckoutSession(req.user.billingId, productToPriceMap.YEARLY)
      }
    if(req.body.product === "daily"){
      session = await Stripe.createCheckoutSession(req.user.billingId, productToPriceMap.DAILY)
    }
    res.status(200).send({ sessionId: session.id })
  }))

//payment successful
router.get('/payment/success', (req, res) => {
  res.status(200).render('payments/success')
})

//payment failed
router.get('/payment/failed', (req, res) => {
  res.status(200).render('payments/failed')
})

router.post('/webhook', async (req, res) => {
    let event
    try {
      event = Stripe.createWebhook(req.body, req.header('Stripe-Signature'))
    } catch (err) {
      console.log(err)
      return res.sendStatus(400)
    }
    
    const data = event.data.object

    if(data.plan.id == process.env.PRODUCT_YEARLY_XMAS ||
       data.plan.id == process.env.PRODUCT_HALFYEAR_XMAS ||
       data.plan.id == process.env.PRODUCT_MONTHLY_XMAS ||
       data.plan.id == process.env.PRODUCT_DAILY_XMAS
      ) {
        xmasDiscount = true;
      }

  switch (event.type) {
      //manage subscription (new/update/cancel)
      case "customer.subscription.updated":{
        //changed payment period
        console.log('UPDATED RUNNING: webhook customer.subscription.updated');
        console.log(`data.plan.id: ${data.plan.id}`);
        const user = await User.findOne({billingId: data.customer});
        if(!user){
          console.log('Uživatel s tímto platebním ID nebyl nalezen');
          return res.sendStatus(404);
        }
        let today = Date.now();
        if (!data.canceled_at && (data.plan.id == process.env.PRODUCT_YEARLY || data.plan.id == process.env.PRODUCT_YEARLY_XMAS)) {
          user.plan = "yearly";
          user.endDate = moment(today).add('1','year').format();
          //format endDate
          const endDate = moment(user.endDate).locale('cs').format('LL');
          //info emails
          if(user.isPremium){
              mail.subscriptionUpdated(user.email, endDate);
              mail.adminInfoSubscriptionUpdated(user, endDate);
              //update date on user
              user.premiumDateOfUpdate = moment();
          } else {
              mail.subscriptionCreated(user.email);
              mail.adminInfoNewSubscription(user);
              user.premiumDateOfActivation = moment();
          }
          user.xmasDiscount = xmasDiscount;
          user.isPremium = true;
        }
  
        if (!data.canceled_at && (data.plan.id == process.env.PRODUCT_MONTHLY || data.plan.id == process.env.PRODUCT_MONTHLY_XMAS)) {
          user.plan = "monthly";
          user.endDate = moment(today).add('1','month').format();
          //format endDate
          const endDate = moment(user.endDate).locale('cs').format('LL');
          //info emails
          if(user.isPremium){
            mail.subscriptionUpdated(user.email, endDate);
            mail.adminInfoSubscriptionUpdated(user, endDate);
            //update date on user
            user.premiumDateOfUpdate = moment();
          } else {
              mail.subscriptionCreated(user.email);
              mail.adminInfoNewSubscription(user);
              user.premiumDateOfActivation = moment();
          }
          user.xmasDiscount = xmasDiscount;
          user.isPremium = true;
          //if on yearly and changes to monhtly, will loose the prepaid period
        }

        if (!data.canceled_at && (data.plan.id == process.env.PRODUCT_HALFYEAR || data.plan.id == process.env.PRODUCT_HALFYEAR_XMAS)) {
          user.plan = "halfyear";
          user.endDate = moment(today).add('6','month').format();
          //format endDate
          const endDate = moment(user.endDate).locale('cs').format('LL');
          //info emails
          if(user.isPremium){
            mail.subscriptionUpdated(user.email, endDate);
            mail.adminInfoSubscriptionUpdated(user, endDate);
            //update date on user
            user.premiumDateOfUpdate = moment();
          } else {
              mail.subscriptionCreated(user.email);
              mail.adminInfoNewSubscription(user);
              user.premiumDateOfActivation = moment();
          }
          user.xmasDiscount = xmasDiscount;
          user.isPremium = true;
          //if on halfyear changes to monhtly, will loose the prepaid period
        }

        if (!data.canceled_at && (data.plan.id == process.env.PRODUCT_DAILY || data.plan.id == process.env.PRODUCT_DAILY_XMAS)) {
          user.plan = "daily";
          user.endDate = moment(today).add('1','day').format();
          //format endDate
          const endDate = moment(user.endDate).locale('cs').format('LL');
          //info emails
          if(user.isPremium){
            mail.subscriptionUpdated(user.email, endDate);
            mail.adminInfoSubscriptionUpdated(user, endDate);
            //update date on user
            user.premiumDateOfUpdate = moment();
          } else {
              mail.subscriptionCreated(user.email);
              mail.adminInfoNewSubscription(user);
              user.premiumDateOfActivation = moment();
          }
          user.xmasDiscount = xmasDiscount;
          user.isPremium = true;
        }
        
        //cancelation
        if (data.canceled_at) {
          // cancelled
          user.premiumDateOfCancelation = moment();
          user.plan = "none";
          const endDate = moment(user.endDate).locale('cs').format('LL');
          mail.subscriptionCanceled(user.email, endDate);
          mail.adminInfoSubscriptionCanceled(user, endDate);
          user.xmasDiscount = false;
        }
        user.premiumGrantedByAdmin = false;
        await user.save()
        break
    }
  }
  
    res.sendStatus(200)
})

//update subcription
router.post('/billing', async (req, res) => {
  const { customer } = req.body
  const session = await Stripe.createBillingSession(customer)
  res.status(200).json({ url: session.url })
})

  module.exports = router;