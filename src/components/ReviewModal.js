import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.show ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Title = styled.h3`
  font-size: 1.8rem;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const Star = styled.span`
  font-size: 2rem;
  cursor: pointer;
  color: ${(props) => (props.filled ? '#FFD700' : '#ccc')};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 1.2rem;

  &:hover {
    background-color: #45a049;
  }
`;

const ReviewModal = ({ showModal, setShowModal, packageId, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle star click
  const handleStarClick = (starIndex) => {
    setRating(starIndex);
  };

  // Handle review description change
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  // Submit review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in first');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/travel/package/${packageId}/review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          description: description,
          user: localStorage.getItem('userId'), // Assuming you have the user ID in localStorage
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onReviewSubmit('Review submitted successfully!');
        setShowModal(false);
      } else {
        onReviewSubmit('Error submitting review: ' + data.error);
      }
    } catch (error) {
      onReviewSubmit('An error occurred: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalOverlay show={showModal}>
      <ModalContainer>
        <ModalHeader>
          <Title>Submit Your Review</Title>
          <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
        </ModalHeader>

        <StarContainer>
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <Star
              key={starIndex}
              filled={starIndex <= rating}
              onClick={() => handleStarClick(starIndex)}
            >
              ★
            </Star>
          ))}
        </StarContainer>

        <TextArea
          value={description}
          onChange={handleDescriptionChange}
          rows={4}
          placeholder="Write your review..."
        />

        <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </SubmitButton>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ReviewModal;
