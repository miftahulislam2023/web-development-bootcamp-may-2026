import axios from "axios";

const axiosFetch = axios.create({
    baseURL: import.meta.env.VITE_SERVER
});

axiosFetch.interceptors.request.use((config) => {
    const token = localStorage.getItem("access-token");

    if(token)
        config.headers.authorization = `Bearer ${token}`;

    return config;
});

export default axiosFetch;