import React, { useEffect, useState } from "react";
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
  margin: 10px 0;
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
  background-color: #fff;
  color:#34495e;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    color: #000;
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
  const [role,setRole] = useState(null);

  useEffect(()=>{
    let role = localStorage.getItem('role');
    if(!role){
      localStorage.removeItem("token")
      navigate("/login")
    }
    if(role){
      if(role=='user'){
        navigate("/");
        return;
      }
      setRole(role);
    }
  },[role])

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <DashboardWrapper>
      <Sidebar>
        <h2 style={{textTransform:'capitalize'}}>{role} Dashboard</h2>
        {role !='user'?<SidebarItem onClick={() => navigate("/dashboard")}>Home</SidebarItem>:null}
        {role == 'admin' ?<SidebarItem onClick={() => navigate("/cities")}>City</SidebarItem>:null}
        {role !='user'?<SidebarItem onClick={() => navigate("/cities/package")}>
          Package
        </SidebarItem>:null}
        {role == 'admin'?<SidebarItem onClick={() => navigate("/user")}>User</SidebarItem>:null}
        {role != 'user'?<SidebarItem onClick={() => navigate("/cities/revenue")}>Revenue</SidebarItem>:null}
        {role != 'user'?<SidebarItem onClick={() => navigate("/cities/package/report")}>Package Report</SidebarItem>:null}
        {role != 'user'?<SidebarItem onClick={() => navigate("/cities/user/report")}>User Report</SidebarItem>:null}
        {role == 'admin'?<SidebarItem onClick={() => navigate("/cities/vendor/report")}>Vendor Report</SidebarItem>:null}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
      <ContentWrapper>{children}</ContentWrapper>
    </DashboardWrapper>
  );
};
export default LeftMenu;
