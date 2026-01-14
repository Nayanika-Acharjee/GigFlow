import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true // JWT cookie
});
axios.post(
  "/api/auth/login",
   data,

  { withCredentials: true }
);
axios.get(
  "/api/auth/login",
   data,
  { withCredentials: true }
);

