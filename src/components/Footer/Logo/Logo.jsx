import React from "react";
import logo from "../../../images/logo.png";
import { NavLinkStyled } from "./Logo.styled";

const Logo = () => {
  return (
    <>
      <NavLinkStyled to="/home">
        <img src={logo} alt="logo" />
        <p>E-Pharmacy</p>
      </NavLinkStyled>
    </>
  );
};

export default Logo;
