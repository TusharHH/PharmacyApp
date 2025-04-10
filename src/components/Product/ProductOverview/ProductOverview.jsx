import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProduct } from "../../../redux/pharmacy/selectors";
import sprite from "../../../images/sprite.svg";
import {
  AddToCartBtn,
  AmountBox,
  BtnBox,
  ImgBox,
  InfoBox,
  Name,
  NamePriceBox,
  Price,
  Text,
  Wrapper,
} from "./ProductOverview.styled";
import { addToCart, getCartItems } from "../../../redux/pharmacy/operations";
import { toast } from "react-toastify";
import { selectIsLoggedIn } from "../../../redux/auth/selectors";
import Modal from "components/Modal/Modal";
import SignIn from "components/Modal/SignIn/SignIn";
import SignUp from "components/Modal/SignUp/SignUp";

const ProductOverview = () => {
  const dispatch = useDispatch();
  const product = useSelector(selectProduct);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [amount, setAmount] = useState(0);
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

  const handleIncreaseAmount = () => {
    setAmount((prev) => prev + 1);
  };

  const handleDecreaseAmount = () => {
    if (amount === 0) {
      return;
    }
    setAmount((prev) => prev - 1);
  };

  const handleAddToCart = (id) => {
    if (!isLoggedIn) {
      handleOpenSignIn();
    } else {
      if (amount === 0) {
        toast.info("Please select the quantity of the product");
        return;
      }
      dispatch(
        addToCart({
          productId: id,
          quantity: amount,
        })
      );
      dispatch(getCartItems());
    }
  };

  return (
    <>
      <Wrapper>
        <ImgBox>
          <img src={product.photo} alt="product" />
        </ImgBox>
        <InfoBox>
          <NamePriceBox>
            <>
              <Name>{product.name}</Name>
              <Text>{product.category}</Text>
            </>
            <Price>{`৳${product.price}`}</Price>
          </NamePriceBox>
          <BtnBox>
            <AmountBox>
              <button type="button" onClick={() => handleIncreaseAmount()}>
                <svg>
                  <use href={`${sprite}#plus`} />
                </svg>
              </button>
              <p>{amount}</p>
              <button type="button" onClick={() => handleDecreaseAmount()}>
                <svg>
                  <use href={`${sprite}#minus`} />
                </svg>
              </button>
            </AmountBox>
            <AddToCartBtn
              type="button"
              onClick={() => handleAddToCart(product._id)}
            >
              Add to cart
            </AddToCartBtn>
          </BtnBox>
        </InfoBox>
      </Wrapper>
      <Modal isOpen={openSignIn} onClose={handleCloseSignIn}>
        <SignIn onClose={handleCloseSignIn} onToggleModal={handleOpenSignUp} />
      </Modal>
      <Modal isOpen={openSignUp} onClose={handleCloseSignUp}>
        <SignUp onClose={handleCloseSignUp} onToggleModal={handleOpenSignIn} />
      </Modal>
    </>
  );
};

export default ProductOverview;
