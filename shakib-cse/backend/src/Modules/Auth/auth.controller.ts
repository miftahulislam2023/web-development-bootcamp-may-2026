// src/Modules/Auth/AuthController.ts
import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CreateUserDTO, UpdateUserDTO } from "./AuthDTO";
import { AuthServices } from "./auth.service";
import { config } from "@/core/config";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "@/core/errors/AppError";

export class AuthController extends BaseController {
  // Initialize the contextual logger
  private logger = new AppLogger("AuthController");

  // Inject the service via the constructor
  constructor(private readonly authService: AuthServices) {
    super();
  }

  /**
   * Endpoint: POST /auth/v1/users
   */
  public async createUser(req: Request, res: Response) {
    try {
      this.logger.info("Received request to create a new user");

      const { email, firstName, lastName, password } =
        req.validatedBody as CreateUserDTO;

      const newUser = await this.authService.register(
        email,
        firstName,
        lastName,
        password,
      );

      const { password: _, ...userWithoutPassword } = newUser;

      return this.sendCreatedResponse(
        req,
        res,
        userWithoutPassword,
        "User registered successfully",
      );
    } catch (error) {
      this.logger.error("Register handler failed", { error });
      throw error;
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      const result = await this.authService.login(email, password);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.server.isProduction,
        sameSite: "lax",
        maxAge: result.expiresAt
          ? result.expiresAt.getTime() - Date.now()
          : 7 * 24 * 60 * 60 * 1000,
      });

      return this.sendResponse(req, res, "Logged in", undefined, {
        accessToken: result.accessToken,
      });
    } catch (error) {
      this.logger.error("Login handler failed", { error });
      throw error;
    }
  }

  public async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken as string | undefined;
      if (!refreshToken) throw new AuthenticationError("Missing refresh token");

      const rotated = await this.authService.rotateRefreshToken(refreshToken);

      res.cookie("refreshToken", rotated.refreshToken, {
        httpOnly: true,
        secure: config.server.isProduction,
        sameSite: "lax",
        maxAge: rotated.expiresAt
          ? rotated.expiresAt.getTime() - Date.now()
          : 7 * 24 * 60 * 60 * 1000,
      });

      return this.sendResponse(req, res, "Token refreshed", undefined, {
        accessToken: rotated.accessToken,
      });
    } catch (error) {
      this.logger.error("Refresh handler failed", { error });
      throw error;
    }
  }

  public async me(req: Request, res: Response) {
    try {
      const auth = req.headers.authorization;
      if (!auth) throw new AuthenticationError("Missing authorization header");
      const parts = auth.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer")
        throw new AuthenticationError("Invalid authorization header");

      const payload = jwt.verify(parts[1], config.security.jwt.secret!) as any;
      const user = await this.authService.getUserById(payload.userId);
      return this.sendResponse(req, res, "Profile fetched", undefined, user);
    } catch (error) {
      this.logger.error("Me handler failed", { error });
      throw new AuthenticationError("Invalid token");
    }
  }

  public async updateMe(req: Request, res: Response) {
    try {
      const auth = req.headers.authorization;
      if (!auth) throw new AuthenticationError("Missing authorization header");

      const parts = auth.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer")
        throw new AuthenticationError("Invalid authorization header");

      const payload = jwt.verify(parts[1], config.security.jwt.secret!) as any;
      const data = req.validatedBody as UpdateUserDTO;
      const user = await this.authService.updateUser(payload.userId, data);

      return this.sendResponse(req, res, "Profile updated", undefined, user);
    } catch (error) {
      this.logger.error("Update profile handler failed", { error });
      throw error;
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken as string | undefined;
      await this.authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return this.sendResponse(req, res, "Logged out", undefined, null);
    } catch (error) {
      this.logger.error("Logout handler failed", { error });
      throw error;
    }
  }
}
