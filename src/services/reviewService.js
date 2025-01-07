// reviewService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create a review
 * @param {number} userId
 * @param {number} productId
 * @param {number} starRating
 * @param {string} [comment]
 */
async function createReview({ userId, productId, starRating, comment }) {
  // starRating can be 1 to 5 (or whatever range you prefer).
  // You might validate that here before creating.

  // If you rely on the schema constraint @@unique([userId, productId]),
  // any attempt to create a duplicate will throw a Prisma error.
  // We can catch that and throw a friendlier message if needed.
  const newReview = await prisma.review.create({
    data: {
      userId,
      productId,
      starRating,
      comment,
    },
  });

  return newReview;
}

/**
 * Get all reviews (optionally, you might want a pagination or filtering approach)
 */
async function getAllReviews() {
  const reviews = await prisma.review.findMany({
    include: {
      user: true, // fetch user info
      product: true, // fetch product info
    },
  });
  return reviews;
}

/**
 * Get reviews by Product ID
 */
async function getReviewsByProduct(productId) {
  const reviews = await prisma.review.findMany({
    where: { productId: Number(productId) },
    include: {
      user: true,
      product: true,
    },
  });
  return reviews;
}

/**
 * Get reviews by User ID
 */
async function getReviewsByUser(userId) {
  const reviews = await prisma.review.findMany({
    where: { userId: Number(userId) },
    include: {
      user: true,
      product: true,
    },
  });
  return reviews;
}

/**
 * Get a single review by ID
 */
async function getReviewById(reviewId) {
  const review = await prisma.review.findUnique({
    where: { id: Number(reviewId) },
    include: {
      user: true,
      product: true,
    },
  });
  return review;
}

/**
 * Update a review
 * - Only starRating or comment is likely to change.
 */
async function updateReview(reviewId, data) {
  const { starRating, comment } = data;
  const updatedReview = await prisma.review.update({
    where: { id: Number(reviewId) },
    data: {
      starRating,
      comment,
      updatedAt: new Date(), // not strictly necessary, Prisma @updatedAt is automatic
    },
    include: {
      user: true,
      product: true,
    },
  });
  return updatedReview;
}

/**
 * Delete a review
 */
async function deleteReview(reviewId) {
  const deletedReview = await prisma.review.delete({
    where: { id: Number(reviewId) },
  });
  return deletedReview;
}

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  getReviewsByUser,
  getReviewById,
  updateReview,
  deleteReview,
};
