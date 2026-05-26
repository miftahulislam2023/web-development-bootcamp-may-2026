import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import ApiError from "../../utils/apiErrors";

export const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const userRole = String(req.user.role).toUpperCase().trim();

    // ✅ GLOBAL
    if (userRole === "SUPER_ADMIN") {
      return next();
    }

    const allowedRoles = roles.map((r) =>
      String(r).toUpperCase().trim()
    );

    if (!allowedRoles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          "Forbidden: you don't have access to this resource"
        )
      );
    }

    next();
  };
  