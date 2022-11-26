    //cookies approval
		$("#btn-agree").on("click", function(){
			$.ajax({
				method: "GET",
				url: "/cookies-agreed"
			})
			.then(res => {
				$(".cookies-warning").addClass("d-none");
			})
			.catch(err => console.log(err));
		});

    $("#next-btn").click(function(){
      $("#loader").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
      $("#pageB").remove();
  })

  $("#pageB").scroll(function(){
      $(this).removeClass('text-gradient');
  })

$(document).ready(function() {
	const PUBLISHABLE_KEY = 'pk_test_51M7LRDAaRhuCsgZoSmUjyXiHbiKnXBc3g4YgwigzTCTfFpUMAB6NizhS3tL8WzxE9ICPRJl5Rzz6KiCJaxCVczwc00ZEs1F1zJ'
  
    const stripe = Stripe(
      PUBLISHABLE_KEY)

	//Stripe payment
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