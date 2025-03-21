import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./Navbar";
const DashboardWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;
const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
`;

const SidebarItem = styled.button`
  background-color: transparent;
  border: none;
  color: #fff;
  font-size: 18px;
  margin: 15px 0;
  text-align: left;
  width: 100%;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;

  &:hover {
    background-color: #34495e;
  }
`;
const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #c0392b;
  }
`;
const ContentWrapper = styled.div`
  margin-left: 290px;
  padding: 20px;
  background: #ecf0f1;
  flex-grow: 1;
`;
const LeftMenu = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <DashboardWrapper>
      <Sidebar>
        <h2>Admin Dashboard</h2>
        <SidebarItem onClick={() => navigate("/cities")}>City</SidebarItem>
        <SidebarItem onClick={() => navigate("/cities/package")}>
          Package
        </SidebarItem>
        <SidebarItem onClick={() => navigate("/user")}>User</SidebarItem>
        <SidebarItem onClick={() => navigate("/revenue")}>Revenue</SidebarItem>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
      <ContentWrapper>{children}</ContentWrapper>
    </DashboardWrapper>
  );
};
export default LeftMenu;
