import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../../../redux/pharmacy/selectors";
import {
  AmountBox,
  BtnBox,
  ImgBox,
  Item,
  List,
  MainTextWrap,
  Price,
  RemoveBtn,
  Subtitle,
  Text,
  TextBox,
} from "./PreviewCartItems.styled";
import sprite from "../../../images/sprite.svg";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  getCartItems,
  getProductById,
} from "../../../redux/pharmacy/operations";
import { useNavigate } from "react-router-dom";

const PreviewCartItems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const cartItemsQuantity = cart?.cartProducts?.length || "";

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch, cartItemsQuantity]);

  const handleIncreaseAmount = (id) => {
    dispatch(
      addToCart({
        productId: id,
        quantity: 1,
      })
    );
  };

  const handleDecreaseAmount = (id) => {
    dispatch(
      decreaseQuantity({
        productId: id,
        quantity: 1,
      })
    );
  };

  const handleDeleteProduct = (id) => {
    dispatch(deleteFromCart(id));
  };

  const handleProductClick = (id) => {
    dispatch(getProductById(id)).then(() => {
      navigate("/product");
    });
  };

  return (
    <>
      <div>
        <List>
          {cart?.cartProducts?.map((product) => (
            <Item
              key={product.productId._id}
              onClick={() => handleProductClick(product.productId._id)}
            >
              <ImgBox>
                <img src={product.productId.photo} alt="product" />
              </ImgBox>
              <TextBox>
                <MainTextWrap>
                  <div>
                    <Subtitle>{product.productId.name}</Subtitle>
                    <Text>{product.productId.category}</Text>
                  </div>
                  <Price>{`৳ ${product.productId.price}`}</Price>
                </MainTextWrap>
                <BtnBox>
                  <AmountBox>
                    <button
                      type="button"
                      onClick={() =>
                        handleIncreaseAmount(product.productId._id)
                      }
                    >
                      <svg>
                        <use href={`${sprite}#plus`} />
                      </svg>
                    </button>
                    <p>{product.quantity}</p>
                    <button
                      type="button"
                      onClick={() =>
                        handleDecreaseAmount(product.productId._id)
                      }
                    >
                      <svg>
                        <use href={`${sprite}#minus`} />
                      </svg>
                    </button>
                  </AmountBox>
                  <RemoveBtn
                    type="button"
                    onClick={() => handleDeleteProduct(product.productId._id)}
                  >
                    Remove
                  </RemoveBtn>
                </BtnBox>
              </TextBox>
            </Item>
          ))}
        </List>
      </div>
    </>
  );
};

export default PreviewCartItems;
