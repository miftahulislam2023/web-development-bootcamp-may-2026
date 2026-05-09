// src/Modules/Auth/AuthServices.ts
import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { ConflictError, NotFoundError } from "@/core/errors/AppError";

export class AuthServices {
  // 1. Initialize the contextual logger for this specific service
  private logger = new AppLogger("AuthServices");

  // 2. Use 'private readonly' so TypeScript automatically creates 'this.prisma'
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Example Use Case: Register a new user
   */
  public async register(
    email: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
  ) {
    this.logger.info("Attempting to register user", { email });

    // 3. Business Logic & Database Interaction
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn("Registration failed: User already exists", { email });
      // Throw your custom AppError. The global error handler will catch this!
      throw new ConflictError("A user with this email already exists");
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: passwordHash, // Make sure to hash passwords before this step!
      },
    });

    this.logger.info("User registered successfully", { userId: newUser.id });

    return newUser;
  }
}
