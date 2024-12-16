import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component }) => {
  const token = localStorage.getItem("token"); // Get the token from localStorage

  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/" />;
  }

  // If there's a token, render the protected component
  return <Component />;
};

export default PrivateRoute;
