// auth.middleware.ts — JWT verification for data routes
// Verifies tokens issued by auth-service using shared JWT_SECRET

import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || process.env.VITE_JWT_SECRET || "lifeos-jwt-secret-change-me-in-prod";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(authHeader.slice(7), JWT_SECRET) as any;
        if (!decoded || !decoded.sub) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        // Attach userId to request
        (req as any).userId = decoded.sub;
        next();
    } catch {
        res.status(401).json({ error: "Token verification failed" });
    }
}
