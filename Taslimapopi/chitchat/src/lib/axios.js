import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "https://chitchat-server-nine.vercel.app/api",
    

  withCredentials: true,
});

export default axiosInstance;