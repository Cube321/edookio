$(document).ready(function () {
    const PUBLISHABLE_KEY = 'pk_test_51M7LRDAaRhuCsgZoSmUjyXiHbiKnXBc3g4YgwigzTCTfFpUMAB6NizhS3tL8WzxE9ICPRJl5Rzz6KiCJaxCVczwc00ZEs1F1zJ'
  
    const stripe = Stripe(
      PUBLISHABLE_KEY)

    const checkoutButton = $('#checkout-button')
  
    checkoutButton.click(function () {
      const product = $('input[name="product"]:checked').val()
  
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
  })

  const manageBillingButton = $('#manage-billing-button')
  const customerID = $('input[name="customerID"]').val()

  manageBillingButton.click(function () {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: customerID
        })
      }

      fetch('/billing', requestOptions)
        .then((response) => response.json())
        .then((result) => window.location.replace(result.url))
        .catch((error) => console.log('error', error))
    })