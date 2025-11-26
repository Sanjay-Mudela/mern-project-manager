import axios from "axios";
import toast from "react-hot-toast";

// You can later override this with an env variable in deployment
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Response interceptor: runs on every response error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const currentPath = window.location.pathname;

      // Avoid loop on login/register page
      if (currentPath !== "/login" && currentPath !== "/register") {
        toast.error("Session expired. Please log in again.");
        // Remove token from localStorage
        localStorage.removeItem("token");
        // Redirect to login page
        window.location.href = "/login";
      }
    }

    // Always reject so calling code can still handle error
    return Promise.reject(error);
  }
);

export default api;

