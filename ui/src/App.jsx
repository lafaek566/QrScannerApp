import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddUser from "./components/AddUser";
import UserList from "./components/UsersList";
import ValidateUser from "./components/ValidateUser";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./components/PrivateRoute"; // Importing the PrivateRoute component
import { Outlet, Link } from "react-router-dom"; // Importing Outlet and Link
import bgImage from "./assets/bg.jpg"; // Import the background image

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main user path */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="add" element={<AddUser />} />
            <Route path="users" element={<UserList />} />
          </Route>

          {/* Protected Route */}
          <Route
            path="/validate"
            element={<PrivateRoute component={ValidateUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

// New layout component for /user routes
const UserLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden mt-1">
      {/* Navbar */}
      <nav className="text-black">
        <div className="flex justify-between items-center">
          <div className="space-x-5 hidden sm:flex">
            <Link to="/user" className="hover:underline">
              User Dashboard
            </Link>
            <Link to="/user/add" className="hover:underline">
              Add User
            </Link>
            <Link to="/user/users" className="hover:underline">
              User List
            </Link>
          </div>
          {/* Mobile menu toggle */}
          <div className="sm:hidden">
            <button className="text-white">Menu</button>
          </div>
        </div>
        {/* Mobile Navbar Links */}
        <div className="sm:hidden mt-2">
          <Link to="/user" className="block py-2 px-6 hover:underline">
            Dashboard
          </Link>
          <Link to="/user/add" className="block py-2 px-6 hover:underline">
            Add User
          </Link>
          <Link to="/user/users" className="block py-2 px-6 hover:underline">
            User List
          </Link>
        </div>
      </nav>

      {/* Content Container with Responsive Background Image */}
      <div
        className="flex-grow p-6 sm:p-8"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          backgroundAttachment: "fixed",
        }}
      >
        <Outlet /> {/* Renders the nested routes */}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Add User Section (on top for desktop, stacked for mobile) */}
        <div className="sm:w-full sm:order-1">
          <AddUser />
        </div>

        {/* User List Section (below Add User for desktop, stacked for mobile) */}
        <div className="sm:w-full sm:order-2">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default App;
