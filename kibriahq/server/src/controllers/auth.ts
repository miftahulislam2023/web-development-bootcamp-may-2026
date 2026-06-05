import type { Request, Response } from "express";
import { loginUser, registerUser, type LoginInput, type RegisterInput } from "../services/auth.js";
import error from "../utils/error.js";


export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body as unknown as RegisterInput;
        const user = await registerUser(name, email, password)

        return res.status(201).json({ ...user });
    } catch (err: any) {
        throw error(err.message, 500);
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as unknown as LoginInput;
        const data = await loginUser(email, password);

        return res.status(200).json(data);
    } catch (err: any) {
        throw error(err.message, 500);
    }
};