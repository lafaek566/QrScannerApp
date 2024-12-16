require("dotenv").config(); // Load environment variables from .env file

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' folder

// Route setup
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
