// src/Modules/Auth/AuthController.ts
import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CreateUserDTO, LoginDTO, UpdateProfileDTO } from "./AuthDTO";
import { AuthServices } from "./auth.service";

export class AuthController extends BaseController {
  private logger = new AppLogger("AuthController");

  constructor(private readonly authService: AuthServices) {
    super();
  }

  /**
   * Endpoint: POST /auth/v1/register
   */
  //   public async register(req: Request, res: Response) {
  //     this.logger.info("Received request to register user");

  //     const { email, firstName, lastName, password } =
  //       req.validatedBody as CreateUserDTO;

  //       console.log(email,firstName, lastName,password);

  //     const newUser = await this.authService.register(
  //       email,
  //       firstName,
  //       lastName,
  //       password,
  //     );
  // console.log(newUser);
  //     const { password: _, ...userWithoutPassword } = newUser;

  //     return this.sendCreatedResponse(
  //       req,
  //       res,
  //       userWithoutPassword,
  //       "User registered successfully",
  //     );
  //   }
  public register = async (req: Request, res: Response) => {
    this.logger.info("Received request to register user");

    const { email, firstName, lastName, password } =
      req.validatedBody as CreateUserDTO;

    console.log(email, firstName, lastName, password);

    const newUser = await this.authService.register(
      email,
      firstName,
      lastName,
      password,
    );

    console.log(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return this.sendCreatedResponse(
      req,
      res,
      userWithoutPassword,
      "User registered successfully",
    );
  };

  /**
   * Endpoint: POST /auth/v1/login
   */
  public async login(req: Request, res: Response) {
    this.logger.info("Received request to login user");

    const { email, password } = req.validatedBody as LoginDTO;

    const tokens = await this.authService.login(email, password);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return this.sendResponse(req, res, "Login successful", 200, {
      accessToken: tokens.accessToken,
    });
  }

  /**
   * Endpoint: POST /auth/v1/refresh
   */
  public async refresh(req: Request, res: Response) {
    this.logger.info("Received request to refresh token");

    const refreshToken = req.cookies.refreshToken;

    const result = await this.authService.refreshToken(refreshToken);

    return this.sendResponse(req, res, "Token refreshed", 200, result);
  }

  /**
   * Endpoint: POST /auth/v1/logout
   */
  public async logout(req: Request, res: Response) {
    this.logger.info("Received request to logout user");

    const userId = (req as any).userId; // From auth middleware

    await this.authService.logout(userId);

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    return this.sendResponse(req, res, "Logged out successfully", 200);
  }

  /**
   * Endpoint: GET /auth/v1/me
   */
  public async getMe(req: Request, res: Response) {
    this.logger.info("Received request to get current user");

    const userId = (req as any).userId;

    const user = await this.authService.getProfile(userId);

    return this.sendResponse(req, res, "User profile", 200, user);
  }

  /**
   * Endpoint: PATCH /auth/v1/me
   */
  public async updateMe(req: Request, res: Response) {
    this.logger.info("Received request to update user profile");

    const userId = (req as any).userId;
    const data = req.validatedBody as UpdateProfileDTO;

    const updatedUser = await this.authService.updateProfile(userId, data);

    return this.sendResponse(req, res, "Profile updated", 200, updatedUser);
  }
}
