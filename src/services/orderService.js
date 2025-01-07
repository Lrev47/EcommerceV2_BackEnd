// src/services/orderService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new order
 *  - userId: ID of the user placing the order
 *  - shippingAddressId: (optional) shipping address ID
 *  - billingAddressId: (optional) billing address ID
 *  - items: array of { productId, quantity }
 *      Example: [ { productId: 1, quantity: 2 }, { productId: 5, quantity: 1 } ]
 */
async function createOrder({
  userId,
  shippingAddressId,
  billingAddressId,
  items,
}) {
  // Validate inputs
  if (!userId || !items || !items.length) {
    throw new Error("User ID and at least one order item are required.");
  }

  // Calculate total and prepare OrderItem data
  let total = 0;
  const orderItemsData = [];

  // Fetch product price for each item, compute line total
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found.`);
    }

    // Calculate price for this item
    const lineTotal = product.price * item.quantity;
    total += lineTotal;

    orderItemsData.push({
      quantity: item.quantity,
      price: product.price, // Store the product price at the time of order
      productId: item.productId,
    });
  }

  // Create the order and associated order items in a transaction
  const createdOrder = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        shippingAddressId,
        billingAddressId,
        total,
        // Set status to PENDING by default as defined in schema
      },
    });

    // Insert order items
    const createdOrderItems = [];
    for (const orderItemData of orderItemsData) {
      const newOrderItem = await tx.orderItem.create({
        data: {
          ...orderItemData,
          orderId: newOrder.id,
        },
      });
      createdOrderItems.push(newOrderItem);
    }

    // Return the order with items included
    return {
      ...newOrder,
      orderItems: createdOrderItems,
    };
  });

  return createdOrder;
}

/**
 * Get all orders
 *  - Admins might use this to see all orders
 *  - For normal users, you might filter by userId
 */
async function getAllOrders() {
  // Include related data if desired (e.g., orderItems, addresses, etc.)
  const orders = await prisma.order.findMany({
    include: {
      orderItems: true,
      shippingAddress: true,
      billingAddress: true,
      user: true,
    },
  });
  return orders;
}

/**
 * Get a single order by ID
 */
async function getOrderById(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: {
      orderItems: {
        include: { product: true },
      },
      shippingAddress: true,
      billingAddress: true,
      user: true,
      payments: true,
    },
  });
  return order;
}

/**
 * Update an order
 *  - Commonly used to update status, shipping address, or billing address.
 *  - Potentially could add logic for adding/removing items or recalc total.
 */
async function updateOrder(orderId, data) {
  // If updating items, you’d handle that separately or in a transaction.
  // For now, assume we're only updating top-level fields (status, addresses).
  const updatedOrder = await prisma.order.update({
    where: { id: Number(orderId) },
    data,
    include: {
      orderItems: true,
      shippingAddress: true,
      billingAddress: true,
    },
  });
  return updatedOrder;
}

/**
 * Delete an order (hard delete)
 *  - Typically you'd only allow this if the order is in a cancellable state
 *    or hasn't been processed yet.
 */
async function deleteOrder(orderId) {
  // This also deletes all related orderItems via onDelete=cascade if configured in Prisma
  // If not, you might need to manually delete the order items.
  const deletedOrder = await prisma.order.delete({
    where: { id: Number(orderId) },
  });
  return deletedOrder;
}

/**
 * Get all orders for a specific user
 */
async function getOrdersByUser(userId) {
  const userOrders = await prisma.order.findMany({
    where: { userId: Number(userId) },
    include: {
      orderItems: {
        include: { product: true },
      },
      shippingAddress: true,
      billingAddress: true,
      payments: true,
    },
  });
  return userOrders;
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
};
