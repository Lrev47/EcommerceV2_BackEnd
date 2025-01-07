// addressController.js
const addressService = require("../services/addressService");

/**
 * Create a new Address
 * Expects body data like:
 *  {
 *    "userId": 1,
 *    "label": "Work",
 *    "address1": "456 7th Ave",
 *    "address2": "Suite 200",
 *    "city": "San Francisco",
 *    "state": "CA",
 *    "zipcode": "94103",
 *    "country": "USA"
 *  }
 */
async function createAddress(req, res) {
  try {
    const data = req.body;
    const newAddress = await addressService.createAddress(data);
    return res.status(201).json(newAddress);
  } catch (error) {
    console.error("Error creating address:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Get all addresses
 * For admin use or debugging
 */
async function getAllAddresses(req, res) {
  try {
    const addresses = await addressService.getAllAddresses();
    return res.status(200).json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get address by ID
 */
async function getAddressById(req, res) {
  try {
    const { addressId } = req.params;
    const address = await addressService.getAddressById(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    return res.status(200).json(address);
  } catch (error) {
    console.error("Error fetching address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update address
 * Body can contain fields like { label, address1, address2, city, state, zipcode, country }
 */
async function updateAddress(req, res) {
  try {
    const { addressId } = req.params;
    const data = req.body;
    const updated = await addressService.updateAddress(addressId, data);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating address:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Delete address
 */
async function deleteAddress(req, res) {
  try {
    const { addressId } = req.params;
    const deleted = await addressService.deleteAddress(addressId);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get addresses by user ID
 */
async function getAddressesByUser(req, res) {
  try {
    const { userId } = req.params;
    const userAddresses = await addressService.getAddressesByUser(userId);
    return res.status(200).json(userAddresses);
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAddressesByUser,
};
