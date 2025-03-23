import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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

const CreatePackagePage = () => {
  const { cityId } = useParams();
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
    status: "active",
    city: "",
    images: [],
  });

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/cities");
        setCities(response.data);
      } catch (error) {
        toast(
          error.response ? error.response.data.message : "Something went wrong"
        );
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Error fetching cities:", error);
        }
      }
    };
    fetchCities();
  }, []);

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
        const response = await axios.post(
          `http://localhost:5001/api/travel/package`,
          form,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } }
        );
        toast.success("Package created successfully!");
        navigate(`/cities/package`);
      } else {
        toast.error("Please login to create a package");
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
            "Error creating city:",
            error.response ? error.response.data.message : error
          );
        }
    }
  };

  return (
    <LeftMenu>
      <FormWrapper>
        <h2>Create New Travel Package</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Package Name"
            required
          />
          {/* City Dropdown */}
          <SelectField
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name}
              </option>
            ))}
          </SelectField>
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

          {/* Checkbox fields */}
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
            disabled={!formData.includesFlight}
          />
          <TextArea
            name="hotelDetails"
            value={formData.hotelDetails}
            onChange={handleChange}
            placeholder="Hotel Details"
            disabled={!formData.includesHotel}
          />
          <TextArea
            name="sightseeingDetails"
            value={formData.sightseeingDetails}
            onChange={handleChange}
            placeholder="Sightseeing Details"
            disabled={!formData.includesSightseeing}
          />
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
            placeholder="Duration (e.g., 3 days 2 nights)"
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

          {/* Status Dropdown */}
          <SelectField
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </SelectField>

          <InputField type="file" multiple onChange={handleImageChange} />
          <button type="submit">Create Package</button>
        </form>
      </FormWrapper>
    </LeftMenu>
  );
};

export default CreatePackagePage;
