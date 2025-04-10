import { createAsyncThunk } from "@reduxjs/toolkit";
import instance, { setToken } from "../instance";
import { toast } from "react-toastify";

export const getCustomerReviews = createAsyncThunk(
  "reviews",
  async (body, { rejectWithValue }) => {
    try {
      const { limit = 3 } = body;
      const response = await instance.get(`/customer-reviews?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getNearestStores = createAsyncThunk(
  "nearest-stores",
  async (body, { rejectWithValue }) => {
    try {
      const { limit = 6 } = body;
      const response = await instance.get(`/stores/nearest?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllStores = createAsyncThunk(
  "all-stores",
  async (body, { rejectWithValue }) => {
    try {
      const { limit = "" } = body;
      const response = await instance.get(`/stores?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSearchProducts = createAsyncThunk(
  "products",
  async (body, { rejectWithValue }) => {
    try {
      const { category = "", name = "", page = "", limit = "" } = body;
      const response = await instance.get(
        `/products?category=${category}&name=${name}&page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "products/:id",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCartItems = createAsyncThunk(
  "cart-items",
  async (_, { rejectWithValue, getState }) => {
    try {
      setToken(getState().auth.token);
      const response = await instance.get("/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart-update",
  async (body, { rejectWithValue, getState }) => {
    try {
      setToken(getState().auth.token);
      const response = await instance.put("/cart/update", body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cartCheckout = createAsyncThunk(
  "cart-checkout",
  async (body, { rejectWithValue, getState }) => {
    try {
      setToken(getState().auth.token);
      const response = await instance.post("/cart/checkout", body);
      toast.success("The order is successful. Wait for a call to confirm.");
      return response.data;
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFromCart = createAsyncThunk(
  "cart-remove",
  async (id, { rejectWithValue, getState }) => {
    try {
      setToken(getState().auth.token);
      const response = await instance.delete(`/cart/remove/${id}`);
      toast.success("Product removed from cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart-add",
  async (body, { rejectWithValue, getState }) => {
    try {
      setToken(getState().auth.token);
      const response = await instance.patch("/cart/add", body);
      toast.success("Product added to cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart-decrease",
  async (body, { rejectWithValue, getState }) => {
    try {
      setToken(getState().auth.token);
      const response = await instance.patch("/cart/decrease", body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
