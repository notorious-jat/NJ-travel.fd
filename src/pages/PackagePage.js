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

const PackagePage = ({ match }) => {
  const { id } = useParams(); // Use useParams to get the 'id' from the URL
  const [packageDetail, setPackageDetail] = useState(null);
  const [qty,setQty] = useState(1);

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

  const buyNowHandler = ()=>{
    let token = localStorage.getItem('token');
    if(token){
      if(qty){
        const data = {
          package_id: id,
          quantity: qty
          }
          localStorage.setItem("cart",JSON.stringify(data));
          window.location.href = '/checkout'
      }else{
        toast.error('Please select quantity');
      }
    }else{
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
            <QuantityHandler onQtyChange={setQty}/>
            <button onClick={buyNowHandler}>buy now</button>

          </PackageDetails>
        </div>
      )}
    </section>
  );
};

export default PackagePage;
