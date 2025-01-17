$(document).ready(function () {
  const PUBLISHABLE_KEY =
    "pk_live_51QdH1cGDjqk7CLaPEtcN4Gu9FCm693bAoGQP6ozyNlZVOlDNVgQBtSMKiivenzOTkYByHAE3Nh91d5c4GyYjfpsZ00vDD5yrHF";

  const stripe = Stripe(PUBLISHABLE_KEY);

  //Stripe payment
  //Monthly Subscription
  const checkoutButtonMonthly = $("#checkout-button-monthly");

  checkoutButtonMonthly.click(function (e) {
    e.preventDefault();
    $(this).addClass("disabled");
    $(this).empty();
    $(this).append(
      "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>"
    );
    const product = "monthly";

    fetch("/payment/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
      }),
    })
      .then((result) => result.json())
      .then(({ sessionId }) => stripe.redirectToCheckout({ sessionId }));
  });

  //Yearly Subscription
  const checkoutButtonYearly = $("#checkout-button-yearly");

  checkoutButtonYearly.click(function (e) {
    e.preventDefault();
    $(this).addClass("disabled");
    $(this).empty();
    $(this).append(
      "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>"
    );
    const product = "yearly";

    fetch("/payment/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
      }),
    })
      .then((result) => result.json())
      .then(({ sessionId }) => stripe.redirectToCheckout({ sessionId }));
  });
});
