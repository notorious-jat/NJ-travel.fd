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
  color: #333;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #333;
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

const Input = styled.input`
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  `

const Revenue = () => {
  const [revenue, setRevenue] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Combined search query (title, owner, price)
  const [filterDate, setFilterDate] = useState(""); // Date filter
  const [filterMonth, setFilterMonth] = useState("all");
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

  const filteredRevenue = useMemo(() => {
    return revenue.filter((rev) => {
      const ownedDate = new Date(rev.bookingStartDate);
      const filterDateObj = new Date(filterDate);

      // Search logic
      const searchMatch =
        searchQuery.trim() === "" ||
        rev.travel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.ownedBy.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.amount.toString().includes(searchQuery);

      // Date filter
      const dateMatch = filterDate
        ? ownedDate.toDateString() === filterDateObj.toDateString()
        : true;

      // Month filter
      const monthMatch =
        filterMonth === "all"
          ? true
          : ownedDate.getMonth() === parseInt(filterMonth.split("-")[1]) - 1 &&
          ownedDate.getFullYear() === parseInt(filterMonth.split("-")[0]);

      return searchMatch && dateMatch && monthMatch;
    });
  }, [revenue, searchQuery, filterDate, filterMonth]);


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

  const handleDetail = (id) => {
    navigate("/cities/revenue/" + id)
  }

  const currentYear = new Date().getFullYear();

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

            <Input
              as="select"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              <option value="all">All Months</option>
              {Array.from({ length: 12 }).map((_, idx) => {
                const month = String(idx + 1).padStart(2, "0");
                const label = new Date(currentYear, idx).toLocaleString("default", {
                  month: "long",
                });
                return (
                  <option key={`${currentYear}-${month}`} value={`${currentYear}-${month}`}>
                    {label} {currentYear}
                  </option>
                );
              })}
            </Input>
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
                <TableHeader>Package Id</TableHeader>
                <TableHeader>Package Name</TableHeader>
                <TableHeader>Owner Id</TableHeader>
                <TableHeader>Owner</TableHeader>
                <TableHeader>Amount (INR)</TableHeader>
                <TableHeader>Number of Person</TableHeader>
                <TableHeader>Purchase Date</TableHeader>
                <TableHeader>Booking Status</TableHeader>
                <TableHeader>Booking Duration</TableHeader>
                <TableHeader>Booking Start Date</TableHeader>
                <TableHeader>Booking End Date</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredRevenue.map((rev) => (
                <TableRow key={rev._id}>
                  <TableCell>{rev._id}</TableCell>
                  <TableCell>{rev.travel.name}</TableCell>
                  <TableCell>{rev.ownedBy._id}</TableCell>
                  <TableCell>{rev.ownedBy.username}</TableCell>
                  <TableCell>₹{rev.status=="refunded"?rev.amount*0.30:rev.amount}</TableCell>
                  <TableCell>{rev.quantity}</TableCell>
                  <TableCell>{new Date(rev.ownedDate).toLocaleDateString()}</TableCell>
                  <TableCell>{rev.status}
                    {rev.cancelAt ?
                      <>
                        &nbsp;process at&nbsp;
                        {new Date(rev.cancelAt).toLocaleDateString()}
                      </>
                      : null}
                  </TableCell>
                  <TableCell>{rev.duration} Days {rev.duration > 1 ? ` & ${rev.duration - 1} Nights` : null}</TableCell>
                  <TableCell>{new Date(rev.bookingStartDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(rev.bookingEndDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {rev.cancelAt ?
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
