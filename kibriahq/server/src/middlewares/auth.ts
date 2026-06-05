import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../services/user.js";
import error from "../utils/error.js";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        name: string;
        email: string;
        role: number;
    };
}

export const auth = async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw error("Unauthorized access", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = (jwt.verify as any)(token, JWT_SECRET) as {
            id: number;
            name: string;
            email: string;
            role: number;
        };

        const user = await findUserById(decoded.id);
        if (!user) {
            throw error("Unauthorized access", 401);
        }

        req.user = decoded;
        next();
    } catch(err) {
        next(err);
    }
};