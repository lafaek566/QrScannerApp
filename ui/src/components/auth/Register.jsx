import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed and imported

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/admin/register",
        {
          username,
          password,
        }
      );
      alert("Registration successful! Please login.");
      navigate("/"); // Redirect to login page after successful registration
    } catch (error) {
      console.error("Error registering admin:", error);
      alert("Error registering admin");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl mb-4">Register</h2>
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          className="p-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{" "}
        <button className="text-blue-500" onClick={() => navigate("/")}>
          Login
        </button>
      </p>
    </div>
  );
};

export default Register;
