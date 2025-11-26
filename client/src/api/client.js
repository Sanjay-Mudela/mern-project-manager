import axios from "axios";

// 1) Create an axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 2) (Optional now, very useful later)
// We will add interceptors here if needed

export default api;
