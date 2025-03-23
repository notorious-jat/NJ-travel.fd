// src/components/PackageCard.js
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const PackageCardWrapper = styled.div`
  width: 300px;
  height: 400px;
  margin: 20px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const PackageCardImage = styled.img`
  width: 100%;
  height: 80%;
  object-fit: cover;
`;

const PackageCardContent = styled.div`
 padding: 5px 10px;
  background-color: #fff;
  color: #000;
  text-decoration: none;
`;

const PackageCard = ({ packageItem }) => {
  return (
    <PackageCardWrapper>
      <Link to={`/package/${packageItem._id}`} style={{ textDecoration: 'none' }}>
        <PackageCardImage
          src={`http://localhost:5001\\${packageItem.images[0]}`}
          alt={packageItem.name}
        />
        <PackageCardContent>
          <h3 style={{ lineHeight: '24px', margin: 0, textTransform: 'uppercase' }}>{packageItem.name}</h3>
          <p style={{ fontSize: '12px', lineHeight: '18px', margin: '10px 0 0' }}>Price: ${packageItem.price} USD/person</p>
        </PackageCardContent>
      </Link>
    </PackageCardWrapper>
  );
};

export default PackageCard;
