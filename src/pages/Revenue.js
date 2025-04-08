import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

// Styled components for the table layout
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

const Button = styled.button`
  background-color: #34495e;
  color: white;
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

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Revenue = () => {
  const [revenue, setRevenue] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Combined search query (title, owner, price)
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get("http://localhost:5001/api/travel/city/packages/revenue", { headers });
          setRevenue(response.data.data);
        } else {
          toast.error("You must be logged in to view this page.");
          navigate("/login");
        }
      } catch (error) {
        toast(error.response ? error.response.data.message : "Something went wrong");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login"); // Redirect to login page
        } else {
          console.error("Error fetching revenue:", error.response ? error.response.data.message : error);
        }
      }
    };
    fetchRevenue();
  }, [navigate]);

  // useMemo for optimized filtering
  const filteredRevenue = useMemo(() => {
    return revenue.filter((rev) => {
      const ownedDate = new Date(rev.ownedDate);
      const filterDateObj = new Date(filterDate);

      // Apply combined search filters for title, owner, or price
      const searchMatch =
        searchQuery.trim() === "" ||
        rev.travel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.ownedBy.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.amount.toString().includes(searchQuery);

      // Apply date filter
      const dateMatch = filterDate
        ? ownedDate.toDateString() === filterDateObj.toDateString()
        : true;

      return searchMatch && dateMatch;
    });
  }, [revenue, searchQuery, filterDate]); // Dependencies: re-run the filter when these change

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

    const handleDetail=(id)=>{
      navigate("/cities/revenue/"+id)
    }

  return (
    <>
      <LeftMenu>
        <CityListWrapper>
          <Title>Revenue</Title>

          {/* Search Filters */}
          <div>
            {/* Single Search Input (for Package Name, Owner Name, Price) */}
            <Input
              type="text"
              placeholder="Search by Package Name, Owner Name, or Price"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Just update searchQuery state
            />
            {/* Date Filter */}
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)} // Just update filterDate state
              style={{ marginLeft: "10px" }}
            />
          </div>

          {/* Revenue Table */}
          <Table>
            <thead>
              <tr>
                <TableHeader>Package Name</TableHeader>
                <TableHeader>Owner</TableHeader>
                <TableHeader>Amount (INR)</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Purchase Date</TableHeader>
                <TableHeader>Booking Status</TableHeader>
                <TableHeader>Payment ID</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredRevenue.map((rev) => (
                <TableRow key={rev._id}>
                  <TableCell>{rev.travel.name}</TableCell>
                  <TableCell>{rev.ownedBy.username}</TableCell>
                  <TableCell>₹{rev.amount}</TableCell>
                  <TableCell>{rev.quantity}</TableCell>
                  <TableCell>{new Date(rev.ownedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{rev.status}
                    {rev.cancelAt ? 
                    <>
                     &nbsp;process at&nbsp;
                    {new Date(rev.cancelAt).toLocaleDateString()}
                    </>
                    :null}
                  </TableCell>
                  <TableCell>{rev.paymentId}</TableCell>
                  <TableCell>
                    {rev.cancelAt?
                    "Cancelled"
                    :
                    <Button onClick={() => handleCancel(rev._id)}>Cancel</Button>}
                    <Button onClick={() => handleDetail(rev._id)}>Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </CityListWrapper>
      </LeftMenu>
    </>
  );
};

export default Revenue;
