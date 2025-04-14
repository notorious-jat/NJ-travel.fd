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


const CalculationBox = styled.div`
  background-color: #f4f4f4;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  border: 1px solid #ccc;
`;

const Formula = styled.div`
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const Value = styled.span`
  font-weight: bold;
  color: #007bff;
`;

const TotalAmount = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #28a745;
  margin-top: 1rem;
`;

const RoomList = styled.div`
display:grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap:10px;
`

const RoomCard = styled.div`
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.06);
    background-color: #fdfdfd;
  }

  &.selected {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
`;

const RoomName = styled.h4`
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
`;

const RoomDescription = styled.p`
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
`;

const RoomPrice = styled.p`
  font-weight: bold;
  font-size: 15px;
  color: #000;
`;

const RoomLabel = styled.label`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 14px;
  color: #444;
`;

const RoomRadio = styled.input`
  margin-right: 10px;
  accent-color: #1890ff;
`;

const CheckoutPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [packageDetail, setPackageDetail] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [usersData, setUsersData] = useState([{ name: "", contactInfo: "" }]);
  const [isAllDataValid, setIsAllDataValid] = useState(false);
  const [selectRoom, setSelectRoom] = useState(null);
  const [roomQty, setRoomQty] = useState(1);
  const [showPayment, setShowPayment] = useState(false)
  const [clientSecret, setClientSecret] = useState(""); // Store the client secret
  const [publicKey, setPublicKey] = useState("");
  const [stripePromise, setStripePromise] = useState(null); // store stripePromise
  const [selectedImage, setSelectedImage] = useState(null);
  const [startDate, setStartDate] = useState(null); // New state for start date
  const [numOfDays, setNumOfDays] = useState(1); // New state for number of days
  const [isAvailable, setIsAvailable] = useState(false); // State for availability check result
  const [roomBill,setRoomBill] = useState({name:null,description:null,price:0,includeWithPackage:null,quantity:null})

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
          // Find index of the room that has includeWithPackage true
          const selectedRoom = response.data.data.rooms.find((room) => room.includeWithPackage);

          setShowPayment(response.data.data.rooms.length == 0 ? true : false)

          setSelectRoom(selectedRoom ? selectedRoom._id : null);
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
            numOfDays
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

  const handleUserDataChange = (index, field, value) => {
    const updatedUsers = [...usersData];
    updatedUsers[index][field] = value;
    setUsersData(updatedUsers);
  };

  const saveUserDetail = () => {
    let allValid = true;
  
    usersData.forEach((user, index) => {
      const nameValid = user.name.trim().length > 0;
      const contactInfo = user.contactInfo.trim();
      const contactValid = (
        contactInfo.length >= 9 &&
        contactInfo.length <= 12 &&
        /^[9]\d*$/.test(contactInfo)
      );
  
      if (!nameValid) {
        toast.error(`User ${index + 1}: Name is required.`);
        allValid = false;
      }
  
      if (!contactValid) {
        toast.error(`User ${index + 1}: Contact must be 9-12 digits and start with 9.`);
        allValid = false;
      }
    });
  
    setIsAllDataValid(allValid);
  };
  

  useEffect(() => {
    const newData = Array.from({ length: quantity }, (_, i) => ({
      name: usersData[i]?.name || "",
      contactInfo: usersData[i]?.contactInfo || "",
    }));
    setUsersData(newData);
  }, [quantity]);

  const handleRoomSelect = (roomId) => {
    setSelectRoom(roomId);
  };
  const handlePay = () => {
    if(!selectRoom){
      toast.error('Please select a room');
      return
    }
    if(!roomQty || roomQty == "0"){
      toast.error('Please select a room quantity');
      return
    }
    if(roomQty > quantity){
      toast.error('Room quantity is more than users');
      return;
    }
    const selectedRoom = packageDetail.rooms.find((room) => room.includeWithPackage);
    if(selectedRoom){
      const newRoom = {
        name: selectedRoom.name,
        price: selectedRoom.includeWithPackage ? selectedRoom.price*(roomQty-1):selectedRoom.price*roomQty,
        quantity: roomQty,
        description:selectedRoom.description,
        includeWithPackage:selectedRoom.includeWithPackage
      }
      setRoomBill(newRoom)
    setShowPayment(true)
    }
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
                <Price>₹{packageDetail.price}/Day</Price>
                {!isAllDataValid ? <QuantityHandler initialQty={quantity} onQtyChange={setQuantity} /> : <div style={{ textAlign: 'start' }}>
                  {/* <p>
                    <strong>For Person:</strong> {quantity}</p>
                    <p>
                      <strong>For Days:</strong> {numOfDays}</p> */}
                  <CalculationBox>
                    <Formula>
                      Price Details: <Value>Price × Days × Quantity {roomQty > 1 ? `+ Room` : ''}</Value>
                    </Formula>
                    <Formula>
                      = <Value>₹{packageDetail.price}</Value> × <Value>{numOfDays}</Value> × <Value>{quantity}</Value> {roomBill?.price ? `+ ${roomBill.price}` : ''}
                    </Formula>
                    <TotalAmount>Total: ₹{(packageDetail.price * quantity * numOfDays)+roomBill?.price||0}</TotalAmount>
                  </CalculationBox>
                </div>}
                <div style={{ marginTop: '20px' }}>
                  {isAvailable ?
                    !isAllDataValid ?
                      <div>
                        {usersData.map((user, index) => (
                          <div key={index} style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
                            <InputField
                              type="text"
                              placeholder={`Name for user ${index + 1}`}
                              value={user.name}
                              onChange={(e) => handleUserDataChange(index, "name", e.target.value)}
                            />
                            <InputField
                              type="text"
                              placeholder={`Contact info for user ${index + 1}`}
                              value={user.contactInfo}
                              onChange={(e) => handleUserDataChange(index, "contactInfo", e.target.value)}
                            />
                          </div>
                        ))}
                        <AvailabilityButton onClick={saveUserDetail}>
                          Save User Details
                        </AvailabilityButton>
                      </div>
                      :
                      !showPayment ?
                        <div>
                          <h3>Rooms</h3>
                          <RoomList>
                            {packageDetail.rooms.map((room) => (
                              <RoomCard
                                key={room._id}
                                className={selectRoom === room._id ? "selected" : ""}
                                onClick={() => handleRoomSelect(room._id)}
                              >
                                <RoomName>{room.name}</RoomName>
                                <RoomDescription>{room.description}</RoomDescription>
                                <RoomPrice>₹ {room.price}</RoomPrice>
                              </RoomCard>
                            ))}
                          </ RoomList>
                          <div>

                            <label htmlFor="roomQty">Number of Rooms:</label>&nbsp;
                            <InputField
                              type="number"
                              id="roomQty"
                              min="1"
                              max={quantity}
                              placeholder="Enter Room Quantity"
                              value={roomQty}
                              onChange={(e) => setRoomQty(e.target.value)}
                            />
                          </div>
                          <AvailabilityButton onClick={handlePay}>&nbsp;
                            Pay Now
                          </AvailabilityButton>
                        </div>
                        :
                        <PaymentForm
                          clientSecret={clientSecret}
                          packageDetail={packageDetail}
                          quantity={quantity}
                          duration={numOfDays}
                          startDate={startDate}
                          usersData={usersData}
                          roomBill={roomBill}
                        />
                    : (
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
