$(document).ready(function () {
    
  const PUBLISHABLE_KEY = 'pk_live_51M7LRDAaRhuCsgZolxnaCehFzl4FEpRIZkekLrpl73qisyaDz7Fo5fwlQ3Pfh5Kc14191BPy3k9zxVwBbgB1kNtJ00TFIm1DaS'
  const PUBLISHABLE_KEY_DEV = 'pk_test_51M7LRDAaRhuCsgZoSmUjyXiHbiKnXBc3g4YgwigzTCTfFpUMAB6NizhS3tL8WzxE9ICPRJl5Rzz6KiCJaxCVczwc00ZEs1F1zJ'
  
    const stripe = Stripe(
      PUBLISHABLE_KEY)

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
  })