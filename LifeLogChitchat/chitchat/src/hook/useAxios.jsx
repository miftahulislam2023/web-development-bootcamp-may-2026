import React from 'react';
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
});

const useAxios = () => {
  return axiosInstance
};

export default useAxios;