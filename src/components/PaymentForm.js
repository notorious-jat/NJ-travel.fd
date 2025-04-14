import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled components

const CardInputWrapper = styled.div`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #ff6347;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 10px;

  &:hover {
    background-color: #e55347;
  }

  &:disabled {
    background-color: #d1d1d1;
    cursor: not-allowed;
  }
`;

const PaymentForm = ({ clientSecret, packageDetail, quantity ,duration,usersData,startDate,roomBill}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      toast.error("Payment failed: " + error.message);
    } else if (paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");
      let data = {
        amount:(packageDetail.price*quantity*duration)+roomBill?.price||0, quantity, paymentId:paymentIntent.id, travel:packageDetail._id,duration,startDate,usersData,roomDetails:roomBill
      }
      try {
            const token = localStorage.getItem("token");
            if (token) {
              let headers = { authorization: `Bearer ${token}` };
              const response = await axios.post(
                `http://localhost:5001/api/travel/checkout/package`,
                data,
                { headers }
              );
              localStorage.removeItem('cart')
              toast.success("Package purchased successfully!");
              if(response?.data?.package?._id){
                navigate("/myorders/"+response.data.package?._id)
              }else{
                navigate(`/myorders`);
              }
              return;
            } else {
              toast.error("Please login to prchase a package");
              localStorage.removeItem("token");
              navigate("/login"); // Redirect to login page
            }
          } catch (error) {
            toast(
              error.response ? error.response.data.message : "Something went wrong"
            );
              if (error.response && error.response.status === 401) {
                // If the error status is 401, log out the user
                localStorage.removeItem("token");
                navigate("/login"); // Redirect to login page
              } else {
                // Display other errors
                console.error(
                  "Error while purchasing package:",
                  error.response ? error.response.data.message : error
                );
              }
          }
      // You can handle success here, like navigating to a different page
    }
  };

  return (
    <>
      {/* Card Input */}
      <CardInputWrapper>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              letterSpacing: '0.025em',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              borderRadius: '8px',
            },
          },
        }} />
      </CardInputWrapper>

      {/* Checkout Button */}
      <CheckoutButton onClick={handlePayment}>
        Pay ₹{(packageDetail.price * quantity*duration)+roomBill?.price||0}
      </CheckoutButton>
    </>
  );
};

export default PaymentForm;
