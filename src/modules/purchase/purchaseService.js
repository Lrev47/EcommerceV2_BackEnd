// src/modules/purchase/purchaseService.js

const { PrismaClient } = require("@prisma/client");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

// Suppose you have specialized services for discounts, taxes, and shipping:
const discountService = require("../discount/discountService");
const shippingService = require("../shipping/shippingService");
const taxService = require("../tax/taxService");
// Or keep them in the same file if they're small

// -------------- Advanced Purchase Flow --------------
/**
 * 1) Validate the order (ownership, status).
 * 2) Check inventory for each item.
 * 3) Apply discount code (optional).
 * 4) Calculate tax (optional).
 * 5) Calculate shipping (optional).
 * 6) Create or update Payment record.
 * 7) Create Stripe PaymentIntent.
 * 8) Return PaymentIntent client_secret or confirm server-side.
 */
async function purchaseOrder({
  orderId,
  userId,
  paymentMethodId,
  discountCode, // e.g. "SUMMER2025"
  shippingAddressId, // If you recalc shipping cost
}) {
  // 1. Fetch order
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      orderItems: {
        include: { product: true },
      },
      user: true,
      payments: true,
    },
  });

  if (!order) {
    throw new Error(`Order with ID ${orderId} not found.`);
  }

  // Must belong to user or the user must be an admin (your choice):
  if (order.userId !== Number(userId)) {
    // Alternatively, check user role if ADMIN can purchase for others
    throw new Error("You do not have permission to purchase this order.");
  }

  // Check order status
  if (["COMPLETED", "CANCELLED", "REFUNDED"].includes(order.status)) {
    throw new Error(`Order is in status ${order.status}. Cannot purchase.`);
  }

  // 2. Check inventory
  for (const item of order.orderItems) {
    const product = item.product;
    if (!product.inStock || product.quantity < item.quantity) {
      throw new Error(
        `Product ${product.name} does not have enough stock. Required: ${item.quantity}, In stock: ${product.quantity}`
      );
    }
  }

  // 3. Calculate base total (line items)
  let subtotal = 0;
  order.orderItems.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  // 4. Apply discount if applicable
  let discount = 0;
  if (discountCode) {
    discount = await discountService.getDiscountAmount(discountCode, subtotal);
    // e.g. if discount is 10% of subtotal or a flat amount
    subtotal = Math.max(0, subtotal - discount);
  }

  // 5. Calculate shipping cost (optional)
  let shippingCost = 0;
  if (shippingAddressId) {
    // Possibly recalc shipping based on address (domestic vs. international).
    shippingCost = await shippingService.getShippingCost(shippingAddressId);
  }

  // 6. Calculate tax
  const tax = await taxService.calculateTax(subtotal + shippingCost);

  // 7. Final total
  const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

  // 8. Create or update Payment record in DB
  //    If order has an existing Payment in progress, you might update it.
  //    For simplicity, we’ll create a new Payment each time.
  const newPayment = await prisma.payment.create({
    data: {
      orderId: order.id,
      userId: order.userId,
      amount: total,
      status: "REQUIRES_PAYMENT_METHOD", // from your PaymentStatus enum
    },
  });

  // 9. Create Stripe PaymentIntent
  //    Note: If the user might need 3D Secure, we set confirm=false and let the front-end confirm.
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // in cents
    currency: "usd",
    payment_method: paymentMethodId,
    confirm: false, // front-end confirmation or server-side
    capture_method: "automatic", // or 'manual' if you want to capture funds later
    metadata: {
      orderId: order.id.toString(),
      paymentId: newPayment.id.toString(),
      userId: userId.toString(),
    },
  });

  // Update the Payment record with the PaymentIntent ID
  await prisma.payment.update({
    where: { id: newPayment.id },
    data: {
      stripePaymentIntent: paymentIntent.id,
      status: "REQUIRES_ACTION", // or keep it as REQUIRES_ACTION
    },
  });

  // Optionally update the Order’s status to something like "PROCESSING_PAYMENT"
  // so you know payment is in progress
  await prisma.order.update({
    where: { id: order.id },
    data: {
      total, // update the final total
      status: "PENDING", // or "PROCESSING_PAYMENT"
    },
  });

  // Return relevant info to the frontend
  return {
    paymentId: newPayment.id,
    paymentIntentClientSecret: paymentIntent.client_secret,
    amount: total,
    discount,
    shippingCost,
    tax,
  };
}

/**
 * Server-side confirm example (if you don't do front-end confirmation)
 * or if you want to handle 3D Secure with custom flows.
 */
async function confirmPayment({ paymentId, paymentMethodId }) {
  const payment = await prisma.payment.findUnique({
    where: { id: Number(paymentId) },
    include: {
      order: true,
    },
  });

  if (!payment) {
    throw new Error(`Payment with ID ${paymentId} not found.`);
  }

  if (!payment.stripePaymentIntent) {
    throw new Error("No Stripe PaymentIntent associated with this payment.");
  }

  // Confirm on Stripe
  const paymentIntent = await stripe.paymentIntents.confirm(
    payment.stripePaymentIntent,
    {
      payment_method: paymentMethodId,
    }
  );

  // Check the resulting status
  let newStatus;
  let orderStatus = payment.order.status;

  switch (paymentIntent.status) {
    case "succeeded":
      newStatus = "SUCCEEDED";
      orderStatus = "COMPLETED";
      break;
    case "requires_action":
      newStatus = "REQUIRES_ACTION";
      orderStatus = "PENDING";
      break;
    case "requires_payment_method":
      newStatus = "REQUIRES_PAYMENT_METHOD";
      orderStatus = "PENDING";
      break;
    case "processing":
      newStatus = "PROCESSING";
      orderStatus = "PENDING";
      break;
    case "canceled":
      newStatus = "CANCELED";
      orderStatus = "CANCELLED";
      break;
    default:
      newStatus = "FAILED";
      orderStatus = "PENDING";
  }

  // Update DB
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
      },
    }),
    prisma.order.update({
      where: { id: payment.orderId },
      data: {
        status: orderStatus,
      },
    }),
  ]);

  return { paymentIntentStatus: paymentIntent.status, newStatus, orderStatus };
}

module.exports = {
  purchaseOrder,
  confirmPayment,
};
