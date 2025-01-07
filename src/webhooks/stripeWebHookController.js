// src/webhooks/stripeWebHookController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Stripe recommends verifying the event's signature using the endpointSecret.
 * Make sure to set STRIPE_WEBHOOK_SECRET in your .env.
 */
exports.stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentSucceeded(event.data.object);
      break;
    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;
    // Add more event types as needed
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return response
  res.status(200).json({ received: true });
};

async function handlePaymentSucceeded(paymentIntent) {
  const stripePaymentIntentId = paymentIntent.id;

  // Find the Payment in your DB
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntent: stripePaymentIntentId },
    include: { order: true },
  });

  if (!payment) {
    console.warn(`Payment with intent ID ${stripePaymentIntentId} not found.`);
    return;
  }

  // Update payment and order status
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED" },
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "COMPLETED" },
    }),
  ]);
}

async function handlePaymentFailed(paymentIntent) {
  const stripePaymentIntentId = paymentIntent.id;
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntent: stripePaymentIntentId },
    include: { order: true },
  });

  if (!payment) {
    console.warn(`Payment with intent ID ${stripePaymentIntentId} not found.`);
    return;
  }

  // Mark as failed, keep the order in PENDING or CANCELLED, your choice
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PENDING" },
    }),
  ]);
}
