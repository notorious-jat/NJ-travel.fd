// src/pages/PackagePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import HeroSlider from "../components/Slider";

const PackageDetails = styled.div`
  margin-top: 20px;
  padding: 20px;
`;

const PackagePage = ({ match }) => {
  const { id } = useParams(); // Use useParams to get the 'id' from the URL
  const [packageDetail, setPackageDetail] = useState(null);

  useEffect(() => {
    const fetchPackageData = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/travel/package/${id}`
      );
      console.log({ response });
      setPackageDetail(response.data.data);
    };

    fetchPackageData();
  }, []);

  return (
    <section>
      {packageDetail && (
        <div>
          <HeroSlider
            images={packageDetail.images}
            title={packageDetail.name}
          />
          <PackageDetails>
            <h3>Description:</h3>
            <p>{packageDetail.flightDetails}</p>
            <p>{packageDetail.hotelDetails}</p>
            <p>{packageDetail.sightseeingDetails}</p>
            <h3>Price: {packageDetail.price} USD</h3>
            <h3>Duration: {packageDetail.duration}</h3>
            <h3>
              Meals: {packageDetail.includesMeal ? "Included" : "Not Included"}
            </h3>
          </PackageDetails>
        </div>
      )}
    </section>
  );
};

export default PackagePage;
