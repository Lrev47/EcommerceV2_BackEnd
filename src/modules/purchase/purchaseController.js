// src/modules/purchase/purchaseController.js

const purchaseService = require("./purchaseService");

/**
 * Initiates a purchase (does not confirm if confirm=false).
 * Expects JSON body like:
 *  {
 *    "userId": 1,
 *    "paymentMethodId": "pm_xxx",
 *    "discountCode": "SUMMER2025",
 *    "shippingAddressId": 10
 *  }
 */
async function purchaseOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { userId, paymentMethodId, discountCode, shippingAddressId } =
      req.body;

    const result = await purchaseService.purchaseOrder({
      orderId,
      userId,
      paymentMethodId,
      discountCode,
      shippingAddressId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error purchasing order:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Confirm Payment (Server-Side)
 * Expects JSON body like:
 *  {
 *    "paymentId": 123,
 *    "paymentMethodId": "pm_xxx"
 *  }
 */
async function confirmPayment(req, res) {
  try {
    const { paymentId, paymentMethodId } = req.body;

    const result = await purchaseService.confirmPayment({
      paymentId,
      paymentMethodId,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error confirming payment:", error);
    return res.status(400).json({ error: error.message });
  }
}

module.exports = {
  purchaseOrder,
  confirmPayment,
};
