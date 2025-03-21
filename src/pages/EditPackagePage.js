import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

const FormWrapper = styled.div`
  padding: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const EditPackagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    description: "",
    flightDetails: "",
    hotelDetails: "",
    sightseeingDetails: "",
    mealDetails: "",
    includesMeal: false,
    includesFlight: false,
    includesHotel: false,
    includesSightseeing: false,
    duration: "",
    price: 0,
    images: [],
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/travel/package/${id}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching package:", error);
        toast.error("Failed to fetch package.");
      }
    };
    fetchPackage();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        form.append(key, formData[key]);
      }
    });
    Array.from(formData.images).forEach((file) => form.append("images", file));

    try {
      await axios.put(`http://localhost:5001/api/travel/package/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Package updated successfully!");
      navigate(`/city/${formData.city}/packages`);
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error("Failed to update package.");
    }
  };

  return (
    <LeftMenu>
      <FormWrapper>
        <h2>Edit Travel Package</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Package Name"
            required
          />
          <InputField
            type="text"
            placeholder="City Sub Title"
            value={formData.subtitle}
            onChange={handleChange}
            name="subtitle"
            required
          />
          <InputField
            type="text"
            placeholder="City Description"
            value={formData.description}
            onChange={handleChange}
            name="description"
            required
          />
          <div>
            <label>
              <input
                type="checkbox"
                name="includesMeal"
                checked={formData.includesMeal}
                onChange={handleChange}
              />
              Includes Meal
            </label>
            <label>
              <input
                type="checkbox"
                name="includesFlight"
                checked={formData.includesFlight}
                onChange={handleChange}
              />
              Includes Flight
            </label>
            <label>
              <input
                type="checkbox"
                name="includesHotel"
                checked={formData.includesHotel}
                onChange={handleChange}
              />
              Includes Hotel
            </label>
            <label>
              <input
                type="checkbox"
                name="includesSightseeing"
                checked={formData.includesSightseeing}
                onChange={handleChange}
              />
              Includes Sightseeing
            </label>
          </div>
          <TextArea
            name="flightDetails"
            value={formData.flightDetails}
            onChange={handleChange}
            placeholder="Flight Details"
            required
          />
          <TextArea
            name="hotelDetails"
            value={formData.hotelDetails}
            onChange={handleChange}
            placeholder="Hotel Details"
            required
          />
          <TextArea
            name="sightseeingDetails"
            value={formData.sightseeingDetails}
            onChange={handleChange}
            placeholder="Sightseeing Details"
            required
          />
          <TextArea
            name="mealDetails"
            value={formData.mealDetails}
            onChange={handleChange}
            placeholder="Meal Details"
            required
          />
          <InputField
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration"
            required
          />
          <InputField
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />

          <InputField type="file" multiple onChange={handleImageChange} />
          <button type="submit">Update Package</button>
        </form>
      </FormWrapper>
    </LeftMenu>
  );
};

export default EditPackagePage;
