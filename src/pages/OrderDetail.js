import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import styled from "styled-components";
import { toast } from "react-toastify";
import Template from "../components/Template";
import { FaPrint, FaTimesCircle } from "react-icons/fa";
import Loader from "../components/Loader";

// Styled Components
const Container = styled.div`
  padding: 40px 20px;
  background-color: #f4f6f8;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #1a1a1a;
  margin-bottom: 20px;
`;

const PackageImage = styled.img`
  width: 100%;
  max-width: 450px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Label = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const Value = styled.div`
  color: #666;
  margin-bottom: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin-top: 30px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ type }) =>
    type === "cancel" ? "#ff4d4f" : type === "print" ? "#444" : "#0066ff"};
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ type }) =>
    type === "cancel" ? "#d9363e" : type === "print" ? "#222" : "#0044cc"};
  }
`;

const OrderDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get(
            `http://localhost:5001/api/travel/user/package/${id}`,
            { headers }
          );
          setPackageData(response.data.data);
        } else {
          alert("You need to log in first");
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
        alert("You need to log in first");
        localStorage.clear();
        window.location.href = "/login";
      }
    };

    fetchPackageDetails();
  }, [id]);

  console.log({ packageData })

  const handleCancel = async (packageId) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const headers = { authorization: `Bearer ${token}` };
        await axios.put(
          `http://localhost:5001/api/travel/update-status/${packageId}`,
          { status: "refunded" },
          { headers }
        );
        toast.success(`Successfully cancelled payment.`);
        window.location.reload();
      } else {
        toast.error("Please login to cancel the payment.");
        localStorage.clear();
      }
    } catch (error) {
      console.error("Error cancelling payment:", error);
      toast.error(
        error.response ? error.response.data.message : "Something went wrong"
      );
    }
  };

  const printScreen = () => window.print();

  if (!packageData) return <Template><Loader /></Template>;

  return (
    <Template>
      <Container>
        <Tabs>
          <TabList>
            <Tab>🏞 Package</Tab>
            <Tab>🏕️ Activities</Tab>
            <Tab>💳 Payment</Tab>
            <Tab>👤 User</Tab>
            <Tab>📅 Booking</Tab>
            <Tab>All Details</Tab>
          </TabList>

          {/* Package Details */}
          <TabPanel>
            <Card>
              <SectionTitle>Package Details</SectionTitle>
              <Grid>
                <div>
                  <PackageImage
                    src={`http://localhost:5001/${packageData.images[0]}`}
                    alt={packageData.name}
                  />
                </div>
                <div>
                  <Label>Name:</Label>
                  <Value>{packageData.name}</Value>

                  <Label>Description:</Label>
                  <Value>{packageData.description}</Value>

                  <Label>City:</Label>
                  <Value>{packageData?.city?.name || "N/A"}</Value>

                  <Label>Inclusions:</Label>
                  <Value>
                    {packageData.includesFlight && "✈ Flight "}
                    {packageData.includesHotel && "🏨 Hotel "}
                    {packageData.includesSightseeing && "🚗 Sightseeing "}
                    {packageData.includesMeal && "🍽 Meal"}
                    {packageData.includesTransport && "🚂 Transport"}
                  </Value>

                  {packageData.includesFlight && packageData?.flightName &&
                    <div style={{ marginBottom: '10px' }}>
                      <Label>Flight Details:</Label>
                      {packageData?.flightName?.split(',').map((line, index) => (
                        <Value style={{ margin: 0 }} key={index}>{line.trim()}</Value>
                      ))}
                    </div>}

                  {packageData.includesTransport && packageData?.transportName &&
                    <div style={{ marginBottom: '10px' }}>
                      <Label>Transport Details:</Label>
                      {packageData?.transportName?.split(',').map((line, index) => (
                        <Value style={{ margin: 0 }} key={index}>{line.trim()}</Value>
                      ))}
                    </div>}

                  {packageData.includesHotel && packageData?.hotelName &&
                    <div style={{ marginBottom: '10px' }}>
                      <Label>Hotel Details:</Label>
                      {packageData?.hotelName?.split(',').map((line, index) => (
                        <Value style={{ margin: 0 }} key={index}>{line.trim()}</Value>
                      ))}
                    </div>}
                </div>
              </Grid>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <SectionTitle>Activities Details</SectionTitle>
              {packageData.travel.activities.slice(0, packageData.duration).map((act, index) => (
                <>
                  <Label>Day {index + 1}:</Label>
                  <Value>{act}</Value>
                </>
              ))}
            </Card>
          </TabPanel>
          {/* Payment Details */}
          <TabPanel>
            <Card>
              <SectionTitle>Payment Details</SectionTitle>
              <Label>Status:</Label>
              <Value>{packageData.status}</Value>

              <Label>Payment ID:</Label>
              <Value>{packageData.paymentId}</Value>

              <Label>Amount Paid:</Label>
              <Value>₹{packageData.amount}</Value>

              <Label>Paid On:</Label>
              <Value>{new Date(packageData.ownedDate).toLocaleDateString()}</Value>
            </Card>
          </TabPanel>

          {/* User Details */}
          <TabPanel>
            <Card>
              <SectionTitle>User Details</SectionTitle>
              <Label>Username:</Label>
              <Value>{packageData.ownedBy.username}</Value>

              <Label>Email:</Label>
              <Value>{packageData.ownedBy.email}</Value>

              {packageData.ownedBy.userUniqueIdentifier &&
                <>
                  <Label>Adhar Number:</Label>
                  <Value>{packageData.ownedBy.userUniqueIdentifier}</Value>
                </>}
              <Label>Account Created:</Label>
              <Value>{new Date(packageData.ownedBy.createdAt).toLocaleDateString()}</Value>

            </Card>
          </TabPanel>

          {/* Booking Details */}
          <TabPanel>
            <Card>
              <SectionTitle>Booking Details</SectionTitle>
              <Label>People:</Label>
              <Value>{packageData.quantity}</Value>

              <Label>Duration:</Label>
              <Value>{packageData.duration} Days {packageData.duration > 1 ? ` & ${packageData.duration - 1} Nights` : null}</Value>

              {packageData.usersData.length ?
                <>
                  <Label>User Details</Label>
                  <ol>
                    {
                      packageData.usersData.map((user) => (
                        <li><Value>{user.name} ({user.contactInfo})</Value></li>
                      ))
                    }
                  </ol>
                </>
                : null}

              <Label>Booking Status:</Label>
              <Value>{packageData.status === "paid" ? "✅ Confirmed" : "❌ Cancelled"}</Value>

              <Label>Start Date:</Label>
              <Value>{new Date(packageData.bookingStartDate).toLocaleDateString()}</Value>

              <Label>End Date:</Label>
              <Value>{new Date(packageData.bookingEndDate).toLocaleDateString()}</Value>

              {packageData.cancelAt && (
                <>
                  <Label>Cancelled On:</Label>
                  <Value>{new Date(packageData.cancelAt).toLocaleDateString()}</Value>
                </>
              )}
            </Card>
          </TabPanel>
          <TabPanel>
            <Card>
              <SectionTitle>Package Details</SectionTitle>
              <Grid>
                <div>
                  <PackageImage
                    src={`http://localhost:5001/${packageData.images[0]}`}
                    alt={packageData.name}
                  />
                </div>
                <div>
                  <Label>Name:</Label>
                  <Value>{packageData.name}</Value>

                  <Label>Description:</Label>
                  <Value>{packageData.description}</Value>

                  <Label>City:</Label>
                  <Value>{packageData?.city?.name || "N/A"}</Value>

                  <Label>Inclusions:</Label>
                  <Value>
                    {packageData.includesFlight && "✈ Flight "}
                    {packageData.includesHotel && "🏨 Hotel "}
                    {packageData.includesSightseeing && "🚗 Sightseeing "}
                    {packageData.includesMeal && "🍽 Meal"}
                    {packageData.includesTransport && "🚂 Transport"}
                  </Value>

                  {packageData.includesFlight && packageData?.flightName &&
                    <div style={{ marginBottom: '10px' }}>
                      <Label>Flight Details:</Label>
                      {packageData?.flightName?.split(',').map((line, index) => (
                        <Value style={{ margin: 0 }} key={index}>{line.trim()}</Value>
                      ))}
                    </div>}

                  {packageData.includesTransport && packageData?.transportName &&
                    <div style={{ marginBottom: '10px' }}>
                      <Label>Transport Details:</Label>
                      {packageData?.transportName?.split(',').map((line, index) => (
                        <Value style={{ margin: 0 }} key={index}>{line.trim()}</Value>
                      ))}
                    </div>}

                  {packageData.includesHotel && packageData?.hotelName &&
                    <div style={{ marginBottom: '10px' }}>
                      <Label>Hotel Details:</Label>
                      {packageData?.hotelName?.split(',').map((line, index) => (
                        <Value style={{ margin: 0 }} key={index}>{line.trim()}</Value>
                      ))}
                    </div>}
                </div>
              </Grid>
            </Card>
            <Card>
              <SectionTitle>Activities Details</SectionTitle>
              {packageData.travel.activities.slice(0, packageData.duration).map((act, index) => (
                <>
                  <Label>Day {index + 1}:</Label>
                  <Value>{act}</Value>
                </>
              ))}
            </Card>
          {/* Payment Details */}
            <Card>
              <SectionTitle>Payment Details</SectionTitle>
              <Label>Status:</Label>
              <Value>{packageData.status}</Value>

              <Label>Payment ID:</Label>
              <Value>{packageData.paymentId}</Value>

              <Label>Amount Paid:</Label>
              <Value>₹{packageData.amount}</Value>

              <Label>Paid On:</Label>
              <Value>{new Date(packageData.ownedDate).toLocaleDateString()}</Value>
            </Card>

          {/* User Details */}
            <Card>
              <SectionTitle>User Details</SectionTitle>
              <Label>Username:</Label>
              <Value>{packageData.ownedBy.username}</Value>

              <Label>Email:</Label>
              <Value>{packageData.ownedBy.email}</Value>

              {packageData.ownedBy.userUniqueIdentifier &&
                <>
                  <Label>Adhar Number:</Label>
                  <Value>{packageData.ownedBy.userUniqueIdentifier}</Value>
                </>}
              <Label>Account Created:</Label>
              <Value>{new Date(packageData.ownedBy.createdAt).toLocaleDateString()}</Value>

            </Card>

          {/* Booking Details */}
            <Card>
              <SectionTitle>Booking Details</SectionTitle>
              <Label>People:</Label>
              <Value>{packageData.quantity}</Value>

              <Label>Duration:</Label>
              <Value>{packageData.duration} Days {packageData.duration > 1 ? ` & ${packageData.duration - 1} Nights` : null}</Value>

              {packageData.usersData.length ?
                <>
                  <Label>User Details</Label>
                  <ol>
                    {
                      packageData.usersData.map((user) => (
                        <li><Value>{user.name} ({user.contactInfo})</Value></li>
                      ))
                    }
                  </ol>
                </>
                : null}

              <Label>Booking Status:</Label>
              <Value>{packageData.status === "paid" ? "✅ Confirmed" : "❌ Cancelled"}</Value>

              <Label>Start Date:</Label>
              <Value>{new Date(packageData.bookingStartDate).toLocaleDateString()}</Value>

              <Label>End Date:</Label>
              <Value>{new Date(packageData.bookingEndDate).toLocaleDateString()}</Value>

              {packageData.cancelAt && (
                <>
                  <Label>Cancelled On:</Label>
                  <Value>{new Date(packageData.cancelAt).toLocaleDateString()}</Value>
                </>
              )}
            </Card>
          </TabPanel>
        </Tabs>

        <ButtonGroup>
          {!packageData.cancelAt && (
            <ActionButton type="cancel" onClick={() => handleCancel(packageData._id)}>
              <FaTimesCircle /> Cancel Booking
            </ActionButton>
          )}
          <ActionButton type="print" onClick={printScreen}>
            <FaPrint /> Print Invoice
          </ActionButton>
        </ButtonGroup>
      </Container>
    </Template>
  );
};

export default OrderDetail;
