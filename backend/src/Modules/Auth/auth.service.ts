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
import { v4 as uuidv4 } from "uuid";
import { inspect } from "node:util";

export class AuthServices {
  private logger = new AppLogger("AuthServices");

  constructor(private readonly prisma: PrismaClient) {}

  public async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    try {
      this.logger.info("Attempting to register user", { email });

      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        this.logger.warn("Registration failed: User already exists", { email });
        throw new ConflictError("A user with this email already exists");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: passwordHash,
        },
      });

      this.logger.info("User registered successfully", { userId: newUser.id });
      return newUser;
    } catch (error) {
      this.logger.error("Register flow failed", {
        name: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        raw: inspect(error, { depth: 8, breakLength: 120 }),
      });
      throw error;
    }
  }

  public generateAccessToken(userId: string) {
    const token = jwt.sign({ userId }, config.security.jwt.secret!, {
      expiresIn: config.security.jwt.expiresIn as jwt.SignOptions["expiresIn"],
      issuer: config.security.jwt.issuer,
    });
    return token;
  }

  public async createSession(userId: string) {
    const refreshToken = uuidv4();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
      },
    });

    return { refreshToken, expiresAt };
  }

  public async login(email: string, password: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AuthenticationError("Invalid credentials");
      }

      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new AuthenticationError("Invalid credentials");
      }

      const accessToken = this.generateAccessToken(user.id);
      const { refreshToken, expiresAt } = await this.createSession(user.id);

      // Exclude password
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userSafe } = user as any;

      return { accessToken, refreshToken, expiresAt, user: userSafe };
    } catch (error) {
      this.logger.error("Login flow failed", {
        name: error instanceof Error ? error.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        raw: inspect(error, { depth: 8, breakLength: 120 }),
      });
      throw error;
    }
  }

  public async rotateRefreshToken(oldRefreshToken: string) {
    const now = new Date();
    const sessions = await this.prisma.session.findMany({
      where: { expiresAt: { gt: now } },
    });

    for (const session of sessions) {
      const ok = await bcrypt.compare(
        oldRefreshToken,
        session.refreshTokenHash,
      );
      if (ok) {
        const newRefreshToken = uuidv4();
        const newHash = await bcrypt.hash(newRefreshToken, 10);
        const newExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.prisma.session.update({
          where: { id: session.id },
          data: { refreshTokenHash: newHash, expiresAt: newExpires },
        });
        const accessToken = this.generateAccessToken(session.userId);
        return {
          accessToken,
          refreshToken: newRefreshToken,
          expiresAt: newExpires,
        };
      }
    }

    throw new AuthenticationError("Invalid refresh token");
  }

  public async logout(refreshToken?: string) {
    if (!refreshToken) return;
    const sessions = await this.prisma.session.findMany();
    for (const session of sessions) {
      if (await bcrypt.compare(refreshToken, session.refreshTokenHash)) {
        await this.prisma.session.delete({ where: { id: session.id } });
        return;
      }
    }
  }

  public async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("User");
    // strip password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userSafe } = user as any;
    return userSafe;
  }

  public async updateUser(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      currency?: string;
      monthlyIncome?: number;
    },
  ) {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existing) throw new NotFoundError("User");

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        currency: data.currency,
        monthlyIncome:
          typeof data.monthlyIncome === "number"
            ? data.monthlyIncome
            : undefined,
      },
    });

    // strip password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userSafe } = updated as any;
    return userSafe;
  }
}
