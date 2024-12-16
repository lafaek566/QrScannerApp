const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  validateToken,
} = require("../controllers/adminController");

const router = express.Router();

// Register route
router.post("/register", registerAdmin);

// Login route
router.post("/login", loginAdmin);

// Validate token route
router.get("/validate", validateToken); // Token validation

module.exports = router;
