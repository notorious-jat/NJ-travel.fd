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


const SelectField = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ImagePreview = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;

  img {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
  }
`;

const Button = styled.button`
  background-color: #34495e;
  color:#fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
  background-color: #fff;
  color:#34495e;
  }
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
    status:"",
    images: [],
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get(
            `http://localhost:5001/api/travel/package/${id}`, { headers }
          );
          setFormData(response.data.data);
        } else {
          navigate("/login");

        }
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
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };
        await axios.put(`http://localhost:5001/api/travel/package/${id}`, form, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
        toast.success("Package updated successfully!");
        navigate(`/cities/package`);
      } else {
        navigate("/login");

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
          "Error creating city:",
          error.response ? error.response.data.message : error
        );
      }
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
          <label>
            <input
              type="checkbox"
              name="includesFlight"
              checked={formData.includesFlight}
              onChange={handleChange}
            />
            Includes Flight
          </label>
          <TextArea
            name="flightDetails"
            value={formData.flightDetails}
            onChange={handleChange}
            placeholder="Flight Details"
            disabled={!formData.includesFlight}
          />
          <label>
            <input
              type="checkbox"
              name="includesHotel"
              checked={formData.includesHotel}
              onChange={handleChange}
            />
            Includes Hotel
          </label>
          <TextArea
            name="hotelDetails"
            value={formData.hotelDetails}
            onChange={handleChange}
            placeholder="Hotel Details"
            disabled={!formData.includesHotel}
          />
          <label>
            <input
              type="checkbox"
              name="includesSightseeing"
              checked={formData.includesSightseeing}
              onChange={handleChange}
            />
            Includes Sightseeing
          </label>
          <TextArea
            name="sightseeingDetails"
            value={formData.sightseeingDetails}
            onChange={handleChange}
            placeholder="Sightseeing Details"
            
            disabled={!formData.includesSightseeing}
          />
          <label>
            <input
              type="checkbox"
              name="includesMeal"
              checked={formData.includesMeal}
              onChange={handleChange}
            />
            Includes Meal
          </label>
          <TextArea
            name="mealDetails"
            value={formData.mealDetails}
            onChange={handleChange}
            placeholder="Meal Details"
            
            disabled={!formData.includesMeal}
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
          {formData.images.length > 0 && (
            <ImagePreview>
              {formData.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5001/${image}`}
                  alt={`City Image ${index + 1}`}
                />
              ))}
            </ImagePreview>
          )}
          <InputField type="file" multiple onChange={handleImageChange} />
          <SelectField
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>
          <Button type="submit">Update Package</Button>
        </form>
      </FormWrapper>
    </LeftMenu>
  );
};

export default EditPackagePage;
