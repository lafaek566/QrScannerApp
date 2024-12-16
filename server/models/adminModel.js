const db = require("../config/db");

const Admin = {
  getAdminByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM admins WHERE username = ?",
        [username],
        (err, result) => {
          if (err) reject(err);
          resolve(result[0]); // Return the first result (admin)
        }
      );
    });
  },

  addAdmin: (username, password) => {
    return new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO admins (username, password) VALUES (?, ?)",
        [username, password],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  },

  countAdmins: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS count FROM admins", (err, result) => {
        if (err) reject(err);
        resolve(result[0].count); // Only return the count, not an array
      });
    });
  },
};

module.exports = Admin;
