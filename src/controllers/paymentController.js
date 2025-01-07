// paymentController.js

const paymentService = require("../services/paymentService");

/**
 * Create a new payment
 * Expects body data like:
 *  {
 *    "orderId": 1,
 *    "userId": 2,
 *    "stripePaymentIntent": "pi_XXXXXXX",
 *    "amount": 49.99,
 *    "status": "REQUIRES_PAYMENT_METHOD"
 *  }
 */
async function createPayment(req, res) {
  try {
    const { orderId, userId, stripePaymentIntent, amount, status } = req.body;

    if (!orderId || !stripePaymentIntent || amount == null) {
      return res.status(400).json({
        error: "orderId, stripePaymentIntent, and amount are required fields.",
      });
    }

    const newPayment = await paymentService.createPayment({
      orderId: Number(orderId),
      userId: userId ? Number(userId) : null,
      stripePaymentIntent,
      amount: parseFloat(amount),
      status,
    });

    return res.status(201).json(newPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Get all payments
 *  - Typically for Admin use.
 */
async function getAllPayments(req, res) {
  try {
    const payments = await paymentService.getAllPayments();
    return res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching all payments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get a single payment by ID
 */
async function getPaymentById(req, res) {
  try {
    const { paymentId } = req.params;
    const payment = await paymentService.getPaymentById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    return res.status(200).json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update a payment (e.g. update status, or fix PaymentIntent ID if needed).
 *  Body example:
 *  {
 *    "status": "SUCCEEDED"
 *  }
 */
async function updatePayment(req, res) {
  try {
    const { paymentId } = req.params;
    const data = req.body; // e.g. { status: "SUCCEEDED" }

    const updatedPayment = await paymentService.updatePayment(paymentId, data);
    return res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Delete payment
 */
async function deletePayment(req, res) {
  try {
    const { paymentId } = req.params;
    const deleted = await paymentService.deletePayment(paymentId);

    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting payment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get all payments for a specific user
 */
async function getPaymentsByUser(req, res) {
  try {
    const { userId } = req.params;
    const userPayments = await paymentService.getPaymentsByUser(userId);
    return res.status(200).json(userPayments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get all payments for a specific order
 */
async function getPaymentsByOrder(req, res) {
  try {
    const { orderId } = req.params;
    const orderPayments = await paymentService.getPaymentsByOrder(orderId);
    return res.status(200).json(orderPayments);
  } catch (error) {
    console.error("Error fetching order payments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
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
