// src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Template from "../components/Template";

// Styled components
const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  background: url("https://via.placeholder.com/1500") no-repeat center center
    fixed;
  background-size: cover;
`;

const LoginBox = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 40px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  color: #fff;
`;

const Input = styled.input`
  width: 100%;
      max-width: 280px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #ff6347;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color:#ff6347;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4c4c;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/signin",
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      const role = response.data.role;
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <Template>
      <LoginWrapper>
        <LoginBox>
          <h2>Login</h2>
          <form onSubmit={handleLogin} style={{marginBottom:'10px'}}>
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
            <Button type="submit">Login</Button>
          </form>
          <Link style={{textDecoration:'none',color:'#fff'}} to={'/register'}>Register now</Link>
        </LoginBox>
      </LoginWrapper>
    </Template>
  );
};

export default LoginPage;
