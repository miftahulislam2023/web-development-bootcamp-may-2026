// src/Modules/Auth/AuthServices.ts
import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import {
  ConflictError,
  NotFoundError,
  AuthenticationError,
} from "@/core/errors/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "@/core/config";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthServices {
  private logger = new AppLogger("AuthServices");

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Register a new user
   */

  // public async register(
  //   email: string,
  //   firstName: string,
  //   lastName: string,
  //   password: string,
  // ) {
  //   try {
  //     console.log("STEP 1");

  //     const existingUser = await this.prisma.user.findUnique({
  //       where: { email },
  //     });

  //     console.log("STEP 2", existingUser);

  //     if (existingUser) {
  //       throw new ConflictError("A user with this email already exists");
  //     }

  //     console.log("STEP 3");

  //     const passwordHash = await bcrypt.hash(password, 10);

  //     console.log("STEP 4");

  //     const newUser = await this.prisma.user.create({
  //       data: {
  //         email,
  //         firstName,
  //         lastName,
  //         password: passwordHash,
  //         status: "active",
  //       },
  //     });

  //     console.log("STEP 5", newUser);

  //     return newUser;
  //   } catch (err) {
  //     console.error("REGISTER ERROR:", err);
  //     throw err;
  //   }
  // }

  public async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    try {
      console.log("STEP 1");

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      console.log("STEP 2", existingUser);

      if (existingUser) {
        throw new ConflictError("A user with this email already exists");
      }

      console.log("STEP 3");

      const passwordHash = await bcrypt.hash(password, 10);

      console.log("STEP 4");

      const newUser = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: passwordHash,
          status: "active",
        },
      });

      console.log("STEP 5", newUser);

      return newUser;
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      throw err;
    }
  }

  /**
   * Login user and return tokens
   */
  public async login(email: string, password: string): Promise<AuthTokens> {
    this.logger.info("Attempting to login user", { email });

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      this.logger.warn("Login failed: User not found", { email });
      throw new AuthenticationError("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn("Login failed: Invalid password", { email });
      throw new AuthenticationError("Invalid email or password");
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id);
    // Store refresh token in DB
    this.logger.info("Creating session record", { userId: user.id });
    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash: await bcrypt.hash(tokens.refreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    this.logger.info("User logged in successfully", { userId: user.id });

    return tokens;
  }

  /**
   * Refresh access token
   */
  public async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    this.logger.info("Attempting to refresh token");

    if (!refreshToken) {
      throw new AuthenticationError("Refresh token is required");
    }

    try {
      const decoded = jwt.verify(refreshToken, config.security.jwt.secret) as {
        sub: string;
      };
      const userId = decoded.sub;

      // Check if session still exists
      const session = await this.prisma.session.findFirst({
        where: { userId },
      });

      if (!session) {
        throw new AuthenticationError("Session not found");
      }

      // Verify refresh token hash
      const isTokenValid = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash,
      );

      if (!isTokenValid) {
        throw new AuthenticationError("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { sub: userId },
        config.auth.accessTokenSecret,
        { expiresIn: "15m" },
      );

      this.logger.info("Token refreshed successfully", { userId });

      return { accessToken: newAccessToken };
    } catch (error) {
      this.logger.warn("Token refresh failed", { error });
      throw new AuthenticationError("Failed to refresh token");
    }
  }

  /**
   * Logout user and revoke session
   */
  public async logout(userId: string): Promise<void> {
    this.logger.info("Attempting to logout user", { userId });

    await this.prisma.session.deleteMany({
      where: { userId },
    });

    this.logger.info("User logged out successfully", { userId });
  }

  /**
   * Get user profile
   */
  public async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    return user;
  }

  /**
   * Update user profile
   */
  public async updateProfile(userId: string, data: Record<string, any>) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        role: true,
      },
    });

    return user;
  }

  /**
   * Generate access and refresh tokens
   */
  private generateTokens(userId: string): AuthTokens {
    const accessToken = jwt.sign({ sub: userId }, config.security.jwt.secret, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign({ sub: userId }, config.security.jwt.secret, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  }
}
