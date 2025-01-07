// src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// CREATE
router.post("/", productController.createProduct);

// READ (all, single)
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// UPDATE
router.put("/:id", productController.updateProduct);

// DELETE
router.delete("/:id", productController.deleteProduct);

module.exports = router;
