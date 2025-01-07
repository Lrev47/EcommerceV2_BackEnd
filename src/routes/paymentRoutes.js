// paymentRoutes.js

const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Create a new payment
router.post("/", paymentController.createPayment);

// Get all payments
router.get("/", paymentController.getAllPayments);

// Get a single payment by ID
router.get("/:paymentId", paymentController.getPaymentById);

// Update a payment by ID
router.put("/:paymentId", paymentController.updatePayment);

// Delete a payment by ID
router.delete("/:paymentId", paymentController.deletePayment);

// Get all payments for a specific user
router.get("/user/:userId", paymentController.getPaymentsByUser);

// Get all payments for a specific order
router.get("/order/:orderId", paymentController.getPaymentsByOrder);

module.exports = router;
