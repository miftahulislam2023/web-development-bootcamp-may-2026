import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface IUser {
    _id: string;
    name: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        // Authorization Header Check
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Please login first - No token provided"
            });
            return;
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token missing"
            });
            return;
        }

        // JWT Secret Check
        if (!process.env.JWT_SECRET) {
            res.status(500).json({
                success: false,
                message: "JWT Secret not found"
            });
            return;
        }

        // Verify Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        ) as JwtPayload;

        // User Check
        if (!decoded || !decoded.user) {
            res.status(401).json({
                success: false,
                message: "Invalid token"
            });
            return;
        }

        // Attach User to Request
        req.user = decoded.user;

        next();

    } catch (error: any) {

        console.log("JWT ERROR:", error.message);

        res.status(401).json({
            success: false,
            message: error.message || "Authentication failed"
        });
    }
};