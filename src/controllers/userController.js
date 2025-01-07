// src/controllers/userController.js
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");

/**
 * In a real-world app, store your secret in an environment variable.
 * e.g., process.env.JWT_SECRET
 */
const JWT_SECRET = "SUPER_SECRET_KEY"; // For demonstration only!

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { firstName, lastName, username, email, password, role, gender } =
      req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newUser = await userService.registerUser({
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      gender,
    });

    // Hide the password in the response
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await userService.loginUser({ email, password });
    // Generate a JWT (optional, but common practice)
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return the user with token
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(401).json({ error: error.message });
  }
}

/**
 * Get all users
 */
async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    // Hide password in the response
    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
    return res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get a single user by ID
 */
async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update user
 */
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      userImageUrl,
      gender,
    } = req.body;

    // We could optionally do more validation here
    const updatedUser = await userService.updateUser(id, {
      firstName,
      lastName,
      username,
      email,
      password, // If provided, will be hashed in service
      userImageUrl,
      gender,
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(400).json({ error: error.message });
  }
}

/**
 * Delete user
 */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const deletedUser = await userService.deleteUser(id);

    const { password: _, ...userWithoutPassword } = deletedUser;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
