import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface IUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

interface DecodedToken extends JwtPayload {
  user?: {
    id: string;
    email: string;
  };
}

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decodedValue = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    if (!decodedValue?.user?.id) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    req.user = {
      id: decodedValue.user.id,
      email: decodedValue.user.email
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Please login" });
  }
};