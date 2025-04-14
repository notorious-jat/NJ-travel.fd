import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

const CityListWrapper = styled.div`
  padding: 20px;
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

const FilterInput = styled.input`
  padding: 5px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CityListPage = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get("http://localhost:5001/api/cities", { headers });
          setCities(response.data);
          setFilteredCities(response.data); // Initial set for filter
        } else {
          toast.error("You must be logged in to view this page.");
          navigate("/login");
        }
      } catch (error) {
        toast(error.response ? error.response.data.message : "Something went wrong");
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, [navigate]);

  useEffect(() => {
    // Filter cities based on the input text
    const filtered = cities.filter((city) =>
      city.name.toLowerCase().includes(filter.toLowerCase()) ||
      city.subtitle.toLowerCase().includes(filter.toLowerCase()) ||
      city.createdAt.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [filter, cities]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };
        await axios.delete(`http://localhost:5001/api/cities/${id}`, { headers });
        setCities(cities.filter((city) => city._id !== id));
        setFilteredCities(filteredCities.filter((city) => city._id !== id));
        toast.success("City deleted successfully!");
      } else {
        toast("Please login to delete city");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      toast(error.response ? error.response.data.message : "Something went wrong");
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("Error deleting city:", error);
      }
    }
  };

  return (
    <>
      <LeftMenu>
        <CityListWrapper>
          <Title>Cities</Title>
          <Button onClick={() => navigate("/cities/create")}>Add New City</Button>
&nbsp;
          {/* Filter Input */}
          <FilterInput
            type="text"
            placeholder="Search cities by name, subtitle, or description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          {/* Table View for Cities */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Subtitle</TableHeader>
                  <TableHeader>Create At</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </tr>
              </thead>
              <tbody>
                {filteredCities.map((city) => (
                  <TableRow key={city._id}>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{city.subtitle}</TableCell>
                    <TableCell>{city.createdAt}</TableCell>
                    <TableCell>
                      <Button onClick={() => navigate(`/cities/edit/${city._id}`)}>
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(city._id)}
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
    </>
  );
};

export default CityListPage;
