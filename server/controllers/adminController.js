const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register Admin
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const adminCount = await Admin.countAdmins();
    if (adminCount >= 2) {
      return res.status(403).json({ message: "Admin limit reached" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.addAdmin(username, hashedPassword);
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.getAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate Token
const validateToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming token is sent in Authorization header as "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    res.status(200).json({ message: "Token is valid", decoded });
  });
};

module.exports = { registerAdmin, loginAdmin, validateToken };
