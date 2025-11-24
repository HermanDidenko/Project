import axios from "axios";

// Take base URL from .env or use localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? "http://localhost:5049";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // now all requests will go to /api/*
});

// Interceptor adds JWT token to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt"); // token is stored in localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;