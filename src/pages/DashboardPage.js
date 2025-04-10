// src/pages/DashboardPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import LeftMenu from "../components/LeftMenu";
import Loader from "../components/Loader";
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
  const [report, setReport] = useState({cities:0,packages:0,revenue:0,users:0});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const fetchDash = async () => {
        try {
          setUser(token)
          if (token) {
            let headers = { authorization: `Bearer ${token}` };
            const response = await axios.get(
              `http://localhost:5001/api/travel/dashboard`,
              { headers }
            );
            setReport(response.data)
          } else {
            navigate("/login");
          }
        } catch (error) {
          console.log({error})
          toast(
            error.response ? error.response.data.message : "Something went wrong"
          );
          if (error.response && error.response.status === 401) {
            // If the error status is 401, log out the user
            localStorage.clear();
            navigate("/login"); // Redirect to login page
          } else {
            console.error("Error fetching packages:", error);
          }
        }
      }
      fetchDash();
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
                  <p>{report.cities}</p> {/* Static number for now */}
                </ReportBlock>
                <ReportBlock>
                  <h4>Users</h4>
                  <p>{report.users}</p> {/* Static number for now */}
                </ReportBlock>
                <ReportBlock>
                  <h4>Packages</h4>
                  <p>{report.packages}</p> {/* Static number for now */}
                </ReportBlock>
                <ReportBlock>
                  <h4>Revenue</h4>
                  <p>₹{report.revenue}</p> {/* Static number for now */}
                </ReportBlock>
              </DashboardBox>
            </div>
          </LeftMenu>
        </>
      ) : (
        <Loader/>
      )}
    </>
  );
};

export default DashboardPage;
