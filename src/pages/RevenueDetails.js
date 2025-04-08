import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; // Default styling for tabs
import styled from 'styled-components';
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

const Container = styled.div`
  padding: 20px;
`;

const PackageImage = styled.img`
  width: 100%;
  max-width: 500px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;
const Button = styled.button`
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

const Description = styled.p`
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: green;
`;

const BookingDetailWrapper = styled.div`
  margin-top: 20px;
`;

const RevenueDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Assume the package ID is passed as URL parameter
  const [packageData, setPackageData] = useState(null);
  // Fetch package data when component mounts
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          let headers = {
            'Authorization': `Bearer ${token}`,
          }
          const response = await axios.get(`http://localhost:5001/api/travel/user/package/${id}`, { headers });
          setPackageData(response.data.data);
        } else {
          alert('You need to log in first');
          localStorage.clear()
          window.location.href = '/login'; // Redirect if no token
          return;
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
        alert('You need to log in first');
        localStorage.clear()
        window.location.href = '/login'; // Redirect if no token
        return;
      }

    };
    fetchPackageDetails();
  }, [id]);

  if (!packageData) {
    return <div>Loading...</div>;
  }


  // This function handles when the Cancel button is clicked
  const handleCancel = async (packageId) => {

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const headers = {
          authorization: `Bearer ${token}`,
        };

        // Make the API request to update the status to 'refunded' and set the cancelAt field
        const response = await axios.put(
          `http://localhost:5001/api/travel/update-status/${packageId}`,
          { status: "refunded" }, // Updating the status to 'refunded'
          { headers }
        );

        // If the status update is successful
        toast.success(`Successfully cancelled payment with ID: ${packageId}`);
        console.log(response.data); // You can log the response for debugging
        window.location.reload()
        // Optionally update the state here or trigger a refresh if necessary
      } else {
        toast.error("Please login to cancel the payment.");
        localStorage.clear();
        // Optionally redirect the user to the login page
      }
    } catch (error) {
      // Handle errors if the request fails
      console.error("Error cancelling payment:", error);
      toast.error(error.response ? error.response.data.message : "Something went wrong");
    }
  };

  const printScreen = () => {
    window.print()
  }


  return (
    <LeftMenu>
      <Container>
        <Tabs>
          <TabList>
            <Tab>Package Details</Tab>
            <Tab>Payment Details</Tab>
            <Tab>User Details</Tab>
            <Tab>Booking Details</Tab>
          </TabList>

          <TabPanel>
            <h3>Package Details</h3>
            <PackageImage src={`http://localhost:5001/${packageData.images[0]}`} alt={packageData.name} />
            <InfoWrapper>
              <Title>{packageData.name}</Title>
              <Description>{packageData.description}</Description>
              <p><strong>City:</strong> {packageData?.city?.name || 'NA'}</p>
              <p><strong>Includes Flight:</strong> {packageData.includesFlight ? 'Yes' : 'No'}</p>
              <p><strong>Includes Hotel:</strong> {packageData.includesHotel ? 'Yes' : 'No'}</p>
              <p><strong>Includes Sightseeing:</strong> {packageData.includesSightseeing ? 'Yes' : 'No'}</p>
              <p><strong>Includes Meal:</strong> {packageData.includesMeal ? 'Yes' : 'No'}</p>
            </InfoWrapper>
          </TabPanel>

          <TabPanel>
            <h3>Payment Details</h3>
            <BookingDetailWrapper>
              <p><strong>Status:</strong> {packageData.status}</p>
              <p><strong>Payment ID:</strong> {packageData.paymentId}</p>
              <p><strong>Amount:</strong> ₹{packageData.amount}</p>
              <p><strong>Owned Date:</strong> {new Date(packageData.ownedDate).toLocaleDateString()}</p>
            </BookingDetailWrapper>
          </TabPanel>

          <TabPanel>
            <h3>User Details</h3>
            <p><strong>Owned By:</strong> {packageData.ownedBy.username}</p>
            <p><strong>Email:</strong> {packageData.ownedBy.email}</p>
            <p><strong>Register At:</strong>{new Date(packageData.ownedBy.createdAt).toLocaleDateString()}</p>

            {/* You can fetch and display more user details if needed */}
          </TabPanel>

          <TabPanel>
            <h3>Booking Details</h3>
            <p><strong>Book for:</strong> {packageData.quantity} Person</p>
            <p><strong>Duration:</strong> {packageData.duration} Days</p>
            <p><strong>Booking Status:</strong> {packageData.status == "paid" ? 'Confimed' : 'Cancel'}</p>
            <p><strong>Booking Start Date:</strong> {new Date(packageData.bookingStartDate).toLocaleDateString()}</p>
            <p><strong>Booking End Date:</strong> {new Date(packageData.bookingEndDate).toLocaleDateString()}</p>
            {packageData.cancelAt ? <p><strong>Cancel At:</strong> {packageData.cancelAt ? new Date(packageData.cancelAt).toLocaleDateString() : 'N/A'}</p> : null}
          </TabPanel>
        </Tabs>
        {!packageData.cancelAt ? <Button onClick={() => { handleCancel(packageData._id) }}>cancel</Button> : null}
        <Button onClick={printScreen}>Print</Button>
      </Container>
    </LeftMenu>
  );
};

export default RevenueDetails;
