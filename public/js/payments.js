$(document).ready(function() {
	const PUBLISHABLE_KEY = 'pk_live_51M7LRDAaRhuCsgZolxnaCehFzl4FEpRIZkekLrpl73qisyaDz7Fo5fwlQ3Pfh5Kc14191BPy3k9zxVwBbgB1kNtJ00TFIm1DaS'
  const PUBLISHABLE_KEY_DEV = 'pk_test_51M7LRDAaRhuCsgZoSmUjyXiHbiKnXBc3g4YgwigzTCTfFpUMAB6NizhS3tL8WzxE9ICPRJl5Rzz6KiCJaxCVczwc00ZEs1F1zJ'

    const stripe = Stripe(
      PUBLISHABLE_KEY_DEV)

	//Stripe payment
  //TEST DAILY
  
  const checkoutButtonDaily = $('#checkout-button-daily')
  
  checkoutButtonDaily.click(function (e) {
    e.preventDefault();
    $(this).addClass("disabled");
    $(this).empty();
    $(this).append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
    
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
  
  

  //Monthly Subscription
	const checkoutButtonMonthly = $('#checkout-button-monthly')
  
    checkoutButtonMonthly.click(function (e) {
      e.preventDefault();
      $(this).addClass("disabled");
      $(this).empty();
      $(this).append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
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

    //Halfyear Subscription
    const checkoutButtonHalfyear = $('#checkout-button-halfyear')
    
    checkoutButtonHalfyear.click(function (e) {
      e.preventDefault();
      $(this).addClass("disabled");
      $(this).empty();
      $(this).append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
      const product = "halfyear";

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
  
    checkoutButtonYearly.click(function (e) {
      e.preventDefault();
      $(this).addClass("disabled");
      $(this).empty();
      $(this).append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
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