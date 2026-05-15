import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://web-development-bootcamp-may-2026-2.onrender.com/api",
    

  withCredentials: true,
});

export default axiosInstance;