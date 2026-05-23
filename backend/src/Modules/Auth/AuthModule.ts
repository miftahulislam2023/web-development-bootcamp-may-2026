import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { AuthServices } from "./auth.service";
import { AuthController } from "./auth.controller";
import { validateRequest } from "@/middleware/validation";
import { createUserSchema, updateUserSchema } from "./AuthDTO";

export class AuthModule extends BaseModule {
  public name: string = "AuthModule";
  public version: string = "1.0.0";
  public basePath: string = "/auth/v1/";
  public dependencies?: string[] | undefined;

  private logger = new AppLogger("AuthModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("AuthService", new AuthServices(prisma));
  }
  protected async setupControllers(): Promise<void> {
    const authService = this.getService<AuthServices>("AuthService");
    this.registerController("AuthController", new AuthController(authService));
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<AuthController>("AuthController");
    // POST /auth/v1/register
    this.router.post(
      "/register",
      validateRequest(createUserSchema), // 1. Intercepts & validates request
      controller.createUser.bind(controller),
    );
    // POST /auth/v1/login
    this.router.post("/login", controller.login.bind(controller));

    // POST /auth/v1/refresh
    this.router.post("/refresh", controller.refresh.bind(controller));

    // GET /auth/v1/me
    this.router.get("/me", controller.me.bind(controller));

    // PATCH /auth/v1/me
    this.router.patch(
      "/me",
      validateRequest(updateUserSchema),
      controller.updateMe.bind(controller),
    );

    // POST /auth/v1/logout
    this.router.post("/logout", controller.logout.bind(controller));
  }
}
