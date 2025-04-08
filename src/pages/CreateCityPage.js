import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

const FormWrapper = styled.div`
  padding: 5px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
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

const CreateCityPage = () => {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState([]); // Change name from `setImage` to `setImages` for clarity
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (token) {
        let headers = { authorization: `Bearer ${token}` };
        const formData = new FormData();
        formData.append("name", name);
        formData.append("subtitle", subtitle);
        formData.append("description", desc);

        // Append all selected images to FormData
        if (images.length > 0) {
          Array.from(images).forEach((image) => {
            formData.append("images", image); // Append each file
          });
        }

        await axios.post("http://localhost:5001/api/cities", formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        });
        navigate("/cities");
      } else {
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login page
      }
    } catch (error) {
      toast(
        error.response ? error.response.data.message : "Something went wrong"
      );
      if (error.response && error.response.status === 401) {
        // If the error status is 401, log out the user
        localStorage.clear();
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

  // Handle image file selection (multiple files)
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setImages(files); // Store files (FileList object)
    }
  };

  return (
    <LeftMenu>
      <FormWrapper>
        <h2>Create New City</h2>
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
          />
<textarea
  placeholder="City Description"
  value={desc}
  onChange={(e) => setDesc(e.target.value)}
  rows="4" // Adjust the number of rows as needed
  style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
></textarea>


          <InputField
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <Button type="submit">Create City</Button>
        </form>
      </FormWrapper>
    </LeftMenu>
  );
};

export default CreateCityPage;
