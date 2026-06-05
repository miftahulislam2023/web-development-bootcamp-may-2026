import axios from 'axios';

export const login = async (formData: { email: string, password: string }) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
    });

    return res.data;
}


export const signup = async (formData: { name: string, email: string, password: string }) => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, formData, {
        headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
}