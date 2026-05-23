import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { validateRequest } from "@/middleware/validation";
import { SavingsGoalService } from "./savingsGoal.service";
import { SavingsGoalController } from "./savingsGoal.controller";
import { createSavingsGoalSchema } from "./SavingsGoalDTO";

export class SavingsGoalModule extends BaseModule {
  public name: string = "SavingsGoalModule";
  public version: string = "1.0.0";
  public basePath: string = "/savings-goals/v1/";
  public dependencies?: string[] | undefined;

  private logger = new AppLogger("SavingsGoalModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("SavingsGoalService", new SavingsGoalService(prisma));
  }

  protected async setupControllers(): Promise<void> {
    const savingsGoalService =
      this.getService<SavingsGoalService>("SavingsGoalService");
    this.registerController(
      "SavingsGoalController",
      new SavingsGoalController(savingsGoalService),
    );
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<SavingsGoalController>(
      "SavingsGoalController",
    );

    this.router.get("/", controller.list.bind(controller));
    this.router.post(
      "/",
      validateRequest(createSavingsGoalSchema),
      controller.create.bind(controller),
    );
    this.router.get("/:id", controller.getById.bind(controller));
    this.router.patch(
      "/:id",
      validateRequest(createSavingsGoalSchema),
      controller.update.bind(controller),
    );
    this.router.delete("/:id", controller.delete.bind(controller));
  }
}
