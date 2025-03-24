import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

const CityListWrapper = styled.div`
  padding: 20px;
  margin-top: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #34495e;
  color: white;
  padding: 10px;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f2f2f2;
  }
`;

const CardListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const CityCard = styled.div`
  background: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #34495e;
`;

const CardContent = styled.p`
  color: #7f8c8d;
  font-size: 14px;
  margin: 5px 0;
`;

const Button = styled.button`
  background-color: #34495e;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #fff;
    color: #34495e;
  }
`;

const Revenue = () => {
  const [revenue, setRevenue] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get("http://localhost:5001/api/travel/city/packages/revenue", { headers });
          console.log({ response });

          setRevenue(response.data.data);
        } else {
          toast.error("You must be logged in to view this page.");
          navigate("/login");
        }
      } catch (error) {
        toast(error.response ? error.response.data.message : "Something went wrong");
        if (error.response && error.response.status === 401) {
          // If the error status is 401, log out the user
          localStorage.removeItem("token");
          navigate("/login"); // Redirect to login page
        } else {
          // Display other errors
          console.error("Error creating city:", error.response ? error.response.data.message : error);
        }
      }
    };
    fetchRevenue();
  }, []);

  return (
    <>
      <LeftMenu>
        <CityListWrapper>
          <Title>Revenue</Title>

          {/* Card View */}
          <CardListWrapper>
            {revenue.map((rev) => (
              <CityCard key={rev._id}>
                <CardTitle>{rev.travel.name}</CardTitle>
                <CardContent>Owner: {rev.ownedBy.username}</CardContent>
                <CardContent>Amount: {rev.amount} USD</CardContent>
                <CardContent>For {rev.quantity} Person(s)</CardContent>
                <CardContent>Purchase At: {rev.ownedDate}</CardContent>
                <CardContent>Payment Id: {rev.paymentId}</CardContent>
              </CityCard>
            ))}
          </CardListWrapper>
        </CityListWrapper>
      </LeftMenu>
    </>
  );
};

export default Revenue;
