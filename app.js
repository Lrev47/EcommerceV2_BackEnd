// app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./src/routes");

// Create Express app
const app = express();

// ========== Middlewares ==========
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ========== Routes ==========
// Mount routes
app.use("/api", routes);

// Export the app (without listening)
module.exports = app;
