import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Navbar from "../components/Navbar";

// Styled components
const RegisterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 50px);
  background: url("https://via.placeholder.com/1500") no-repeat center center fixed;
  background-size: cover;
`;

const RegisterBox = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 40px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #f7c41f;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d19b1c;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4c4c;
`;

const SuccessMessage = styled.p`
  color: #4caf50;
`;

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/auth/signup", {
        username,
        email,
        password,
        role:'user',
      });
      setSuccess("User registered successfully!");
      setError(""); // Clear any previous errors
      // After successful registration, you can optionally navigate to login page
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after successful registration
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setSuccess(""); // Clear success message on error
    }
  };

  return (
    <>
      <Navbar />
      <RegisterWrapper>
        <RegisterBox>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            <Button type="submit">Register</Button>
          </form>
        </RegisterBox>
      </RegisterWrapper>
    </>
  );
};

export default RegisterPage;
