$(document).ready(function() {
	const PUBLISHABLE_KEY = 'pk_test_51M7LRDAaRhuCsgZoSmUjyXiHbiKnXBc3g4YgwigzTCTfFpUMAB6NizhS3tL8WzxE9ICPRJl5Rzz6KiCJaxCVczwc00ZEs1F1zJ'
  
    const stripe = Stripe(
      PUBLISHABLE_KEY)

	//Stripe payment

  /* TEST DAILY
  const checkoutButtonDaily = $('#checkout-button-daily')
  
  checkoutButtonDaily.click(function () {
    const product = "daily";

    fetch('/payment/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product
      })
    })
      .then((result) => result.json())
      .then(({ sessionId }) => stripe.redirectToCheckout({ sessionId }))
  })
  */

  //Monthly Subscription
	const checkoutButtonMonthly = $('#checkout-button-monthly')
  
    checkoutButtonMonthly.click(function () {
      const product = "monthly";
  
      fetch('/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product
        })
      })
        .then((result) => result.json())
        .then(({ sessionId }) => stripe.redirectToCheckout({ sessionId }))
    })

    //Yearly Subscription
    const checkoutButtonYearly = $('#checkout-button-yearly')
  
    checkoutButtonYearly.click(function () {
      const product = "yearly";
  
      fetch('/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product
        })
      })
        .then((result) => result.json())
        .then(({ sessionId }) => stripe.redirectToCheckout({ sessionId }))
    })
});