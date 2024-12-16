const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Route to get all users
router.get("/", userController.getAllUsers);

// Route to get a user by ID
router.get("/:id", userController.getUserById);

// Route to create a new user
router.post("/", userController.createUser);

// Route to update user details
router.put("/:id", userController.updateUser);

// Route to delete a user
router.delete("/:id", userController.deleteUser);

// Route to validate a QR code
router.post("/validate-qr/:qrCode", userController.validateQrCode);

module.exports = router;
