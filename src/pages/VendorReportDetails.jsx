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
//   max-width: 1000px;
  margin: auto;
`;

const Title = styled.h1`
//   text-align: center;
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


const VendorReportDetails = () => {
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
          `http://localhost:5001/api/travel/report/${id}?type=vendor`,
          { headers }
        );
        setTravelPackage({...response.data.data.vendor,totalSales:response.data.data.totalSales,totalRevenue:response.data.data.totalRevenue});
        setPurchases(response.data.data.sales);
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
      <Title>Vendor Report</Title>

      {!travelPackage ? (
        <Loader/>
      ) : (
        <>
          <PackageInfo>
          <h2>{travelPackage.username}</h2>
            <p><strong>Id:</strong> {travelPackage._id}</p>
            <p><strong>Email:</strong> {travelPackage.email}</p>
            <p><strong>Phone:</strong> {travelPackage.phone||'NA'}</p>
            <p><strong>No. of Sale:</strong> {travelPackage.totalSales}</p>
            <p><strong>Revenue:</strong> {travelPackage.totalRevenue}</p>
            <p><strong>Created At:</strong> {new Date(travelPackage.createdAt).toLocaleDateString()}</p>
          </PackageInfo>

          <SectionTitle>Sales Records</SectionTitle>
          {purchases.length === 0 ? (
            <p>No Sales yet.</p>
          ) : (
            <Table>
              <thead>
                <tr>
                  <th>Buyer Id</th>
                  <th>Buyer Name</th>
                  <th>Buyer Email</th>
                  <th>City Name</th>
                  <th>Package Name</th>
                  <th>Amount</th>
                  <th>Quantity</th>
                  <th>Payment ID</th>
                  <th>Status</th>
                  <th>Booking Start</th>
                  <th>Booking End</th>
                  <th>Sold on</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p._id}>
                    <td>{p.buyer?._id}</td>
                    <td>{p.buyer?.username}</td>
                    <td>{p.buyer?.email}</td>
                    <td>{p.city}</td>
                    <td>{p.travelPackage}</td>
                    <td>₹{p.amount}</td>
                    <td>{p.quantity}</td>
                    <td>{p.paymentId}</td>
                    <td>{p.status}</td>
                    <td>{new Date(p.soldOn).toLocaleDateString()}</td>
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

export default VendorReportDetails;
