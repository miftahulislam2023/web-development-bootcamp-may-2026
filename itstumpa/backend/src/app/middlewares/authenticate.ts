// middlewares/authenticate.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { prisma } from "../../lib/prisma";
import ApiError from "../../utils/apiErrors";
import { setAuthCookies } from "../../utils/cookieHelpers";
import config from "../config";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../modules/auth/auth.utils";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (err: unknown, user: Express.User | false) => {
      if (err) return next(err);

      if (user) {
        req.user = user; 
        return next();
      }

      // ✅ Access token invalid/expired — try refresh token
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) return next(new ApiError(401, "Unauthorized"));

      try {
        const payload = jwt.verify(
          refreshToken,
          config.refreshSecret as string,
        ) as { sub: string };

        const foundUser = await prisma.user.findUnique({
          where: { id: payload.sub },
        });
        if (!foundUser) return next(new ApiError(401, "Unauthorized"));

        // ✅ Rotate both tokens
        const newAccessToken = generateAccessToken(
          foundUser.id,
          foundUser.role,
        );
        const newRefreshToken = generateRefreshToken(foundUser.id);

        setAuthCookies(res, newAccessToken, newRefreshToken); // ✅ set new cookies

        req.user = foundUser;
        return next(); // ✅ continue original request
      } catch {
        return next(
          new ApiError(401, "Session expired. Please sign in again."),
        );
      }
    },
  )(req, res, next);
};
