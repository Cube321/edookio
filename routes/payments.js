const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Stripe = require('../utils/stripe');
const {isLoggedIn} = require('../utils/middleware');
const User = require('../models/user');
const moment = require('moment');

const productToPriceMap = {
    YEARLY: process.env.PRODUCT_YEARLY,
    MONTHLY: process.env.PRODUCT_MONTHLY
  }

//Stripe checkout
router.post('/payment/checkout', isLoggedIn, catchAsync(async (req, res) => {
    let session;
    if(req.body.product === "monthly")(
        session = await Stripe.createCheckoutSession(req.user.billingId, productToPriceMap.MONTHLY)
    )
    if(req.body.product === "yearly")(
        session = await Stripe.createCheckoutSession(req.user.billingId, productToPriceMap.YEARLY)
    )
    res.send({ sessionId: session.id })
  }))

//payment successful
router.get('/payment/success', (req, res) => {
  res.render('payments/success')
})

//payment failed
router.get('/payment/failed', (req, res) => {
  res.render('payments/failed')
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


  switch (event.type) {
    //create new subscription
    case 'customer.subscription.created': {
      const user = await User.findOne({billingId: data.customer});
      let today = Date.now();
      if (data.plan.id === productToPriceMap.YEARLY) {
        user.plan = 'yearly';
        user.endDate = moment(today).add('1','year').format();
      }

      if (data.plan.id === productToPriceMap.MONTHLY) {
        user.plan = 'monthly';
        user.endDate = moment(today).add('1','month').format();
      }
      user.isPremium = true;
      await user.save()
      break
    }
      //manage subscription (change plan + cancel)
      case "customer.subscription.updated":{
        //changed payment period
        const user = await User.findOne({billingId: data.customer});
        let today = Date.now();

        if (data.plan.id == productToPriceMap.YEARLY) {
          user.plan = "yearly";
          user.endDate = moment(today).add('1','year').format();
          user.isPremium = true;
        }
  
        if (data.plan.id == productToPriceMap.MONTHLY) {
          user.plan = "monthly";
          user.endDate = moment(today).add('1','month').format();
          user.isPremium = true;
          //if on yearly and changes to monhtly, will loose the prepaid period - bug - fix
        }
        
        //cancelation
        if (data.canceled_at) {
          // cancelled
          user.plan = "none";
        }
  
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
  res.json({ url: session.url })
})

  module.exports = router;