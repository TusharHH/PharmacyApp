import React, { useState, useEffect } from "react";
import {
  Form,
  InputBox,
  OrderBox,
  PaymentBox,
  RadioBox,
  SubTitle,
  SubmitBtn,
  Text,
  TotalBox,
} from "./CartForm.styled";
import { useDispatch, useSelector } from "react-redux";
import { selectCart } from "../../../redux/pharmacy/selectors";
import { useFormik } from "formik";
import { orderSchema } from "schemas/yupSchemas";
import { cartCheckout } from "../../../redux/pharmacy/operations";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createOrder } from "services/order.api";

const CartForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const total = Number(cart?.total).toFixed(2) || 0;
  const [isCashPayment, setIsCashPayment] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Order creation function
  // const createOrder = async (cartId, shippingAddress, paymentMethod) => {
  //   const response = await axios.post(`${API_URL}/orders`, 
  //     { cartId, shippingAddress, paymentMethod },
  //     { 
  //       headers: { 
  //         Authorization: `Bearer ${localStorage.getItem('accessToken')}` 
  //       } 
  //     }
  //   );
  //   return response.data;
  // };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      payment: isCashPayment ? "cash" : "bank",
    },
    validationSchema: orderSchema,
    onSubmit: async (values) => {
      if (!cart || !cart.cartProducts || cart.cartProducts.length === 0) {
        toast.error("Please select product to make an order");
        return;
      }

      setIsSubmitting(true);
      
      try {
        // 1. First complete the cart checkout
        await dispatch(cartCheckout(values)).unwrap();
        
        // 2. Then create the order
        const order = await createOrder(
          cart.cartId, // Make sure your cart has an _id
          values.address,
          values.payment
        );
        
        // 3. Clear the cart after successful order creation
        // await dispatch(clearCart());
        
        // 4. Navigate to order confirmation page
        navigate(`/orders/${order._id}`);
        
        toast.success("Order placed successfully!");
      } catch (error) {
        console.error("Order failed:", error);
        toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Sync payment method with formik values
  useEffect(() => {
    formik.setFieldValue("payment", isCashPayment ? "cash" : "bank");
  }, [isCashPayment]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <SubTitle>Enter shipping info </SubTitle>
      <Text>
        Enter your delivery address where you get the product. You can also
        send any other location where you send the products.
      </Text>
      <InputBox>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.errors.name && formik.touched.name && (
            <span>{formik.errors.name}</span>
          )}
        </label>
        <label htmlFor="email">
          Email
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.errors.email && formik.touched.email && (
            <span>{formik.errors.email}</span>
          )}
        </label>
        <label htmlFor="phone">
          Phone
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
          />
          {formik.errors.phone && formik.touched.phone && (
            <span>{formik.errors.phone}</span>
          )}
        </label>
        <label htmlFor="address">
          Address
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
          />
          {formik.errors.address && formik.touched.address && (
            <span>{formik.errors.address}</span>
          )}
        </label>
      </InputBox>
      <PaymentBox>
        <SubTitle>Payment method</SubTitle>
        <Text>
          You can pay us in a multiple way in our payment gateway system.
        </Text>
        <RadioBox>
          <label htmlFor="cash">
            <input
              type="radio"
              id="cash"
              name="payment"
              checked={isCashPayment}
              onChange={() => setIsCashPayment(true)}
            />
            Cash On Delivery
          </label>
          <label htmlFor="bank">
            <input
              type="radio"
              id="bank"
              name="payment"
              checked={!isCashPayment}
              onChange={() => setIsCashPayment(false)}
            />
            Bank
          </label>
        </RadioBox>
      </PaymentBox>
      <OrderBox>
        <SubTitle>Order details </SubTitle>
        <Text>
          Shipping and additional costs are calculated based on values you
          have entered.
        </Text>
        <TotalBox>
          <p>Total:</p>
          <p>{`৳ ${total}`}</p>
        </TotalBox>
      </OrderBox>
      <SubmitBtn type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Place order"}
      </SubmitBtn>
    </Form>
  );
};

export default CartForm;