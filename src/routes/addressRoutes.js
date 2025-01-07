// addressRoutes.js
const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

/**
 * Create a new address
 * POST /api/addresses
 */
router.post("/", addressController.createAddress);

/**
 * Get all addresses
 * GET /api/addresses
 */
router.get("/", addressController.getAllAddresses);

/**
 * Get address by ID
 * GET /api/addresses/:addressId
 */
router.get("/:addressId", addressController.getAddressById);

/**
 * Update an address by ID
 * PUT /api/addresses/:addressId
 */
router.put("/:addressId", addressController.updateAddress);

/**
 * Delete an address by ID
 * DELETE /api/addresses/:addressId
 */
router.delete("/:addressId", addressController.deleteAddress);

/**
 * Get all addresses for a specific user
 * GET /api/addresses/user/:userId
 */
router.get("/user/:userId", addressController.getAddressesByUser);

module.exports = router;
