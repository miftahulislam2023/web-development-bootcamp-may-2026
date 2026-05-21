import { useEffect } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const axiosInstance = axios.create({
  baseURL: "https://my-spendora-server.vercel.app",
  headers: {
    "Content-Type": "application/json", 
  },
});

const useAxiosSecure = () => {
  const { user, signOutUser } = useAuth();

  console.log("user", user);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        console.log("Request Headers before:", config.headers);

        if (user) {
          let token = "";
          if (typeof user.getIdToken === "function") {
            token = await user.getIdToken();
          } else if (user.accessToken) {
            token = user.accessToken;
          }

          console.log("Token:", token);

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        console.log("Request Headers after:", config.headers);
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (status === 401) {
          console.log("Unauthorized! Logging out...");
          try {
            await signOutUser();
          } catch (signOutError) {
            console.error("Error during signOut:", signOutError);
          }
        } else if (status === 403) {
         
          console.warn("Forbidden access (403):", error.response?.data);
        } else {
          console.error("Axios error:", error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, signOutUser]);

  return axiosInstance;
};

export default useAxiosSecure;