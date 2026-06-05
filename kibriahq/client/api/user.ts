import axios from 'axios';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getProfile = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/me`, {
        headers: { ...getAuthHeader() },
    });
    return res.data;
}


export const updateProfile = async (formData: { name?: string, email?: string, password?: string }) => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/me`, formData, {
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return res.data;
}


export const deleteProfile = async () => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/profile/me`, {
        headers: { ...getAuthHeader() },
    });
    return res.data;
}