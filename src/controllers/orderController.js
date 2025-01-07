// src/controllers/orderController.js

const orderService = require("../services/orderService");

/**
 * Create a new order
 */
async function createOrder(req, res) {
  try {
    // Expect body data: { userId, shippingAddressId, billingAddressId, items: [ { productId, quantity }, ... ] }
    const { userId, shippingAddressId, billingAddressId, items } = req.body;

    const newOrder = await orderService.createOrder({
      userId,
      shippingAddressId,
      billingAddressId,
      items,
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Get all orders
 *  - In a real app, you’d typically check if the user is ADMIN here.
 */
async function getAllOrders(req, res) {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get a single order by ID
 */
async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update order (e.g., update status, addresses)
 *  - Body could contain { status, shippingAddressId, billingAddressId }
 */
async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;
    const data = req.body; // e.g. { status: 'SHIPPED', shippingAddressId: ..., billingAddressId: ... }

    const updatedOrder = await orderService.updateOrder(orderId, data);
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Delete order
 */
async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    const deleted = await orderService.deleteOrder(orderId);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get orders by user ID (e.g., a user viewing their own orders)
 */
async function getOrdersByUser(req, res) {
  try {
    const { userId } = req.params;
    const orders = await orderService.getOrdersByUser(userId);
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
};
