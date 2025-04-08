// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import CityCard from "../components/CityCard";
import styled from "styled-components";
import HeroSlider from "../components/Slider";
import Template from "../components/Template";

// Style for the HomePage container
const HomePageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

const HomePage = () => {
  const [cities, setCities] = useState([]);

  // useEffect(() => {
  //   const fetchCities = async () => {
  //     const response = await axios.get("http://localhost:5001/api/cities"); // Adjust based on your backend
  //     setCities(response.data);
  //   };

  //   fetchCities();
  // }, []);
  return (
    <Template>
      <HeroSlider
        images={["/1.jpg", "/2.jpg", "/3.jpg"]}
        baseUrl="http://localhost:3000"
        title="Embark on Your Dream Adventure Today!"
        desc="Discover breathtaking destinations, unforgettable experiences, and tailor-made tours that take you off the beaten path."
      />
      {cities.length ? (
        <>
          <h1 style={{ textAlign: "center", margin: "20px 0" }}>
            Explore Our Cities
          </h1>
          <HomePageWrapper>
            {cities.map((city) => (
              <CityCard key={city._id} city={city} />
            ))}
          </HomePageWrapper>
        </>
      ) : null}
    </Template>
  );
};

export default HomePage;
