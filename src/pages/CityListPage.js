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
  color: #2c3e50;
  margin-bottom: 20px;
`;

const CardListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
`;

const CityCard = styled.div`
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
  margin-top: 10px;

  &:hover {
    background-color: #fff;
    color: #34495e;
  }
`;

const CityListPage = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get("http://localhost:5001/api/cities", { headers });
          setCities(response.data);
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
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };
        await axios.delete(`http://localhost:5001/api/cities/${id}`, { headers });
        setCities(cities.filter((city) => city._id !== id));
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
          <Button onClick={() => navigate("/cities/create")}>
            Add New City
          </Button>

          {/* Card View for Cities */}
          <CardListWrapper>
            {cities.map((city) => (
              <CityCard key={city._id}>
                {city.images && city.images.length > 0 && (
                  <img
                    src={`http://localhost:5001/${city.images[0]}`}
                    alt={city.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "15px",
                    }}
                  />
                )}
                <CardTitle>{city.name}</CardTitle>
                <CardContent>{city.desc}</CardContent>
                <div>
                  <Button onClick={() => navigate(`/cities/edit/${city._id}`)}>
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(city._id)} style={{ marginLeft: "10px" }}>
                    Delete
                  </Button>
                </div>
              </CityCard>
            ))}
          </CardListWrapper>
        </CityListWrapper>
      </LeftMenu>
    </>
  );
};

export default CityListPage;
