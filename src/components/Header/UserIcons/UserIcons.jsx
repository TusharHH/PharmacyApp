import React, { useEffect } from "react";
import sprite from "../../../images/sprite.svg";
import { CartBtn, CartItems, UserIcon, Wrapper } from "./UserIcons.styled";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../redux/auth/selectors";
import { useNavigate } from "react-router-dom";
import { selectCart } from "../../../redux/pharmacy/selectors";
import { getCartItems } from "../../../redux/pharmacy/operations";
import { getUserInfoThunk } from "../../../redux/auth/operations";

const UserIcons = ({ pageType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const cart = useSelector(selectCart);
  const cartItemsQuantity = cart?.cartProducts?.length || 0;

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch, cartItemsQuantity]);

  useEffect(() => {
    dispatch(getUserInfoThunk());
  }, [dispatch]);

  const handleCartClick = () => {
    navigate("/cart");
  };

  const iconBackground =
    pageType === "home" ? "#F1F1F1" : "rgba(89, 177, 122, 0.10)";

  return (
    <>
      <Wrapper>
        <CartBtn onClick={handleCartClick}>
          <svg>
            <use href={`${sprite}#shop`} />
          </svg>
          <CartItems>{cartItemsQuantity}</CartItems>
        </CartBtn>
        <UserIcon style={{ background: iconBackground }}>
          {user?.name[0]}
        </UserIcon>
      </Wrapper>
    </>
  );
};

export default UserIcons;
