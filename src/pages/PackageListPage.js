import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";
import styled from "styled-components";

// Styled components for the card layout
const CityListWrapper = styled.div`
  padding: 20px;
  margin-top: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const CardListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const PackageCard = styled.div`
  background: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 300px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

const CardTitle = styled.h3`
  font-size: 18px;
  color: #34495e;
`;

const CardContent = styled.p`
  color: #7f8c8d;
  font-size: 14px;
  margin: 5px 0;
`;

const Button = styled.button`
  background-color: #34495e;
  color: #fff;
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

const PackageListPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

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
        // Display other errors
        console.error(
          "Error creating city:",
          error.response ? error.response.data.message : error
        );
      }
      }
    };
    fetchPackages();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/travel/package/${id}`);
      setPackages(packages.filter((pkg) => pkg._id !== id));
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

          {/* Card View */}
          <CardListWrapper>
            {packages.map((pkg) => (
              <PackageCard key={pkg._id}>
                {pkg.images && pkg.images.length > 0 && (
                  <img
                    src={`http://localhost:5001/${pkg.images[0]}`}
                    alt={pkg.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  />
                )}
                <CardTitle>{pkg.name}</CardTitle>
                <CardContent>Owner: {pkg.createdBy.username}</CardContent>
                <CardContent>Description: {pkg.description.slice(0,100)}</CardContent>
                <Button onClick={() => handleEdit(pkg._id)}>Edit</Button>&nbsp;
                <Button onClick={() => handleDelete(pkg._id)}>Delete</Button>
              </PackageCard>
            ))}
          </CardListWrapper>
        </CityListWrapper>
      </LeftMenu>
    </div>
  );
};

export default PackageListPage;
