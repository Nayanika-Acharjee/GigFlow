import api from "./api";

export const getGigs = () => api.get("/gigs");

export const createGig = (data) => api.post("/gigs", data);
