// src/pages/CityListPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

const CityListWrapper = styled.div`
  padding: 5px;
`;

const CityCard = styled.div`
  background: #f7f7f7;
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CityListPage = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/cities");
        setCities(response.data);
      } catch (error) {
        toast(
          error.response ? error.response.data.message : "Something went wrong"
        );
        if (error.response && error.response.status === 401) {
          // If the error status is 401, log out the user
          localStorage.removeItem("token");
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
    fetchCities();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };
        await axios.delete(`http://localhost:5001/api/cities/${id}`, {
          headers,
        });
        setCities(cities.filter((city) => city._id !== id));
      } else {
        toast("Please login to delete city");
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      toast(
        error.response ? error.response.data.message : "Something went wrong"
      );
      if (error.response && error.response.status === 401) {
        // If the error status is 401, log out the user
        localStorage.removeItem("token");
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

  return (
    <>
      <LeftMenu>
        <CityListWrapper>
          <h2>Cities</h2>
          <button onClick={() => navigate("/cities/create")}>
            Add New City
          </button>
          {cities.map((city) => (
            <CityCard key={city._id}>
              <div>
                <h3>{city.name}</h3>
                <p>{city.desc}</p>
              </div>
              <div>
                <button onClick={() => navigate(`/cities/edit/${city._id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(city._id)}>Delete</button>
              </div>
            </CityCard>
          ))}
        </CityListWrapper>
      </LeftMenu>
    </>
  );
};

export default CityListPage;
