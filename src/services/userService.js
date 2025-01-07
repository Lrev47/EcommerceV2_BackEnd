// src/services/userService.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

/**
 * Register a new user
 */
async function registerUser({
  firstName,
  lastName,
  username,
  email,
  password,
  role,
  gender,
}) {
  // Check if user with same email or username already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new Error("Email or username already in use");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role, // defaults to "USER" if not provided
      gender, // optional
    },
  });

  return newUser;
}

/**
 * Login a user
 */
async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare the input password with the stored (hashed) password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
}

/**
 * Get all users
 */
async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

/**
 * Get a single user by ID
 */
async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  return user;
}

/**
 * Update user
 */
async function updateUser(id, data) {
  // If password is being updated, hash it
  if (data.password) {
    data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data,
  });
  return updatedUser;
}

/**
 * Delete user
 */
async function deleteUser(id) {
  const deletedUser = await prisma.user.delete({
    where: { id: Number(id) },
  });
  return deletedUser;
}

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
