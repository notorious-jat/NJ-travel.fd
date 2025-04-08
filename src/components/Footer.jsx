import React from 'react';
import styled from 'styled-components';

// Styled Footer component
const FooterConatiner = styled.footer`
  background-color: #000000; /* Black background */
  color: white; /* White text color */
  text-align: center;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
`;

// Styled span for the highlighted letter "T"
const Highlight = styled.span`
  color: #FF6347; /* Color for 'T' in Travel.io */
`;

const Footer = () => {
  return (
      <FooterConatiner>
        <p>&copy; 2025 <Highlight>T</Highlight>ravel.io | All Rights Reserved</p>
      </FooterConatiner>
  );
};

export default Footer;
