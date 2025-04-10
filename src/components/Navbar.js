import React, { useEffect, useState } from "react";
import { FaHome, FaShoppingBag, FaUser } from "react-icons/fa"; // You can import any icon you want
import axios from "axios";
import "./Navbar.css"; // Make sure to include the CSS for styling
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stage,setStage] = useState(0);
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
          let role = localStorage.getItem('role');
          if(role != 'user'){
            setStage(1)
          }
          setIsLoggedIn(true);
        }else{
          localStorage.removeItem("token")
          localStorage.removeItem('role')
          navigate('/login')
        }
      }
      verify();
    }
  }, [navigate]);

  // Handle login/logout functionality
  const handleAuthClick = () => {
    if (isLoggedIn) {
      if(stage){

        // If logged in, redirect to home
        navigate("/dashboard"); // Or you can use React Router if you're using it
      }else{
      navigate('/myorders')
      }
    } else {
      // If not logged in, redirect to login page
      navigate("/login"); // Or use React Router for navigation
    }
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const logoutHandler = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem('role');
    setIsLoggedIn(false);

    navigate('/login')
  }
  return (
    <nav className="navbar">
      <div className="logoContainer">
      <div className="logo" style={{cursor:'pointer'}} onClick={handleHomeClick}>
        <span className="logo-t">T</span>ravel.io
      </div>
      <p className="explore" onClick={()=>navigate("/explore")}>Explore</p>
      </div>
      <div style={{display:'flex',alignItems:'center'}}>
      <button className="auth-btn" onClick={handleAuthClick}>
        {isLoggedIn ? stage?<FaHome />:<FaShoppingBag/> : <FaUser />}
        {isLoggedIn ? stage?"Home":"My Orders" : "Login"}
      </button>
      &nbsp;
        {isLoggedIn ? !stage?<p style={{cursor:'pointer'}} onClick={logoutHandler}>Logout</p>:null:null}
      </div>
    </nav>
  );
};

export default Navbar;
