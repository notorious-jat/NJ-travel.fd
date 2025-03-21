import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeftMenu from "../components/LeftMenu";

const PackageListPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/travel/city/packages`
        );

        setPackages(response.data.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast.error("Failed to load packages.");
      }
    };
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/travel/package/${id}`);
      setPackages(packages.filter((pkg) => pkg._id !== id));
      toast.success("Package deleted successfully!");
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/cities/package/edit/${id}`);
  };

  return (
    <div>
      <LeftMenu>
        <h2>Travel Packages</h2>
        <button onClick={() => navigate(`/cities/package/create`)}>
          Create New Package
        </button>
        <ul>
          {packages.map((pkg) => (
            <li key={pkg._id}>
              <h3>{pkg.name}</h3>
              <button onClick={() => handleEdit(pkg._id)}>Edit</button>
              <button onClick={() => handleDelete(pkg._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </LeftMenu>
    </div>
  );
};

export default PackageListPage;
