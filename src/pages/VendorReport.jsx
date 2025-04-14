import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";
import styled from "styled-components";

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

const Button = styled.button`
  background-color: #34495e;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #fff;
    color: #34495e;
  }
`;

const FilterInput = styled.input`
  padding: 5px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const TableWrapper = styled.div`
  margin-top: 20px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
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
    background-color: #f5f5f5;
  }
`;


const VendorReport = () => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [filter, setFilter] = useState("");
  
    useEffect(() => {
      const fetchPackages = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const headers = { authorization: `Bearer ${token}` };
            const response = await axios.get(
              `http://localhost:5001/api/travel/report?type=vendor`,
              { headers }
            );
            setPackages(response.data.data);
            setFilteredPackages(response.data.data);
          } else {
            navigate("/login");
          }
        } catch (error) {
          toast(
            error.response ? error.response.data.message : "Something went wrong"
          );
          if (error.response && error.response.status === 401) {
            localStorage.clear();
            navigate("/login");
          } else {
            console.error("Error fetching packages:", error);
          }
        }
      };
  
      fetchPackages();
    }, [navigate]);
  
    useEffect(() => {
      const filtered = packages.filter((pkg) => {
        const filterText = filter?.toLowerCase() || "";
  
        return (
          pkg?.vendor?.username?.toLowerCase().includes(filterText) ||
          pkg?.totalPackages?.toString().includes(filterText) ||
          pkg?.totalPurchases?.toString().includes(filterText) ||
          pkg?.totalRevenue?.toString().includes(filterText) ||
          pkg?.vendor._id?.toString().includes(filterText)
        );
      });
  
      setFilteredPackages(filtered);
    }, [filter, packages]);
  
    const handleDetail = (id) => {
      navigate(`/cities/vendor/report/${id}`);
    };
  
    return (
      <div>
        <LeftMenu>
          <CityListWrapper>
            <Title>Vendor Report</Title>
  
            <FilterInput
              type="text"
              placeholder="Search by name, Id,Revenue, Revenue, Packages..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
  
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Id</TableHeader>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Packages</TableHeader>
                    <TableHeader>No. Package Purchases by users</TableHeader>
                    <TableHeader>Revenue</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <TableRow key={pkg.vendor?._id}>
                      <TableCell>{pkg.vendor?._id}</TableCell>
                      <TableCell>{pkg.vendor?.username}</TableCell>
                      <TableCell>{pkg?.totalPackages}</TableCell>
                      <TableCell>{pkg?.totalPurchases}</TableCell>
                      <TableCell>₹{pkg?.totalRevenue}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleDetail(pkg?.vendor?._id)}>Detail</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </CityListWrapper>
        </LeftMenu>
      </div>
    );
  };
  
  export default VendorReport;
  
