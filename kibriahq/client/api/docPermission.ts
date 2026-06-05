import { getToken } from "@/utils/token";
import axios from "axios";

export const userSearch = async (search: string, docId: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/permissions/user-search`, {
        search,
        docId,
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const addPermission = async (docId: string, userId: string) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/permissions/add`, {
        docId,
        userId,
    }, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const removePermission = async (id: string) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/permissions/remove`, {
        data: {
            id,
        },
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}

export const getAllPermissions = async (docId: string) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/docs/permissions/get-all/${docId}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    return res.data;
}