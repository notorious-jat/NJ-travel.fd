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

const PackageListPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get(
            `http://localhost:5001/api/travel/city/packages`,
            { headers }
          );
          setPackages(response.data.data);
          setFilteredPackages(response.data.data); // Set initial filtered packages
        } else {
          navigate("/login");
        }
      } catch (error) {
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
    };

    fetchPackages();
  }, [navigate]);

  useEffect(() => {
    const filtered = packages.filter((pkg) => {
      // Ensure the filter input is handled in a case-insensitive manner
      const filterText = filter?.toLowerCase() || "";
  
      // Checking if the name, price, duration, or username matches the filter
      return (
        pkg?.name?.toLowerCase().includes(filterText) || // Match name
        pkg?.price?.toString().includes(filterText) ||   // Match price (converted to string)
        pkg?.duration?.toLowerCase().includes(filterText) || // Match duration
        pkg?.createdBy?.username?.toLowerCase().includes(filterText) // Match owner username
      );
    });
  
    setFilteredPackages(filtered);
  }, [filter, packages]);
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/travel/package/${id}`);
      setPackages(packages.filter((pkg) => pkg._id !== id));
      setFilteredPackages(filteredPackages.filter((pkg) => pkg._id !== id));
      toast.success("Package deleted successfully!");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/cities/package/edit/${id}`);
  };

  return (
    <div>
      <LeftMenu>
        <CityListWrapper>
          <Title>Travel Packages</Title>
          <Button onClick={() => navigate(`/cities/package/create`)}>
            Create New Package
          </Button>

          {/* Filter Input */}
          <FilterInput
            type="text"
            placeholder="Search packages by name or description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          {/* Table View for Packages */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>City</TableHeader>
                  <TableHeader>Owner</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Created At</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg._id}>
                    <TableCell>{pkg.name}</TableCell>
                    <TableCell>{pkg.city.name}</TableCell>
                    <TableCell>{pkg.createdBy.username}</TableCell>
                    <TableCell>₹{pkg.price}</TableCell>
                    <TableCell>{pkg.createdAt}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(pkg._id)}>Edit</Button>
                      <Button
                        onClick={() => handleDelete(pkg._id)}
                        style={{ marginLeft: "10px" }}
                      >
                        Delete
                      </Button>
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

export default PackageListPage;
