import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axios.defaults.withCredentials = true;

export const createGig = (data) =>
  axios.post("/api/gigs", data);

export const getMyGigs = () =>
  axios.get("/api/gigs/my");

export const getOpenGigs = () =>
  axios.get("/api/gigs");
