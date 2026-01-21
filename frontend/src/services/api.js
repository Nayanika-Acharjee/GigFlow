import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ================= GIG APIS ================= */
export const createGig = (data) =>
  api.post("/api/gigs", data);

export const getMyGigs = () =>
  api.get("/api/gigs/my");

export const getOpenGigs = () =>
  api.get("/api/gigs");

/* ================= EXPORT DEFAULT ================= */
export default api;
