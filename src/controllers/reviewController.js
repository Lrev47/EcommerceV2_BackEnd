// reviewController.js
const reviewService = require("../services/reviewService");

/**
 * Create a new Review
 * Expects body data like:
 * {
 *   "userId": 1,
 *   "productId": 5,
 *   "starRating": 4,
 *   "comment": "My thoughts on this product..."
 * }
 */
async function createReview(req, res) {
  try {
    const { userId, productId, starRating, comment } = req.body;

    // Basic validation
    if (!userId || !productId || starRating == null) {
      return res
        .status(400)
        .json({ error: "userId, productId, and starRating are required." });
    }

    // If needed, you might do additional checks (e.g. user purchased product, starRating range).
    // For now, we rely on the DB constraint to handle duplicates.

    const review = await reviewService.createReview({
      userId,
      productId,
      starRating: Number(starRating),
      comment,
    });
    return res.status(201).json(review);
  } catch (error) {
    // If it's a Prisma unique constraint error, we can handle gracefully
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "User has already reviewed this product." });
    }

    console.error("Error creating review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get all reviews
 *  - Typically for admin or debugging.
 */
async function getAllReviews(req, res) {
  try {
    const reviews = await reviewService.getAllReviews();
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get reviews by product ID
 */
async function getReviewsByProduct(req, res) {
  try {
    const { productId } = req.params;
    const reviews = await reviewService.getReviewsByProduct(productId);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by product:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get reviews by user ID
 */
async function getReviewsByUser(req, res) {
  try {
    const { userId } = req.params;
    const reviews = await reviewService.getReviewsByUser(userId);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get a single review by ID
 */
async function getReview(req, res) {
  try {
    const { reviewId } = req.params;
    const review = await reviewService.getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update a review
 *  - body could contain { starRating, comment }
 */
async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { starRating, comment } = req.body;

    // Basic validation if you want:
    // if (starRating < 1 || starRating > 5) { ... }

    const updated = await reviewService.updateReview(reviewId, {
      starRating,
      comment,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Delete a review
 */
async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const deleted = await reviewService.deleteReview(reviewId);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  getReviewsByUser,
  getReview,
  updateReview,
  deleteReview,
};
