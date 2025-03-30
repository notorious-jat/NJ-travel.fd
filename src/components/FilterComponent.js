import React, { useState } from "react";
import { FaSort } from "react-icons/fa";
import styled from "styled-components";


const FilterBarWrapper = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px 10px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  margin-bottom:2rem;
`;
const FilterIconWrapper = styled.div`
  display: ${({ isOpen }) => (isOpen ? "none" : "flex")};
    font-size: 30px;
    justify-content: end;
      position: absolute;
    right: 5%;
`;

const FilterBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 220px;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
`;

const FilterInput = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #ff6347;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  }
`;

const PriceContainer = styled.div`
display: flex;
`

const FilterPriceInput = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  width:50%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #ff6347;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 5px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    border-color: #ff6347;
    box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
  }
`;

const ButtonContailer = styled.div`
margin:auto;
display:flex;
justify-content:center;
`

const FilterButton = styled.button`
  padding: 8px;
  background-color: #ff6347;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width:150px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #e55347;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;
const ResetButton = styled.button`
  padding: 7px;
  background-color: #fff;
  font-size: 16px;
  color:#ff6347;
  border: 1px solid #ff6347;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  max-width:100px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    color: #e55347;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(1px);
  }
`;


const FilterGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  width:95%;
`;

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    duration: undefined,
    includesFlight: undefined,
    includesHotel: undefined,
    includesMeal: undefined,
    includesSightseeing: undefined,
  });
  const [isOpen, setIsOpen] = useState(false);
  const handleReset = () => {
    let rFilters = {
      name: "",
      minPrice: "",
      maxPrice: "",
      duration: "",
      includesFlight: "",
      includesHotel: "",
      includesMeal: "",
      includesSightseeing: "",
    }
    setFilters(rFilters);
    onFilterChange(rFilters);
    setIsOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value, // Use undefined if empty
    }));
  };

  const handleSearch = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  return (
    <>
      <FilterIconWrapper isOpen={isOpen} onClick={() => setIsOpen(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 5h18M3 11h18M3 17h18" />
        </svg>

      </FilterIconWrapper>
      <FilterBarWrapper isOpen={isOpen}>
        <FilterGroup>
          {/* General Filters */}
          <FilterBox>
            <FilterLabel>Package Name</FilterLabel>
            <FilterInput
              type="text"
              name="name"
              value={filters.name || ""}
              onChange={handleInputChange}
              placeholder="Enter package name"
            />
          </FilterBox>
          {/* Price Range Filters */}
          <FilterBox>
            <FilterLabel>Price Range</FilterLabel>
            <PriceContainer>

              <FilterPriceInput
                type="number"
                name="minPrice"
                placeholder="Min Price"
                value={filters.minPrice || ""}
                onChange={handleInputChange}
              />
              <FilterPriceInput
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                value={filters.maxPrice || ""}
                onChange={handleInputChange}
              />
            </PriceContainer>
          </FilterBox>

          {/* Duration Filters */}
          <FilterBox>
            <FilterLabel>Duration</FilterLabel>
            <FilterInput
              type="text"
              name="duration"
              value={filters.duration || ""}
              onChange={handleInputChange}
              placeholder="Enter package duration"
            />
          </FilterBox>
          {/* Inclusions Filters */}
          <FilterBox style={{ maxWidth: '100px' }}>
            <FilterLabel>Flight</FilterLabel>
            <FilterSelect
              name="includesFlight"
              value={filters.includesFlight || ""}
              onChange={handleInputChange}
            >
              <option value={""}>Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FilterSelect>
          </FilterBox>

          <FilterBox style={{ maxWidth: '100px' }}>
            <FilterLabel>Hotel</FilterLabel>
            <FilterSelect
              name="includesHotel"
              value={filters.includesHotel || ""}
              onChange={handleInputChange}
            >
              <option value={""}>Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FilterSelect>
          </FilterBox>

          <FilterBox style={{ maxWidth: '100px' }}>
            <FilterLabel>Meal</FilterLabel>
            <FilterSelect
              name="includesMeal"
              value={filters.includesMeal || ""}
              onChange={handleInputChange}
            >
              <option value={""}>Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FilterSelect>
          </FilterBox>

          <FilterBox style={{ maxWidth: '100px' }}>
            <FilterLabel>Sightseeing</FilterLabel>
            <FilterSelect
              name="includesSightseeing"
              value={filters.includesSightseeing || ""}
              onChange={handleInputChange}
            >
              <option value={""}>Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </FilterSelect>
          </FilterBox>
        </FilterGroup>
        <ButtonContailer>
        <FilterButton onClick={handleSearch}>Show Results</FilterButton>&nbsp;
        <ResetButton onClick={handleReset}>Reset</ResetButton>
        </ButtonContailer>
      </FilterBarWrapper>
    </>
  );
};

export default FilterBar;
