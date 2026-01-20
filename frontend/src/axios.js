import axios from "axios";

const api = axios.create({
 baseURL: import.meta.env.local.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, //  for JWT cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// REGISTER
export const registerUser = (data) => {
  return api.post("/auth/register", data);
};

// LOGIN
export const loginUser = (data) => {
  return api.post("/auth/login", data);
};

// LOGOUT
export const logoutUser = () => {
  return api.post("/auth/logout");
};

// GET CURRENT USER
export const getCurrentUser = () => {
  return api.get("/auth/me");
};

export default api;


