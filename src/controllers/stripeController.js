// stripeController.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // or your sk_test_...

/**
 * Create PaymentIntent
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // the total you want to charge, in cents
    // In test mode, you can pass a small amount (like 500 for $5.00).

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // e.g. 500 for $5
      currency: "usd",
      // You can add metadata or description if needed
      metadata: { integration_check: "test_payment" },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(400).json({ error: error.message });
  }
};
