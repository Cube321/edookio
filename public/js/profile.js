$(document).ready(function () {
  const PUBLISHABLE_KEY =
    "pk_test_51QdH1cGDjqk7CLaPRsUMwncOPMKXlWp1ymO2sacIU1AyQJQWXA9haJkDa05tpBq1YnPbEaeOUgSNMy5Yt2BBmrkv00Uf6Suluo";

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
