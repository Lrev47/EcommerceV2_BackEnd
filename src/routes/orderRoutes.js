// src/routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Create a new order
router.post("/", orderController.createOrder);

// Get all orders
router.get("/", orderController.getAllOrders);

// Get a single order by ID
router.get("/:orderId", orderController.getOrderById);

// Update an order by ID
router.put("/:orderId", orderController.updateOrder);

// Delete an order by ID
router.delete("/:orderId", orderController.deleteOrder);

// Get all orders for a specific user
router.get("/user/:userId", orderController.getOrdersByUser);

module.exports = router;
