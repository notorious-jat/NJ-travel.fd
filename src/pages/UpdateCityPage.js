import React, { useState, useEffect } from "react";
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

const UpdateCityPage = () => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [currentImages, setCurrentImages] = useState([]); // Store current images
  const [newImages, setNewImages] = useState([]); // Store new images
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the current city details (name, description, images)
  useEffect(() => {
    const fetchCity = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          let headers = { authorization: `Bearer ${token}` };
          const response = await axios.get(
            `http://localhost:5001/api/cities/${id}`, { headers }
          );
          setName(response.data.name);
          setSubtitle(response.data.subtitle);
          setDesc(response.data.description);
          setCurrentImages(response.data.images); // Assuming images are an array
        } else {
          alert("Please login first")
          navigate('/login')
        }
      } catch (error) {
        console.error("Error fetching city:", error);
        toast.error("Error fetching city details.");
      }
    };
    fetchCity();
  }, [id]);

  // Handle the image input change (multiple images)
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setNewImages(files); // Store new selected images
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("subtitle", subtitle);
    formData.append("description", desc);

    // Append new images to FormData if they are selected
    if (newImages.length > 0) {
      Array.from(newImages).forEach((image) => {
        formData.append("images", image); // Append each new file
      });
    }

    try {
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };

        // Send PUT request to update the city
        await axios.put(`http://localhost:5001/api/cities/${id}`, formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
        });

        navigate("/cities"); // Redirect after successful update
      } else {
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login if token is missing
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
        <h2>Update City</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            placeholder="City Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputField
            type="text"
            placeholder="City Sub Title"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
          />
          <textarea
            placeholder="City Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            rows="4" // Adjust the number of rows as needed
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          ></textarea>


          {/* Display current images as previews */}
          {currentImages.length > 0 && (
            <ImagePreview>
              {currentImages.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5001/${image}`}
                  alt={`City Image ${index + 1}`}
                />
              ))}
            </ImagePreview>
          )}

          <InputField
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          <Button type="submit">Update City</Button>
        </form>
      </FormWrapper>
    </LeftMenu>
  );
};

export default UpdateCityPage;
