// src/controllers/productController.js
const productService = require("../services/productService");

/**
 * Create a new product
 */
async function createProduct(req, res) {
  try {
    const {
      name,
      category,
      price,
      quantity,
      imageUrl,
      rating,
      description,
      prompt,
    } = req.body;

    // Basic validation
    if (!name || !category || price == null) {
      return res
        .status(400)
        .json({ error: "Name, category, and price are required." });
    }

    const data = {
      name,
      category,
      price: parseFloat(price),
      quantity: quantity ? parseInt(quantity, 10) : 0,
      imageUrl,
      rating: rating ? parseFloat(rating) : null,
      description,
      prompt,
    };

    const newProduct = await productService.createProduct(data);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get all products
 */
async function getAllProducts(req, res) {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get a single product by ID
 */
async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update a product
 */
async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      price,
      quantity,
      imageUrl,
      rating,
      description,
      prompt,
    } = req.body;

    // Basic validation
    if (!name || !category || price == null) {
      return res
        .status(400)
        .json({ error: "Name, category, and price are required." });
    }

    const data = {
      name,
      category,
      price: parseFloat(price),
      quantity: quantity ? parseInt(quantity, 10) : 0,
      imageUrl,
      rating: rating ? parseFloat(rating) : null,
      description,
      prompt,
    };

    const updatedProduct = await productService.updateProduct(id, data);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Delete a product
 */
async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deletedProduct = await productService.deleteProduct(id);
    return res.status(200).json(deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
