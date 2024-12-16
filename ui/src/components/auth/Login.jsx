import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../../assets/login-page.png"; // Import the background image
import loginIcon from "../../assets/login_icon.png"; // Import the login icon

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/admin/login",
        {
          username,
          password,
        }
      );
      alert(response.data.message);
      localStorage.setItem("token", response.data.token); // Store the token in localStorage
      navigate("/validate"); // Redirect to the validate page after login
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-gray-200"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain", // Adjust image to fit entirely
      }}
    >
      {/* Responsive Container */}
      <div className="p-20 mt-28 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
        <h2 className="text-xl font-bold text-center mb-10 text-white mt-10 ">
          Login
        </h2>
        <form className="flex flex-col gap-2" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="p-2 border text-xs  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border text-xs border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-center mb-15">
            {/* Login Icon Button */}
            <button type="submit" className="focus:outline-none">
              <img src={loginIcon} alt="Login Icon" className="w-12 h-12 " />
            </button>
          </div>
        </form>
        <p className="mt-20 text-center text-white">
          Don't have an account?{" "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
