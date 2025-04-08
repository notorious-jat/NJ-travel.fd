import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import PackageCard from "../components/PackageCard";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Template from "../components/Template";

const SelectField = styled.select`
  width: 40%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const InputField = styled.input`
  width: 40%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const CityPageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

const Explore = () => {
  const [cities, setCities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCityData = async () => {
      const cityResponse = await axios.get("http://localhost:5001/api/cities");
      setCities(cityResponse.data);

      const packagesResponse = await axios.get("http://localhost:5001/api/travel/all");
      setPackages(packagesResponse?.data?.data || []);
    };

    fetchCityData();
  }, []);

  // Memoizing the filtered packages based on selected city and search query
  const filteredPackages = useMemo(() => {
    return packages.filter((packageItem) => {
      // Filter by city id
      const cityMatch = selectedCity
        ? packageItem.city._id === selectedCity
        : true;
      
      // Filter by package name or price search query
      const searchMatch =
        packageItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        packageItem.price.toString().includes(searchQuery);

      return cityMatch && searchMatch;
    });
  }, [selectedCity, searchQuery, packages]);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearFilters = () => {
    setSelectedCity("");
    setSearchQuery("");
  };

  return (
    <Template>

      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto",display:'flex',gap:'5px',alignItems:'center' }}>
        <SelectField name="city" value={selectedCity} onChange={handleCityChange}>
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>
              {city.name}
            </option>
          ))}
        </SelectField>

        <InputField
          type="text"
          placeholder="Search packages by name or price..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        
        <button onClick={clearFilters} style={{padding:'10px',border:'1px solid #ccc',borderRadius:'5px',cursor:'pointer'}}>X</button>
      </div>

      {filteredPackages.length > 0 ? (
        <div>
          <h3 style={{ margin: "2% 5% 0",fontSize:'22px' }}>Explore Packages:</h3>
          <CityPageWrapper>
            {filteredPackages.map((packageItem) => (
              <PackageCard key={packageItem._id} packageItem={packageItem} />
            ))}
          </CityPageWrapper>
        </div>
      ) : (
        <div style={{width:'100%',display:'grid',placeContent:'center'}}>
        <p>No data found</p>
    </div>
      )}
    </Template>
  );
};

export default Explore;
