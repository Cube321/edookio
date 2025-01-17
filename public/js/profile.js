$(document).ready(function () {
  const PUBLISHABLE_KEY =
    "pk_live_51QdH1cGDjqk7CLaPEtcN4Gu9FCm693bAoGQP6ozyNlZVOlDNVgQBtSMKiivenzOTkYByHAE3Nh91d5c4GyYjfpsZ00vDD5yrHF";

  const stripe = Stripe(PUBLISHABLE_KEY);

  const manageBillingButton = $(".manage-billing-button");
  const customerID = $('input[name="customerID"]').val();

  manageBillingButton.click(function () {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customerID,
      }),
    };

    fetch("/billing", requestOptions)
      .then((response) => response.json())
      .then((result) => window.location.replace(result.url))
      .catch((error) => console.log("error", error));
  });
});
