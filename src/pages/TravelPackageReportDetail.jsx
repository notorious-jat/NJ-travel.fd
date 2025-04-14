import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import LeftMenu from "../components/LeftMenu";
import { FaPrint } from "react-icons/fa";

const Container = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const PackageInfo = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;

  h2 {
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0.3rem 0;
    color: #333;
  }
`;

const SectionTitle = styled.h3`
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #fdfdfd;
  }
`;

const Button = styled.button`
  background-color: #333;
  color: #fff;
  border: 0.5px solid #333;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background: #fff;
    color: #333;
  }
`;


const ReportDetailPage = () => {
  const { id } = useParams(); // travel package ID from route
  const navigate = useNavigate();
  const [travelPackage, setTravelPackage] = useState(null);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { authorization: `Bearer ${token}` };
        const response = await axios.get(
          `http://localhost:5001/api/travel/report/${id}?type=package`,
          { headers }
        );

        setTravelPackage(response.data.data.travelPackage);
        setPurchases(response.data.data.purchases);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to load report details"
        );
      }
    };

    fetchReportDetails();
  }, [id, navigate]);
  const printScreen = () => {
    window.print()
  }
  return (
    <LeftMenu>
      <Container>
        <Title>Package Report</Title>

        {!travelPackage ? (
          <Loader />
        ) : (
          <>
            <PackageInfo>
              <h2>{travelPackage.name}</h2>
              <p><strong>City:</strong> {travelPackage.city?.name}</p>
              <p><strong>Created By:</strong> {travelPackage.createdBy?.username} ({travelPackage.createdBy?.email})</p>
              <p><strong>Price:</strong> ₹{travelPackage.price}</p>
              <p><strong>Status:</strong> {travelPackage.status}</p>
              <p><strong>Description:</strong> {travelPackage.description}</p>
            </PackageInfo>

            <SectionTitle>Purchase Records</SectionTitle>
            {purchases.length === 0 ? (
              <p>No purchases yet.</p>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Quantity</th>
                    <th>Payment ID</th>
                    <th>Status</th>
                    <th>Booking Start</th>
                    <th>Booking End</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p._id}>
                      <td>{p.ownedBy?.username}</td>
                      <td>{p.ownedBy?.email}</td>
                      <td>₹{p.status=="refunded"?p.amount*0.30:p.amount}</td>
                      <td>{p.quantity}</td>
                      <td>{p.paymentId}</td>
                      <td>{p.status}</td>
                      <td>{new Date(p.bookingStartDate).toLocaleDateString()}</td>
                      <td>{new Date(p.bookingEndDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <Button type="print" onClick={printScreen}>
              <FaPrint /> Print Invoice
            </Button>
          </>
        )}
      </Container>
    </LeftMenu>
  );
};

export default ReportDetailPage;
