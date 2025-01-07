// addressService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new address
 * @param {Object} data
 *  Example:
 *    {
 *      userId: 1,
 *      label: "Home",
 *      address1: "123 Main St",
 *      address2: "Apt 4B",
 *      city: "New York",
 *      state: "NY",
 *      zipcode: "10001",
 *      country: "USA"
 *    }
 */
async function createAddress(data) {
  // Basic validation could go here, or in the controller
  if (
    !data.userId ||
    !data.address1 ||
    !data.city ||
    !data.zipcode ||
    !data.country
  ) {
    throw new Error(
      "Missing required fields: userId, address1, city, zipcode, country"
    );
  }

  const newAddress = await prisma.address.create({
    data,
  });
  return newAddress;
}

/**
 * Get all addresses (ADMIN or debugging use)
 */
async function getAllAddresses() {
  const addresses = await prisma.address.findMany({
    include: {
      user: true, // fetch the associated user if needed
    },
  });
  return addresses;
}

/**
 * Get address by ID
 */
async function getAddressById(addressId) {
  const address = await prisma.address.findUnique({
    where: { id: Number(addressId) },
    include: {
      user: true,
    },
  });
  return address;
}

/**
 * Update an address
 */
async function updateAddress(addressId, data) {
  // e.g. update label, city, state, etc.
  const updated = await prisma.address.update({
    where: { id: Number(addressId) },
    data,
    include: {
      user: true,
    },
  });
  return updated;
}

/**
 * Delete an address
 */
async function deleteAddress(addressId) {
  const deleted = await prisma.address.delete({
    where: { id: Number(addressId) },
  });
  return deleted;
}

/**
 * Get all addresses for a specific user
 */
async function getAddressesByUser(userId) {
  const userAddresses = await prisma.address.findMany({
    where: { userId: Number(userId) },
    include: {
      user: true,
    },
  });
  return userAddresses;
}

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  getAddressesByUser,
};
