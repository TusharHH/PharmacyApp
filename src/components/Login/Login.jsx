import React from "react";
import Logo from "components/Header/Logo/Logo";
import usualMob from "../../images/pill-mob@1x.png";
import retinaMob from "../../images/pill-mob@2x.png";
import usualTab from "../../images/pill-tab@1x.png";
import retinaTab from "../../images/pill-tab@2x.png";
import { useMediaQuery } from "react-responsive";
import {
  BtnBox,
  Container,
  ImgWrapper,
  LogoWrapper,
  SubmitBtn,
  Title,
  TitleBox,
} from "components/Register/Register.styled";
import { NavLink, useNavigate } from "react-router-dom";
import { InputBox, MainWrapper } from "./Login.styled";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { loginThunk } from "../../redux/auth/operations";
import { loginSchema } from "../../schemas/yupSchemas";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTabletOrDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginThunk(values))
        .unwrap()
        .then(() => {
          navigate("/home");
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
              <label htmlFor="email">
                <input
                  type="text"
                  id="email"
                  placeholder="Email address"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email.trim()}
                />
                {formik.errors.email && formik.touched.email ? (
                  <span>{formik.errors.email}</span>
                ) : null}
              </label>
              <label htmlFor="password">
                <input
                  type="password"
                  id="password"
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
              <SubmitBtn type="submit">Login</SubmitBtn>
              <NavLink to="/register">Don't have an account?</NavLink>
            </BtnBox>
          </form>
        </MainWrapper>
      </Container>
    </>
  );
};

export default Login;
