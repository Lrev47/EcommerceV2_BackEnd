// stripeController.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // e.g. sk_test_...

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // DO NOT use automatic_payment_methods
    // Instead, specify an array of payment_method_types that includes "card"
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"], // critical
      // optional metadata
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
