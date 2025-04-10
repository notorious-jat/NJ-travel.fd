import React from "react";
import styled, { keyframes } from "styled-components";

// Animation for shimmer effect
const shimmer = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

const SkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
  background-color: #f9f9f9;
`;

const CardSkeleton = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
  max-width: 800px;
  margin: auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageSkeleton = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 12px;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 1.6s infinite linear;
`;

const TextGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextSkeleton = styled.div`
  height: ${({ height }) => height || "16px"};
  width: ${({ width }) => width || "100%"};
  border-radius: 8px;
  background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 1.6s infinite linear;
`;

const Loader = () => {
  return (
    <SkeletonWrapper>
      {/* You can duplicate this to show multiple loading cards */}
      <CardSkeleton>
        <ImageSkeleton />
        <TextGroup>
          <TextSkeleton width="60%" height="20px" />
          <TextSkeleton width="80%" />
          <TextSkeleton width="40%" />
          <TextSkeleton width="90%" />
          <TextSkeleton width="30%" />
        </TextGroup>
      </CardSkeleton>
    </SkeletonWrapper>
  );
};

export default Loader;
