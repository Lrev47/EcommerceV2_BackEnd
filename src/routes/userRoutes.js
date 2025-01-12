// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");


// Register
router.post("/register", upload.single("userImage"), userController.register);
// Login
router.post("/login", userController.login);

// Get all users
router.get("/", userController.getAllUsers);

// Get one user by ID
router.get("/:id", userController.getUser);

// Update user
router.put("/:id", userController.updateUser);

// Delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
