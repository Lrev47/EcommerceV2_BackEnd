// reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// Create a new review
router.post("/", reviewController.createReview);

// Get all reviews (admin or debugging use)
router.get("/", reviewController.getAllReviews);

// Get all reviews for a specific product
router.get("/product/:productId", reviewController.getReviewsByProduct);

// Get all reviews by a specific user
router.get("/user/:userId", reviewController.getReviewsByUser);

// Get a single review by ID
router.get("/:reviewId", reviewController.getReview);

// Update a single review by ID
router.put("/:reviewId", reviewController.updateReview);

// Delete a single review by ID
router.delete("/:reviewId", reviewController.deleteReview);

module.exports = router;
