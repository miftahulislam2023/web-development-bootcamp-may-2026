// src/Modules/Budgets/BudgetModule.ts
import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { BudgetService } from "./budget.service";
import { BudgetController } from "./budget.controller";
import { validateRequest } from "@/middleware/validation";
import { createBudgetSchema, updateBudgetSchema } from "./BudgetDTO";

export class BudgetModule extends BaseModule {
  public name: string = "BudgetModule";
  public version: string = "1.0.0";
  public basePath: string = "/budgets/v1/";

  private logger = new AppLogger("BudgetModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("BudgetService", new BudgetService(prisma));
  }

  protected async setupControllers(): Promise<void> {
    const budgetService = this.getService<BudgetService>("BudgetService");
    this.registerController("BudgetController", new BudgetController(budgetService));
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<BudgetController>("BudgetController");

    // POST /budgets/v1/
    this.router.post(
      "/",
      validateRequest(createBudgetSchema),
      controller.create.bind(controller),
    );

    // GET /budgets/v1/
    this.router.get("/", controller.list.bind(controller));

    // GET /budgets/v1/:id
    this.router.get("/:id", controller.getOne.bind(controller));

    // PATCH /budgets/v1/:id
    this.router.patch(
      "/:id",
      validateRequest(updateBudgetSchema),
      controller.update.bind(controller),
    );

    // DELETE /budgets/v1/:id
    this.router.delete("/:id", controller.delete.bind(controller));
  }
}

