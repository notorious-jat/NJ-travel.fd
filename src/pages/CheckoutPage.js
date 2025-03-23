// CheckoutPage.js
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

// Styled components here (same as before) ...
// Styled components
const CheckoutWrapper = styled.div`
  display: flex;
  height:88vh;
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
  margin-bottom: 20px;
  text-align:start;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const QuantityButton = styled.button`
  background-color: #f7c41f;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin: 10px;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 5px;
  text-align: center;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
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

const ImageSlider = styled.div`
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 10px;
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

const CheckoutPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [packageDetail, setPackageDetail] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [clientSecret, setClientSecret] = useState(""); // Store the client secret
  const [publicKey, setPublicKey] = useState("");
  const [stripePromise, setStripePromise] = useState(null); // store stripePromise
  const [selectedImage, setSelectedImage] = useState(null);
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
          console.error(error);
          toast.error("Error verifying token");
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
    if (cart.quantity) {
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
    setSelectedImage(packageDetail?.images?.[0])
  }, [packageDetail])

  useEffect(() => {
    if (publicKey) {
      setStripePromise(loadStripe(publicKey)); // Set stripePromise once the publicKey is available
    }
  }, [publicKey]);

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };

  if (!isLoggedIn || !packageDetail) {
    return <div>Loading...</div>;
  }

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

                <Price>${packageDetail.price}</Price>

                <QuantityWrapper>
                  <QuantityButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                  />
                  <QuantityButton onClick={() => setQuantity(quantity + 1)}>+</QuantityButton>
                </QuantityWrapper>

                {/* Render the PaymentForm */}
                <PaymentForm
                  clientSecret={clientSecret}
                  packageDetail={packageDetail}
                  quantity={quantity}
                />
              </PaymentWrapper>
            </ProductInfoWrapper>
          </CheckoutWrapper>
        </Elements>
      )}
    </>
  );
};

export default CheckoutPage;
