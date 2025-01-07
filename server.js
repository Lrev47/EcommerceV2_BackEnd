// server.js

require("dotenv").config(); // Loads environment variables from .env
const app = require("./app"); // Import the configured Express app

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
