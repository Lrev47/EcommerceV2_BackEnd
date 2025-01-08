const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripeController");

// POST /api/payments/create-payment-intent
router.post("/create-payment-intent", stripeController.createPaymentIntent);

module.exports = router;
