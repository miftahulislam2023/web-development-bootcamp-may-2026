// src/Modules/Auth/AuthController.ts
import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CreateUserDTO } from "./AuthDTO";
import { AuthServices } from "./auth.service";

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
    this.logger.info("Received request to create a new user");

    // 1. Extract the validated body (populated by your validateRequest middleware)
    const { email, firstName, lastName, password } =
      req.validatedBody as CreateUserDTO;

    // 2. Pass the data to the Service Layer (Business Logic)
    const newUser = await this.authService.register(
      email,
      firstName,
      lastName,
      password,
    );

    // 3. Remove sensitive information before sending it back to the client
    // (Alternatively, you can use Prisma's `omit` feature if you configure it)
    const { password: _, ...userWithoutPassword } = newUser;

    // 4. Send the standardized response using BaseController's built-in method
    return this.sendCreatedResponse(
      req,
      res,
      userWithoutPassword,
      "User registered successfully",
    );
  }
}
