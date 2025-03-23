import React, { useEffect, useState } from "react";
import { FaHome, FaUser } from "react-icons/fa"; // You can import any icon you want
import axios from "axios";
import "./Navbar.css"; // Make sure to include the CSS for styling
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // Check localStorage for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const verify = async ()=>{
        const response = await axios.post(
          `http://localhost:5001/api/auth/authCheck`,{token}
        );
        if(response.data.status ==200){
          setIsLoggedIn(true);
        }else{
          localStorage.removeItem("token")
        }
      }
      verify();
    }
  }, [navigate]);

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
