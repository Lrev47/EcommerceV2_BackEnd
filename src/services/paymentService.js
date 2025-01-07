// paymentService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a payment record
 * - Typically this happens when a user begins a checkout or a purchase flow.
 */
async function createPayment({
  orderId,
  userId,
  stripePaymentIntent,
  amount,
  status,
}) {
  // Basic validation (optional). You might also check if order exists, etc.
  if (!orderId || !stripePaymentIntent || !amount) {
    throw new Error(
      "orderId, stripePaymentIntent, and amount are required fields."
    );
  }

  const newPayment = await prisma.payment.create({
    data: {
      orderId,
      userId, // can be null if not provided
      stripePaymentIntent,
      amount,
      status, // defaults to REQUIRES_PAYMENT_METHOD if not provided
    },
  });

  return newPayment;
}

/**
 * Get all payments (for admin, or for debugging).
 */
async function getAllPayments() {
  const payments = await prisma.payment.findMany({
    include: {
      order: true,
      user: true,
    },
  });
  return payments;
}

/**
 * Get a single payment by ID
 */
async function getPaymentById(paymentId) {
  const payment = await prisma.payment.findUnique({
    where: { id: Number(paymentId) },
    include: {
      order: true,
      user: true,
    },
  });
  return payment;
}

/**
 * Update a payment
 * - Commonly used for updating the status (e.g. from REQUIRES_ACTION to SUCCEEDED).
 * - Or if you want to update the `stripePaymentIntent` reference.
 */
async function updatePayment(paymentId, data) {
  const updatedPayment = await prisma.payment.update({
    where: { id: Number(paymentId) },
    data,
    include: {
      order: true,
      user: true,
    },
  });
  return updatedPayment;
}

/**
 * Delete a payment (hard delete)
 * - Typically you'd be cautious about deleting payment records, but here it is for completeness.
 */
async function deletePayment(paymentId) {
  const deletedPayment = await prisma.payment.delete({
    where: { id: Number(paymentId) },
  });
  return deletedPayment;
}

/**
 * Get all payments for a specific user
 */
async function getPaymentsByUser(userId) {
  const userPayments = await prisma.payment.findMany({
    where: { userId: Number(userId) },
    include: {
      order: true,
      user: true,
    },
  });
  return userPayments;
}

/**
 * Get payments by order
 */
async function getPaymentsByOrder(orderId) {
  const orderPayments = await prisma.payment.findMany({
    where: { orderId: Number(orderId) },
    include: {
      order: true,
      user: true,
    },
  });
  return orderPayments;
}

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByUser,
  getPaymentsByOrder,
};
