// src/api/orders.js
import axios from 'axios';

const API_URL = "http://localhost:3030/api"

export const createOrder = async (cartId, shippingAddress, paymentMethod) => {
  const response = await axios.post(`${API_URL}/orders`, 
    { cartId, shippingAddress, paymentMethod },
    { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
  );
  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return response.data;
};

export const getUserOrders = async () => {
  const response = await axios.get(`${API_URL}/orders/user`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.patch(`${API_URL}/orders/${orderId}/status`, 
    { status },
    { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
  );
  return response.data;
};