import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa"; // Importing the download icon from react-icons

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Store selected users
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Number of users per page

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      // Loop over selected users and delete them
      for (let userId of selectedUsers) {
        await axios.delete(`http://localhost:5001/api/users/${userId}`);
      }
      alert("Selected users deleted successfully");
      fetchUsers();
      setSelectedUsers([]); // Reset selected users after deletion
    } catch (err) {
      console.error("Error deleting selected users:", err);
    }
  };

  const handleSelectChange = (id) => {
    // Add or remove user from selectedUsers array
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const exportToExcel = () => {
    const exportData = users.map((user) => ({
      Name: user.name,
      Phone: user.phone_number,
      jabatan: user.address,
      QRCode: user.qr_code,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "users_data.xlsx");
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current users for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const resetQrScan = () => {
    window.location.reload(); // Reloads the page
  };

  return (
    <div className="container mx-auto p-6 max-w-full">
      <h2 className="text-2xl font-semibold text-center mb-4">User List</h2>

      {/* Search Bar */}
      <div className="mb-4 flex justify-center items-center space-x-2">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border text-center rounded-3xl w-full sm:w-1/2 md:w-1/3"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="p-2 bg-red-500 text-white rounded-2xl"
        >
          Clear
        </button>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        {/* Export to Excel Button */}
        <button
          onClick={exportToExcel}
          className="bg-blue-500 text-xs text-white  py-2 px-2 rounded-3xl hover:bg-blue-600 transition duration-300 flex items-center space-x-2"
        >
          <FaDownload /> {/* Adding the download icon */}
          <span>Export to Excel</span>
        </button>

        {/* Refresh Data Button */}
        <button
          onClick={resetQrScan}
          className="bg-blue-500 text-xs  text-white py-2 px-2 rounded-3xl hover:bg-blue-600 transition duration-300"
        >
          Refresh Data
        </button>

        {/* Delete Selected Users Button */}
        {selectedUsers.length > 0 && (
          <button
            onClick={deleteSelectedUsers}
            className="bg-red-500 text-white py-3 px-6 rounded-3xl hover:bg-red-600 transition duration-300"
          >
            Delete Selected
          </button>
        )}
      </div>

      {/* User Table */}
      {currentUsers.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                  {" "}
                  {/* Reduced padding */}
                  <input
                    type="checkbox"
                    onChange={() => {
                      // Select/Deselect all users on this page
                      const allUserIds = currentUsers.map((user) => user.id);
                      if (selectedUsers.length === allUserIds.length) {
                        setSelectedUsers([]);
                      } else {
                        setSelectedUsers(allUserIds);
                      }
                    }}
                    checked={selectedUsers.length === currentUsers.length}
                  />
                </th>
                <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                  ID
                </th>{" "}
                {/* Reduced padding */}
                <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                  Name
                </th>
                <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                  Phone
                </th>
                <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                  Jabatan
                </th>
                <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                  QRCode
                </th>
                <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-semibold text-gray-700 text-xs sm:text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectChange(user.id)}
                    />
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                    {user.id}
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                    {user.name}
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                    {user.phone_number}
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-gray-600 text-xs sm:text-sm">
                    {user.address}
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-gray-600">
                    <a
                      href={`http://localhost:5001/${user.qr_code}`} // QR code image URL
                      download={`qr_code_${user.id}.png`} // Download attribute for the file name
                    >
                      <img
                        src={`http://localhost:5001/${user.qr_code}`}
                        alt="QR Code"
                        className="w-8 h-8 object-contain cursor-pointer" // Smaller QR code
                      />
                    </a>
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-gray-600 text-xs sm:text-sm flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 text-xs sm:text-sm"
                    >
                      Delete
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No users found.</p>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`p-2 border rounded-md ${
                currentPage === pageNumber
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default UserList;
