// src/pages/PackagePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import HeroSlider from "../components/Slider";
import Navbar from "../components/Navbar";
import { MdAttachMoney, MdBalcony, MdDepartureBoard, MdDescription, MdDetails, MdFlightTakeoff, MdHotel, MdKitchen } from "react-icons/md";
import { toast } from "react-toastify";
import QuantityHandler from "../components/QuantityHandler";


const PackageDetails = styled.div`
  margin: 0 5%;
  padding: 20px;
`;
const TextHolder = styled.p`
font-size:18px;
line-height:24px;
display:inline;
`
const TextContainer = styled.div`
margin-bottom:10px;
`
const ReviewSection = styled.div`
  margin: 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
   display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 2 columns, each taking 50% */
  gap: 20px;  /* Adds space between the grid items */
`;

const RateHolder = styled.div`
 display: flex;
 justify-content:space-between;
 
`

const ReviewCard = styled.div`
  margin-bottom: 0;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ReviewText = styled.p`
  color: #555;
  font-size:14px;
  margin:2px 0;
`;

const ReviewDate = styled.small`
  color: #888;
  font-size: 0.9rem;
`;
const StarContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 0;
`;

const Star = styled.span`
  font-size: 1rem;
  cursor: pointer;
  color: ${(props) => (props.filled ? '#ff6347' : '#ccc')};
`;
const Button = styled.button`
  background-color: #ff6347;
  color:#fff;
  border: 1px solid #ff6347;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width:150px;
  height:50px;
  font-size:1.5rem;
  text-transform:uppercase;

  &:hover {
  background-color: #fff;
  color:#ff6347;
  }
`;

const PackagePage = ({ match }) => {
  const { id } = useParams(); // Use useParams to get the 'id' from the URL
  const [packageDetail, setPackageDetail] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchPackageData = async () => {
      const response = await axios.get(
        `http://localhost:5001/api/travel/package/${id}`
      );
      console.log({ response });
      setPackageDetail(response.data.data);
    };

    fetchPackageData();
  }, []);

  const buyNowHandler = () => {
    let token = localStorage.getItem('token');
    if (token) {
      if (qty) {
        const data = {
          package_id: id,
          quantity: qty
        }
        localStorage.setItem("cart", JSON.stringify(data));
        window.location.href = '/checkout'
      } else {
        toast.error('Please select quantity');
      }
    } else {
      toast.error('Please login to buy this package');
    }
  }

  return (
    <section>
      <Navbar />
      {packageDetail && (
        <div>
          <HeroSlider
            images={packageDetail.images}
            title={packageDetail.name}
            desc={packageDetail.subtitle}
          />
          <PackageDetails>
            <TextContainer><MdDescription size={52} />
              <TextHolder>{packageDetail.description}</TextHolder>
            </TextContainer>
            {packageDetail.includesFlight ? <TextContainer><MdFlightTakeoff size={52} /><TextHolder> {packageDetail.flightDetails}</TextHolder></TextContainer> : null}
            {packageDetail.includesHotel ?
              <TextHolder><MdHotel size={52} /> {packageDetail.hotelDetails}</TextHolder>
              : null}
            {packageDetail.includesMeal ?
              <TextContainer>
                <MdKitchen size={52} /><TextHolder> {packageDetail.mealDetails}</TextHolder>
              </TextContainer>
              : null}
            {packageDetail.includesSightseeing ? <TextContainer>
              <MdBalcony size={52} /><TextHolder> {packageDetail.sightseeingDetails}</TextHolder>
            </TextContainer>
              : null}
            <TextContainer>

              <MdAttachMoney size={52} /><TextHolder> {packageDetail.price} USD</TextHolder>
            </TextContainer>
            <TextContainer>

              <MdDepartureBoard size={52} /><TextHolder> {packageDetail.duration}</TextHolder>
            </TextContainer>
            <div style={{display:'flex',gap:'10px',alignItems:'center',position:'sticky',bottom:'10px',zIndex:11}}>
            <QuantityHandler onQtyChange={setQty} />
            <Button onClick={buyNowHandler}>Try now</Button>
            </div>
            <div>
              <ReviewSection>
                {packageDetail.reviews.map((review, idx) => (
                  <ReviewCard key={idx}>
                    <RateHolder>
                      <StarContainer>
                        {[1, 2, 3, 4, 5].map((starIndex) => (
                          <Star
                          key={starIndex}
                          filled={starIndex <= review.rating}
                          >
                            ★
                          </Star>
                        ))}
                      </StarContainer>
                      <ReviewDate>Reviewed on: {new Date(review.date).toLocaleDateString()}</ReviewDate>
                    </RateHolder>
                        <h3 style={{margin:'4px 0'}}>{review.user.username}</h3>
                    <ReviewText>{review.description}</ReviewText>
                  </ReviewCard>
                ))}
              </ReviewSection>
            </div>
          </PackageDetails>
        </div>
      )}
    </section>
  );
};

export default PackagePage;
