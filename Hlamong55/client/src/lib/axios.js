import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mern-live-chat-api.up.railway.app/api",
});

export default axiosInstance;