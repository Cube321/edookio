const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const addNewCustomer = async (email) => {
  const customer = await Stripe.customers.create({
    email,
    description: "New Customer",
  });

  return customer;
};

const getCustomerByID = async (id) => {
  const customer = await Stripe.customers.retrieve(id);
  return customer;
};

const createCheckoutSession = async (customer, price) => {
  const session = await Stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer,
    allow_promotion_codes: true,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],

    success_url: `${process.env.DOMAIN}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN}/payment/failed`,
  });

  return session;
};

const createWebhook = (rawBody, sig) => {
  const event = Stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  return event;
};

const createBillingSession = async (customer) => {
  const session = await Stripe.billingPortal.sessions.create({
    customer,
    return_url: `${process.env.DOMAIN}`,
  });
  return session;
};

module.exports = {
  addNewCustomer,
  getCustomerByID,
  createCheckoutSession,
  createWebhook,
  createBillingSession,
};
