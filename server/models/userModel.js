const db = require("../config/db");

// Get all users
const getAllUsers = (callback) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Get user by ID
const getUserById = (id, callback) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

// Get user by phone number
const getUserByPhoneNumber = (phone_number, callback) => {
  db.query(
    "SELECT * FROM users WHERE phone_number = ?",
    [phone_number],
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result[0]); // Return the first result that matches
      }
    }
  );
};

// Create a new user
const createUser = (userData, callback) => {
  db.query(
    "INSERT INTO users (name, phone_number, address, qr_code) VALUES (?, ?, ?, ?)",
    [userData.name, userData.phone_number, userData.address, userData.qr_code],
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

// Update user details
const updateUser = (id, userData, callback) => {
  db.query(
    "UPDATE users SET name = ?, phone_number = ?, address = ?, qr_code = ? WHERE id = ?",
    [
      userData.name,
      userData.phone_number,
      userData.address,
      userData.qr_code,
      id,
    ],
    (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

// Delete user
const deleteUser = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

// Get user by QR code
const getUserByQrCode = (qrCode, callback) => {
  // Updated query to ensure you can find users based on qr_code
  const query = "SELECT * FROM users WHERE qr_code LIKE ?";

  // Using a wildcard to search for any QR code that contains the given input
  db.query(query, [`%${qrCode}%`], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      // If no matching users, return a message indicating that no user was found
      if (result.length === 0) {
        callback(null, { message: "No users found matching the QR code." });
      } else {
        callback(null, result); // Return all matching users
      }
    }
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByPhoneNumber,
  createUser,
  updateUser,
  deleteUser,
  getUserByQrCode,
};
