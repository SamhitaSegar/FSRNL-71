// Centralized axios instance for the backend API.
//
// Set the backend URL via a Vite env var in `.env`:
//   VITE_API_URL=http://localhost:3000/api
// Falls back to "/api" (handy when proxying the backend through Vite, or
// when the frontend is served by the backend itself in production).
//
// A request interceptor attaches the JWT (stored in localStorage on login)
// as a Bearer token, which is what the backend's verifyToken middleware
// expects. A response interceptor clears the token on 401 responses.

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send/receive httpOnly cookies if the backend uses them
});

// Attach the stored token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear a stale token if the server rejects it
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;
