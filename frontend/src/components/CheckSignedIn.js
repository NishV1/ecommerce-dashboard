import React from "react";
import { Navigate,Outlet } from "react-router-dom";

const CheckSignedIn = () => {
  const user = localStorage.getItem("user-info"); // Retrieve user info from local storage
  return user ? <Outlet /> : <Navigate to="/signup" />; // If user is signed in, render the child components; otherwise, redirect to signup page
}

export default CheckSignedIn;
// This component checks if the user is signed in by looking for user info in local storage. If the user is signed in, it renders the child components (using <Outlet />). If not, it redirects the user to the signup page using <Navigate />.