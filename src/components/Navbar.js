import React, { useEffect, useState } from "react";
import { FaHome, FaUser } from "react-icons/fa"; // You can import any icon you want
import "./Navbar.css"; // Make sure to include the CSS for styling

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check localStorage for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login/logout functionality
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // If logged in, redirect to home
      window.location.href = "/dashboard"; // Or you can use React Router if you're using it
    } else {
      // If not logged in, redirect to login page
      window.location.href = "/login"; // Or use React Router for navigation
    }
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleHomeClick}>
        <span className="logo-t">T</span>ravel.io
      </div>
      <button className="auth-btn" onClick={handleAuthClick}>
        {isLoggedIn ? <FaHome /> : <FaUser />}
        {isLoggedIn ? "Home" : "Login"}
      </button>
    </nav>
  );
};

export default Navbar;
