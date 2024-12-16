const path = require("path");
const qrcode = require("qrcode");
const UserModel = require("../models/userModel");

// Get all users
const getAllUsers = (req, res) => {
  UserModel.getAllUsers((err, results) => {
    if (err) {
      res.status(500).json({ message: "Error fetching users", error: err });
    } else {
      res.status(200).json(results);
    }
  });
};

// Get user by ID
const getUserById = (req, res) => {
  const userId = req.params.id;
  UserModel.getUserById(userId, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error fetching user", error: err });
    } else {
      res.status(200).json(result);
    }
  });
};

// Create a new user
const createUser = (req, res) => {
  const { name, phone_number, address } = req.body;

  if (!name || !phone_number) {
    return res
      .status(400)
      .json({ message: "Name and Phone number are required." });
  }

  UserModel.getUserByPhoneNumber(phone_number, (err, existingUser) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error checking user", error: err });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Phone number already registered." });
    }

    const qrCodeFileName = `qrcode_${Date.now()}.png`;
    const qrCodeFilePath = path.join(
      __dirname,
      "../public/qr_codes",
      qrCodeFileName
    );

    qrcode.toFile(
      qrCodeFilePath,
      `Name: ${name}, Phone: ${phone_number}`,
      (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error generating QR code", error: err });
        }

        const qrCodeUrl = `/qr_codes/${qrCodeFileName}`;

        const userData = { name, phone_number, address, qr_code: qrCodeUrl };

        UserModel.createUser(userData, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error creating user", error: err });
          }
          res
            .status(200)
            .json({ message: "User created successfully", qr_code: qrCodeUrl });
        });
      }
    );
  });
};

// Update user details
const updateUser = (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  UserModel.updateUser(userId, userData, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error updating user", error: err });
    } else {
      res.status(200).json({ message: "User updated successfully", result });
    }
  });
};

// Delete user
const deleteUser = (req, res) => {
  const userId = req.params.id;
  UserModel.deleteUser(userId, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error deleting user", error: err });
    } else {
      res.status(200).json({ message: "User deleted successfully", result });
    }
  });
};

// Validate QR Code
const validateQrCode = (req, res) => {
  const qrCode = req.params.qrCode;

  // Check if qrCode is provided
  if (!qrCode) {
    return res.status(400).json({
      success: false,
      message: "QR Code is required.",
    });
  }

  // Use the UserModel to fetch the user by QR code
  UserModel.getUserByQrCode(qrCode, (err, users) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error validating QR Code",
        error: err,
      });
    }

    // If no user is found
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "QR Code is invalid or does not match any user.",
      });
    }

    // If user is found, return success response
    const user = users[0]; // Get the first matching user (since QR code is unique)
    return res.status(200).json({
      success: true,
      message: "QR Code is valid",
      user,
    });
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  validateQrCode,
};
