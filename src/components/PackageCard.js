// src/components/PackageCard.js
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const PackageCardWrapper = styled.div`
  width: 300px;
  margin: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const PackageCardImage = styled.img`
  width: 100%;
  height: 60%;
  object-fit: cover;
`;

const PackageCardContent = styled.div`
  padding: 15px;
  background-color: #f9f9f9;
`;

const PackageCard = ({ packageItem }) => {
  return (
    <PackageCardWrapper>
      <Link to={`/package/${packageItem._id}`}>
        <PackageCardImage
          src={`http://localhost:5001\\${packageItem.images[0]}`}
          alt={packageItem.name}
        />
        <PackageCardContent>
          <h3>{packageItem.name}</h3>
          <p>{packageItem.price} USD</p>
        </PackageCardContent>
      </Link>
    </PackageCardWrapper>
  );
};

export default PackageCard;
