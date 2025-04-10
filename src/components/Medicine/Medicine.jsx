import React, { useState } from "react";
import {
  AddToCartBtn,
  BtnBox,
  Container,
  DetailsBtn,
  ImgBox,
  Info,
  Item,
  List,
  NameWithPriceBox,
  Price,
  SubTitle,
  Text,
  Title,
} from "./Medicine.styled";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSearchProducts,
  selectTotalPages,
} from "../../redux/pharmacy/selectors";
import {
  addToCart,
  getCartItems,
  getProductById,
} from "../../redux/pharmacy/operations";
import { useNavigate } from "react-router-dom";
import Modal from "components/Modal/Modal";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import SignIn from "components/Modal/SignIn/SignIn";
import SignUp from "components/Modal/SignUp/SignUp";
import Filter from "./Filter/Filter";
import Pagination from "./Pagination/Pagination";

const Medicine = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectSearchProducts);
  const totalPages = useSelector(selectTotalPages);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };

  const handleCloseSignIn = () => {
    setOpenSignIn(false);
  };

  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignUp(false);
  };

  const handleAddToCart = (id) => {
    if (!isLoggedIn) {
      handleOpenSignIn();
    } else {
      dispatch(
        addToCart({
          productId: id,
          quantity: 1,
        })
      );
      dispatch(getCartItems());
    }
  };

  const handleDetailsClick = (id) => {
    dispatch(getProductById(id)).then(() => {
      navigate("/product");
    });
  };

  return (
    <>
      <section>
        <Container>
          <Title>Medicine</Title>
          <Filter totalPages={totalPages} />
          <List>
            {products &&
              products.length > 0 &&
              products?.map((product) => (
                <Item key={product._id}>
                  <ImgBox>
                    <img src={product.photo} alt="product" />
                  </ImgBox>
                  <Info>
                    <NameWithPriceBox>
                      <SubTitle>{product.name}</SubTitle>
                      <Price>{`৳${product.price}`}</Price>
                    </NameWithPriceBox>
                    <Text>{product.category}</Text>
                    <BtnBox>
                      <AddToCartBtn
                        type="button"
                        onClick={() => handleAddToCart(product._id)}
                      >
                        Add to cart
                      </AddToCartBtn>
                      <DetailsBtn
                        type="button"
                        onClick={() => handleDetailsClick(product._id)}
                      >
                        Details
                      </DetailsBtn>
                    </BtnBox>
                  </Info>
                </Item>
              ))}
          </List>
          {totalPages > 1 && <Pagination totalPages={totalPages} />}
        </Container>
      </section>
      <Modal isOpen={openSignIn} onClose={handleCloseSignIn}>
        <SignIn onClose={handleCloseSignIn} onToggleModal={handleOpenSignUp} />
      </Modal>
      <Modal isOpen={openSignUp} onClose={handleCloseSignUp}>
        <SignUp onClose={handleCloseSignUp} onToggleModal={handleOpenSignIn} />
      </Modal>
    </>
  );
};

export default Medicine;
