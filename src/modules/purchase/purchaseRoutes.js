// src/modules/purchase/purchaseRoutes.js

const express = require("express");
const router = express.Router();
const purchaseController = require("./purchaseController");

/**
 * POST /api/purchase/:orderId
 * Initiates purchase flow for the specified order.
 */
router.post("/:orderId", purchaseController.purchaseOrder);

/**
 * POST /api/purchase/confirm
 * Confirms the payment server-side.
 */
router.post("/confirm", purchaseController.confirmPayment);

module.exports = router;
