import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import Navbar from "../components/Navbar";
import QuantityHandler from "../components/QuantityHandler";

// Styled components
const CheckoutWrapper = styled.div`
  display: flex;
  height: 88vh;
  justify-content: space-between;
  padding: 0 50px;
  background-color: #f4f4f4;
`;

const ProductInfoWrapper = styled.div`
  width: 50%;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 15px;
`;

const Description = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 20px;
  text-align: start;
`;

const ImageSliderWrapper = styled.div`
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainImageWrapper = styled.div`
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 10px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
`;
const ThumbnailsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  overflow-x: auto;
`;

const Thumbnail = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid ${(props) => (props.isSelected ? "#f7c41f" : "transparent")};
  transition: border 0.3s ease;

  &:hover {
    border: 2px solid #f7c41f;
  }
`;

const PaymentWrapper = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
`;

const InputField = styled.input`
  width: 60%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

const AvailabilityButton = styled.button`
  padding: 10px;
  margin: 10px 0;
  background-color: #f7c41f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #e5b11f;
  }
`;

const CheckoutPage = () => {
    const today = new Date().toISOString().split('T')[0];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [packageDetail, setPackageDetail] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [clientSecret, setClientSecret] = useState(""); // Store the client secret
  const [publicKey, setPublicKey] = useState("");
  const [stripePromise, setStripePromise] = useState(null); // store stripePromise
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState(null); // New state for start date
  const [numOfDays, setNumOfDays] = useState(1); // New state for number of days
  const [isAvailable, setIsAvailable] = useState(false); // State for availability check result

  const navigate = useNavigate();
  let id = null;
  let data = localStorage.getItem("cart");
  let cart = {};
  if (data) {
    cart = JSON.parse(data);
    if (cart?.package_id) {
      id = cart.package_id;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const verify = async () => {
        try {
          const response = await axios.post(
            "http://localhost:5001/api/auth/authCheck",
            { token }
          );
          if (response.data.status === 200) {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
            toast.error("Session expired. Please log in again.");
            navigate("/login");
          }
        } catch (error) {
          toast.error(
            error.response ? error.response.data.message : "Something went wrong"
          );
          if (error.response && error.response.status === 401) {
            // If the error status is 401, log out the user
            localStorage.removeItem("token");
            navigate("/login"); // Redirect to login page
          }
        }
      };
      verify();
    } else {
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!cart.quantity) {
      setQuantity(cart.quantity);
    }
    if (isLoggedIn && id) {
      const fetchPackageData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/travel/package/${id}`
          );
          setPackageDetail(response.data.data);
          // Get the client secret for the payment
          const paymentResponse = await axios.post("http://localhost:5001/checkout", {
            package_id: id,
            quantity: quantity,
          });
          setClientSecret(paymentResponse.data.clientSecret);
          setPublicKey(paymentResponse.data.publicKey);
        } catch (err) {
          console.error(err);
          toast.error("Error fetching package details");
        }
      };
      fetchPackageData();
    }
  }, [isLoggedIn, id, quantity]);
  useEffect(() => {
    setSelectedImage(packageDetail?.images?.[0]);
  }, [packageDetail]);
  
  useEffect(() => {
    if (publicKey) {
      setStripePromise(loadStripe(publicKey)); // Set stripePromise once the publicKey is available
    }
  }, [publicKey]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  // Availability check function
  const checkAvailability = async () => {
    if (!startDate || !numOfDays) {
      toast.error("Please select both start date and number of days.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };
        const response = await axios.post(
          "http://localhost:5001/api/travel/check-availability",
          {
            packageId: packageDetail._id,
            startDate,
            numOfDays,
          },
          { headers }
        );
        if (response.data.available) {
          setIsAvailable(true); // Set availability to true if the dates are available
        } else {
          setIsAvailable(false); // Set availability to false if the dates are not available
          toast.error(response.data.message); // Show the error message from the response
        }
      }
    } catch (error) {
      toast(error.response ? error.response.data.message : "Something went wrong");
      if (error.response && error.response.status === 401) {
        // If the error status is 401, log out the user
        localStorage.clear();
        navigate("/login"); // Redirect to login page
      }
    }
  };

  return (
    <>
      <Navbar />
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutWrapper>
            <ImageSliderWrapper>
              {/* Main Image */}
              <MainImageWrapper>
                <Image
                  src={`http://localhost:5001/${selectedImage}`}
                  alt="Package Main Image"
                />
              </MainImageWrapper>

              {/* Thumbnails */}
              <ThumbnailsWrapper>
                {packageDetail.images.map((image, index) => (
                  <Thumbnail
                    key={index}
                    src={`http://localhost:5001/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => handleThumbnailClick(image)}
                    isSelected={selectedImage === image}
                  />
                ))}
              </ThumbnailsWrapper>
            </ImageSliderWrapper>

            <ProductInfoWrapper>
              <Title>{packageDetail.name}</Title>
              <Description>{packageDetail.subtitle}</Description>
              <PaymentWrapper>
                <Price>₹{packageDetail.price}</Price>
                <QuantityHandler initialQty={quantity} onQtyChange={setQuantity} />
                <div style={{ marginTop: '20px' }}>
                  {isAvailable ? (
                    <PaymentForm
                      clientSecret={clientSecret}
                      packageDetail={packageDetail}
                      quantity={quantity}
                      duration={numOfDays}
                      startDate={startDate}
                    />
                  ) : (
                    <>
                      <div>
                        <label htmlFor="startDate">Select Start Date:</label>&nbsp;
                        <InputField
                          type="date"
                          id="startDate"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={today}
                        />
                      </div>
                      <div>
                        <label htmlFor="numOfDays">Number of Days:</label>&nbsp;
                        <InputField
                          type="number"
                          id="numOfDays"
                          min="1"
                          max={packageDetail?.activities?.length}
                          value={numOfDays}
                          onChange={(e) => setNumOfDays(e.target.value)}
                        />
                      </div>
                      {/* {!startDate || !numOfDays ? (
                  <div style={{ color: "red" }}>
                    Please fill in both fields before checking availability.
                  </div>
                ) : ( */}
                      <AvailabilityButton onClick={checkAvailability}>
                        Check Availability
                      </AvailabilityButton>
                      {/* )} */}
                    </>
                  )}
                </div>
              </PaymentWrapper>
            </ProductInfoWrapper>
          </CheckoutWrapper>
        </Elements>
      )}
    </>
  );
};

export default CheckoutPage;
