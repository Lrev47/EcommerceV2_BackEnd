// src/middlewares/uploadMiddleware.js
const multer = require("multer");

// We don't want to store the file to disk, so use multer.memoryStorage()
const storage = multer.memoryStorage();

const upload = multer({ storage });
module.exports = upload;
