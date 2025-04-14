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
  color: #333;
  margin-bottom: 20px;
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
    background-color: #f5f5f5;
  }
`;


const RevenueReport = () => {
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
              `http://localhost:5001/api/travel/report`,
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
          pkg?.name?.toLowerCase().includes(filterText) ||
          pkg?.city?.toLowerCase().includes(filterText) ||
          pkg?.createdBy?.username?.toLowerCase().includes(filterText) ||
          pkg?.totalPurchases?.toString().includes(filterText) ||
          pkg?.totalRevenue?.toString().includes(filterText) ||
          pkg?.averageRating?.toString().includes(filterText)
        );
      });
  
      setFilteredPackages(filtered);
    }, [filter, packages]);
  
    const handleDetail = (id) => {
      navigate(`/cities/package/report/${id}`);
    };
  
    return (
      <div>
        <LeftMenu>
          <CityListWrapper>
            <Title>Package Report</Title>
  
            <FilterInput
              type="text"
              placeholder="Search by name, city, owner, revenue..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
  
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>City</TableHeader>
                    <TableHeader>Owner</TableHeader>
                    <TableHeader>Purchases</TableHeader>
                    <TableHeader>Revenue</TableHeader>
                    <TableHeader>Rating</TableHeader>
                    <TableHeader>Created At</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <TableRow key={pkg._id}>
                      <TableCell>{pkg.name}</TableCell>
                      <TableCell>{pkg.city}</TableCell>
                      <TableCell>{pkg.createdBy?.username}</TableCell>
                      <TableCell>{pkg.totalPurchases}</TableCell>
                      <TableCell>₹{pkg.totalRevenue}</TableCell>
                      <TableCell>{pkg.averageRating || "N/A"}</TableCell>
                      <TableCell>{new Date(pkg.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleDetail(pkg._id)}>Detail</Button>
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
  
  export default RevenueReport;
  
