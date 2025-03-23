// src/components/CityCard.js
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const CityCardWrapper = styled.div`
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

const CityCardImage = styled.img`
  width: 100%;
  height: 85%;
  object-fit: cover;
`;

const CityCardContent = styled.div`
  padding: 5px 10px;
  background-color: #fff;
  color: #000;
  text-decoration: none;
`;

const CityCard = ({ city }) => {
  return (
    <CityCardWrapper>
      <Link to={`/city/${city._id}`} style={{textDecoration:'none'}}>
        <CityCardImage
          src={
            city.images.length ? `http://localhost:5001\\${city.images[0]}` : ""
          }
          alt={city.name}
        />
        <CityCardContent>
          <h3 style={{lineHeight:'21px',margin:0,textTransform:'uppercase'}}>{city.name}</h3>
          <p style={{fontSize:'12px',lineHeight:'18px',margin:0}}>{city.subtitle}</p>
        </CityCardContent>
      </Link>
    </CityCardWrapper>
  );
};

export default CityCard;
