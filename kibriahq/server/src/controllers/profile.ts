import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import { findUserById, updateUser, deleteUser } from "../services/user.js";
import error from "../utils/error.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req: Request, res: Response, next: Function) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user!.id;

        const user = await findUserById(userId);
        if (!user) {
            throw error("User not found", 404);
        }

        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req: Request, res: Response, next: Function) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user!.id;
        const rawData = req.body;

        const data: Record<string, any> = {
            name: rawData.name,
            email: rawData.email,
            avatar: rawData.avatar,
            color: rawData.color,
        }

        if (rawData.newPassword) {
            data.password = await bcrypt.hash(rawData.newPassword, 10);
        }

        const updatedUser = await updateUser(userId, data);
        if (!updatedUser) {
            throw error("User not found", 404);
        }

        const { password, ...userWithoutPassword } = updatedUser;
        return res.status(200).json(userWithoutPassword);
    } catch (err) {
        console.error(err)
        next(err);
    }
};

export const deleteProfile = async (req: Request, res: Response, next: Function) => {
    try {
        const authReq = req as AuthRequest;
        const userId = authReq.user!.id;

        await deleteUser(userId);

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
};