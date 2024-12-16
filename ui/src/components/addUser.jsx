import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Function to check if a user with the same name already exists
  const checkDuplicateUser = async (name) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/users/check?name=${name}`
      );
      return response.data.exists; // Assuming the API returns a boolean field `exists`
    } catch (err) {
      console.error("Error checking for duplicate:", err);
      return false; // If there's an error, assume no duplicate
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!name || !phoneNumber || !address) {
      setErrorMessage("Semua kolom wajib diisi!");
      return;
    }

    // Check for duplicate user
    const isDuplicate = await checkDuplicateUser(name);
    if (isDuplicate) {
      setErrorMessage("Nama user sudah terdaftar, silakan gunakan nama lain.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5001/api/users", {
        name,
        phone_number: phoneNumber,
        address,
      });

      console.log(response.data); // Check if qr_code is in the response
      setQrCodeUrl(response.data.qr_code); // Update QR code URL from response
      setName("");
      setPhoneNumber("");
      setAddress("");
      setErrorMessage(""); // Reset error message
      setSuccessMessage("User berhasil ditambahkan!"); // Set success message

      // Call onUserAdded if it's a valid function
      if (onUserAdded && typeof onUserAdded === "function") {
        onUserAdded(response.data);
      } else {
        console.error("onUserAdded bukan fungsi");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan saat menambahkan user, coba lagi.");
      console.error("Error saat menambahkan user:", err);
    }
  };

  return (
    <div className="container mx-auto p-5 max-w-lg bg-white rounded-3xl shadow-xl mt-4">
      <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-2 mt-2">
        Add User & QR Code
      </h2>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="space-y-4"
      >
        <motion.input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukan Nama"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full p-2 border-2 text-center border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        <motion.input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Nomor Telepon"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full p-2 border-2 text-center border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        <motion.input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Jabatan"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full p-2 border-2 text-center border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-3xl focus:outline-none transition duration-300 hover:bg-indigo-700"
        >
          Hasilkan QR Code
        </motion.button>
      </motion.form>
      {errorMessage && (
        <div className="mt-4 text-red-500 text-center">
          <p>{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="mt-4 text-green-500 text-center">
          <p>{successMessage}</p> {/* Display success message */}
        </div>
      )}
      {qrCodeUrl && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            QR Code:
          </h3>
          <motion.img
            src={`http://localhost:5001${qrCodeUrl}`} // Use full URL with domain and path
            alt="QR Code User"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-xs rounded-lg shadow-md"
          />
          <a
            href={`http://localhost:5001${qrCodeUrl}`} // Link to download the QR Code
            download={`QRCode_${name}.png`}
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Download QR Code
          </a>

          {/* Display Name, Phone Number, and Welcome Message */}
          <motion.div
            className="mt-6 text-center text-lg text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="italic text-gray-500">
              Selamat datang! QR code user sudah siap.
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AddUser;
