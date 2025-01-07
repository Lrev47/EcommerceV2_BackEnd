// src/services/productService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a new product
 */
async function createProduct(data) {
  const newProduct = await prisma.product.create({
    data,
  });
  return newProduct;
}

/**
 * Get all products
 */
async function getAllProducts() {
  const products = await prisma.product.findMany();
  return products;
}

/**
 * Get a single product by ID
 */
async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  return product;
}

/**
 * Update a product
 */
async function updateProduct(id, data) {
  const updatedProduct = await prisma.product.update({
    where: { id: Number(id) },
    data,
  });
  return updatedProduct;
}

/**
 * Delete a product
 */
async function deleteProduct(id) {
  const deletedProduct = await prisma.product.delete({
    where: { id: Number(id) },
  });
  return deletedProduct;
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
