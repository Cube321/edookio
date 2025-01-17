$(document).ready(function () {
  const PUBLISHABLE_KEY_DEV =
    "pk_test_51QdH1cGDjqk7CLaPRsUMwncOPMKXlWp1ymO2sacIU1AyQJQWXA9haJkDa05tpBq1YnPbEaeOUgSNMy5Yt2BBmrkv00Uf6Suluo";

  const stripe = Stripe(PUBLISHABLE_KEY_DEV);

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
