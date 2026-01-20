import api from "./api";

export const createBid = (data) => api.post("/bids", data);

export const getBidsForGig = (gigId) =>
  api.get(`/bids/gig/${gigId}`);

export const getMyBids = () => api.get("/bids/my");

export const hireBid = (bidId) =>
  api.put(`/bids/hire/${bidId}`);
