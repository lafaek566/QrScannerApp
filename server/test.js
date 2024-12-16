const express = require("express");
const mysql = require("mysql2");
const QRCode = require("qrcode");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5001;

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root1234", // Consider storing passwords securely (e.g., environment variables)
  database: "qr",
});

// Establishing the database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    process.exit(1); // Exit the app if the DB connection fails
  }
  console.log("Connected to MySQL");
});

app.use(cors());
app.use(bodyParser.json());

// Endpoint to add user and generate QR code
app.post("/add-user", async (req, res) => {
  const { name, phone_number, address } = req.body;

  try {
    // Check for existing user with the same name or phone number
    const existingUser = await db.query(
      "SELECT * FROM users WHERE name = ? OR phone_number = ?",
      [name, phone_number]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Name or phone number already exists!" });
    }

    // Insert the new user into the database
    const result = await db.query(
      "INSERT INTO users (name, phone_number, address) VALUES (?, ?, ?)",
      [name, phone_number, address]
    );

    // Generate QR code (or any other logic)
    const qrCodeUrl = `https://example.com/qrcode/${result.insertId}`;

    res.status(201).json({
      user: { id: result.insertId, name, phone_number, address },
      qrCodeUrl,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to validate the QR code (decoded properly)
app.get("/validate-user/:code", (req, res) => {
  const { code } = req.params;

  // Decode the URL-encoded QR code
  const decodedCode = decodeURIComponent(code);
  console.log("Decoded QR Code:", decodedCode); // Log the decoded value

  // Extract data from the decoded code
  const [name, phone_number, address] = decodedCode.split("|");

  // Query your database or handle the validation logic here
  db.query(
    "SELECT * FROM users WHERE name = ? AND phone_number = ? AND address = ?",
    [name, phone_number, address],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (results.length > 0) {
        res.status(200).json({ message: "User validated", user: results[0] });
      } else {
        res.status(404).send("User not found");
      }
    }
  );
});

// Catch-all error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Endpoint to get all users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error querying the database: ", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(result);
  });
});

// Endpoint to update user details
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone_number, address } = req.body;

  // Validate input data
  if (!name || !phone_number || !address) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query =
    "UPDATE users SET name = ?, phone_number = ?, address = ? WHERE id = ?";

  db.query(query, [name, phone_number, address, id], (err, result) => {
    if (err) {
      console.error("Error updating user in the database: ", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  });
});

// Delete user endpoint
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user from DB:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
