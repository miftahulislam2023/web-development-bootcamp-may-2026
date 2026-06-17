import { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { ApiError } from "./errorHandler.js";
import { auth } from "$/lib/auth.js";

const checkAuth: RequestHandler = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      throw new ApiError(401, "Please login to continue.");
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default checkAuth;
