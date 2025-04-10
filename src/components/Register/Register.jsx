import React from "react";
import {
  BtnBox,
  Container,
  ImgWrapper,
  InputBox,
  LogoWrapper,
  MainWrapper,
  SubmitBtn,
  Title,
  TitleBox,
} from "./Register.styled";
import Logo from "components/Header/Logo/Logo";
import { NavLink, useNavigate } from "react-router-dom";
import usualMob from "../../images/pill-mob@1x.png";
import retinaMob from "../../images/pill-mob@2x.png";
import usualTab from "../../images/pill-tab@1x.png";
import retinaTab from "../../images/pill-tab@2x.png";
import { useMediaQuery } from "react-responsive";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { registerThunk } from "../../redux/auth/operations";
import { registerSchema } from "../../schemas/yupSchemas";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTabletOrDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      dispatch(registerThunk(values))
        .unwrap()
        .then(() => {
          navigate("/login");
        });
    },
  });

  return (
    <>
      <Container>
        <LogoWrapper>
          <Logo />
        </LogoWrapper>
        <MainWrapper>
          <TitleBox>
            <Title>
              Your medication, delivered Say goodbye to all{" "}
              <span>your healthcare</span> worries with us
            </Title>
            <ImgWrapper>
              {isMobile && (
                <img
                  srcSet={`${usualMob} 1x, ${retinaMob} 2x`}
                  alt="illustration"
                />
              )}
              {isTabletOrDesktop && (
                <img
                  srcSet={`${usualTab} 1x, ${retinaTab} 2x`}
                  alt="illustration"
                />
              )}
            </ImgWrapper>
          </TitleBox>
          <form onSubmit={formik.handleSubmit}>
            <InputBox>
              <label htmlFor="name">
                <input
                  type="text"
                  id="name"
                  placeholder="User Name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name.trim()}
                />
                {formik.errors.name && formik.touched.name ? (
                  <span>{formik.errors.name}</span>
                ) : null}
              </label>
              <label htmlFor="email">
                <input
                  type="text"
                  placeholder="Email address"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email.trim()}
                />
                {formik.errors.email && formik.touched.email ? (
                  <span>{formik.errors.email}</span>
                ) : null}
              </label>
              <label htmlFor="phone">
                <input
                  type="text"
                  placeholder="Phone number"
                  name="phone"
                  onChange={formik.handleChange}
                  value={formik.values.phone.trim()}
                />
                {formik.errors.phone && formik.touched.phone ? (
                  <span>{formik.errors.phone}</span>
                ) : null}
              </label>
              <label htmlFor="password">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password.trim()}
                />
                {formik.errors.password && formik.touched.password ? (
                  <span>{formik.errors.password}</span>
                ) : null}
              </label>
            </InputBox>
            <BtnBox>
              <SubmitBtn type="submit">Register</SubmitBtn>
              <NavLink to="/login">Already have an account?</NavLink>
            </BtnBox>
          </form>
        </MainWrapper>
      </Container>
    </>
  );
};

export default Register;
