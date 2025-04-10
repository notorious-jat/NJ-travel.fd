import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Title = styled.h2`
// text-align:center;
margin-top:3rem;

`

const SliderWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
`;

const SlideContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
`;

const TestimonialCard = styled.div`
  width: 50%; /* Show two testimonials at a time */
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;

const UserImg = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 50%;
  margin-bottom: 10px;
  &:hover:{
    transform: scale(1.05);
    cursor:pointer;
  }
`;

const Name = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin: 10px 0;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  ${props => (props.left ? 'left: 0;' : 'right: 0;')}
  transform: translateY(-50%);
  font-size: 2rem;
  cursor: pointer;
  z-index: 1;
  padding:5px;
  color: #fff;
  background:#666;
  border-radius: 5px;
  &:hover{
    color: #333;
    background:#fff;
    border:0.5px solid #ccc;
  }
`;


const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recommendations from the API using fetch
    fetch('http://localhost:5001/api/travel/recommendations')
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data);
      })
      .catch((error) => {
        console.error('Error fetching recommendations:', error);
      });
  }, [recommendations.length]);

  const handleCardClick = (id) => {
    navigate(`/package/${id}`);
  };

  const goToNext = () => {
    if (currentIndex === recommendations.length - 2) {
      setCurrentIndex(0); // Reset to first set of recommendations
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex === 0) {
      setCurrentIndex(recommendations.length - 2); // Go to the last set of recommendations
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      goToNext();
    }, 180000); // 3 minutes in milliseconds

    return () => clearInterval(autoSlide); // Clear interval on unmount
  }, [currentIndex]);

  return (
    <>
      <Title>Recommended Packages</Title>
      <SliderWrapper>
        <Arrow left onClick={goToPrev}>&lt;</Arrow>
        <SlideContainer style={{ transform: `translateX(-${(currentIndex * 50)}%)` }}>
          {recommendations.map(rec => (
            <TestimonialCard key={rec._id}>
              <a href={`/package/${rec._id}`} style={{ textDecoration: 'none' }}>
                <UserImg src={'http://localhost:5001/' + rec?.images?.[0]} alt={rec.name} />
                <Name>{rec.name}</Name>
                <Description>{rec.description?.slice(0, 50)}</Description>
              </a>
            </TestimonialCard>
          ))}
        </SlideContainer>
        <Arrow onClick={goToNext}>&gt;</Arrow>
      </SliderWrapper>
    </>
  );
};

export default Recommendations;
