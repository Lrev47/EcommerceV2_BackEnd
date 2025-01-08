//src/routes/index.js

const express = require("express");
const router = express.Router();
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");
const orderRoutes = require("./orderRoutes");
const reviewRoutes = require("./reviewRoutes");
const paymentRoutes = require("./paymentRoutes");
const addressRoutes = require("./addressRoutes");
const stripeRoutes = require("./stripeRoutes.js");

router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/orders", orderRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);
router.use("/addresses", addressRoutes);
router.use("/stripe", stripeRoutes);

module.exports = router;
