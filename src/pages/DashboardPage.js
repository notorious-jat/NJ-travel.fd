// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LeftMenu from "../components/LeftMenu";
// Styled components for the layout
const WelcomeMessage = styled.h2`
  color: #f7c41f;
`;

const DashboardBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
`;

const ReportBlock = styled.div`
  background: #2c3e50;
  color: #fff;
  width: 23%;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h4 {
    font-size: 1.2em;
    margin-bottom: 10px;
  }

  p {
    font-size: 2em;
    font-weight: bold;
  }
`;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setUser(token); // You can expand this to show more user info if needed
    }
  }, [navigate]);
  return (
    <>
      {user ? (
        <>
          <LeftMenu>
            <div>
              <WelcomeMessage>Welcome to Your Dashboard!</WelcomeMessage>
              <DashboardBox>
                {/* Static Report Blocks */}
                <ReportBlock>
                  <h4>Cities</h4>
                  <p>12</p> {/* Static number for now */}
                </ReportBlock>
                <ReportBlock>
                  <h4>Users</h4>
                  <p>120</p> {/* Static number for now */}
                </ReportBlock>
                <ReportBlock>
                  <h4>Packages</h4>
                  <p>45</p> {/* Static number for now */}
                </ReportBlock>
                <ReportBlock>
                  <h4>Revenue</h4>
                  <p>$30,000</p> {/* Static number for now */}
                </ReportBlock>
              </DashboardBox>
            </div>
          </LeftMenu>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default DashboardPage;
