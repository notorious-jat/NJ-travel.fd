// src/pages/CityPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import PackageCard from "../components/PackageCard";
import styled from "styled-components";
import { useParams } from "react-router-dom"; // Import useParams
import HeroSlider from "../components/Slider";
import Navbar from "../components/Navbar";
const CityPageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

const CityPage = () => {
  const { id } = useParams(); // Use useParams to get the 'id' from the URL
  const [city, setCity] = useState(null);
  const [packages, setPackages] = useState([]);
  useEffect(() => {
    const fetchCityData = async () => {
      // Fetch the city info
      const cityResponse = await axios.get(
        `http://localhost:5001/api/cities/${id}`
      );
      setCity(cityResponse.data);

      // Fetch packages for the city
      const packagesResponse = await axios.get(
        `http://localhost:5001/api/travel/city/${id}/packages`
      );
      setPackages(packagesResponse?.data?.data || []);
    };

    fetchCityData();
  }, [id]);

  return (
    <div>
      {city && (
        <div>
          <Navbar />
          <HeroSlider
            images={city.images}
            title={city.title}
            desc={city.description}
          />
          {packages || packages.length ? (
            <>
              <h3>Explore Packages:</h3>
              <CityPageWrapper>
                {packages?.map((packageItem) => (
                  <PackageCard
                    key={packageItem._id}
                    packageItem={packageItem}
                  />
                ))}
              </CityPageWrapper>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CityPage;
