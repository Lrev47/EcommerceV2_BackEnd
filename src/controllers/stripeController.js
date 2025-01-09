// stripeController.js
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // or your sk_test_...

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // Create PaymentIntent with automatic_payment_methods for PaymentElement
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      // optional metadata:
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
