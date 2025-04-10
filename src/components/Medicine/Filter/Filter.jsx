import React, { useEffect, useState } from "react";
import sprite from "../../../images/sprite.svg";
import { CustomSelect, Form, Label, SubmitBtn } from "./Filter.styled";
import { useDispatch, useSelector } from "react-redux";
import { getSearchProducts } from "../../../redux/pharmacy/operations";
import { selectCurrentPage } from "../../../redux/pharmacy/selectors";
import { useMediaQuery } from "react-responsive";

const customStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderRadius: "60px",
    border: "1px solid rgba(29, 30, 33, 0.10)",
    height: "46px",
    background: "#fff",
    fontSize: "12px",
  }),
  valueContainer: (baseStyles, state) => ({
    ...baseStyles,
    paddingLeft: "18px",
  }),
  placeholder: (baseStyles, state) => ({
    ...baseStyles,
    color: "rgba(29, 30, 33, 0.40)",
  }),
  singleValue: (baseStyles, state) => ({
    ...baseStyles,
    textTransform: "capitalize",
    color: "rgba(29, 30, 33, 0.40)",
  }),
  indicatorSeparator: (baseStyles, state) => ({
    ...baseStyles,
    display: "none",
  }),
  indicatorsContainer: (baseStyles, state) => ({
    ...baseStyles,
    paddingRight: "8px",
  }),
};

const options = [
  { value: "", label: "All" },
  { value: "Dental Care", label: "Dental Care" },
  { value: "Hand", label: "Hand" },
  { value: "Head", label: "Head" },
  { value: "Heart", label: "Heart" },
  { value: "Leg", label: "Leg" },
  { value: "Medicine", label: "Medicine" },
  { value: "Skin Care", label: "Skin Care" },
];

const Filter = ({ totalPages }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchedName, setSearchedName] = useState("");

  const isDesktop = useMediaQuery({ query: "(min-width: 1440px)" });

  useEffect(() => {
    dispatch(
      getSearchProducts({
        category: selectedCategory.value,
        name: searchedName,
        page: currentPage,
        limit: isDesktop ? 12 : 9,
      })
    );
  }, [
    dispatch,
    selectedCategory,
    searchedName,
    currentPage,
    isDesktop,
    totalPages,
  ]);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    dispatch(
      getSearchProducts({
        category: selectedOption.value,
        name: searchedName,
        page: 1,
        limit: isDesktop ? 12 : 9,
      })
    );
  };

  const handleSearchInputChange = (e) => {
    setSearchedName(e.target.value);
    dispatch(
      getSearchProducts({
        category: selectedCategory.value,
        name: e.target.value,
        page: 1,
        limit: isDesktop ? 12 : 9,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      getSearchProducts({
        category: selectedCategory.value,
        name: searchedName,
        page: 1,
        limit: isDesktop ? 12 : 9,
      })
    );
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <CustomSelect
          options={options}
          placeholder="Product category"
          styles={customStyles}
          onChange={handleCategoryChange}
          value={selectedCategory}
        />
        <Label htmlFor="name">
          <input
            type="text"
            id="name"
            placeholder="Search medicine"
            onChange={handleSearchInputChange}
          />
          <svg>
            <use href={`${sprite}#search`} />
          </svg>
        </Label>
        <SubmitBtn type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M12.8307 1.75H1.16406L5.83073 7.26833V11.0833L8.16406 12.25V7.26833L12.8307 1.75Z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Filter
        </SubmitBtn>
      </Form>
    </>
  );
};

export default Filter;
