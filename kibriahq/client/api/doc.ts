import axios from "axios";
import { getToken } from "../utils/token";

export const createDoc = async (name?: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs`, {
        name,
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const getMyDocs = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/my`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const getSharedDocs = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/shared`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const updateDocName = async (id: string, name: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/update/name/${id}`, {
        name,
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const getDoc = async (id: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const deleteDoc = async (id: string) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/${id}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}