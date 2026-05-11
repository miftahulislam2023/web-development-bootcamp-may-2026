// src/Modules/Transactions/TransactionModule.ts
import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "@/middleware/validation";
import { createTransactionSchema, updateTransactionSchema } from "./TransactionDTO";

export class TransactionModule extends BaseModule {
  public name: string = "TransactionModule";
  public version: string = "1.0.0";
  public basePath: string = "/transactions/v1/";

  private logger = new AppLogger("TransactionModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("TransactionService", new TransactionService(prisma));
  }

  protected async setupControllers(): Promise<void> {
    const transactionService = this.getService<TransactionService>("TransactionService");
    this.registerController("TransactionController", new TransactionController(transactionService));
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<TransactionController>("TransactionController");

    // POST /transactions/v1/
    this.router.post(
      "/",
      validateRequest(createTransactionSchema),
      controller.create.bind(controller),
    );

    // GET /transactions/v1/
    this.router.get("/", controller.list.bind(controller));

    // GET /transactions/v1/summary
    this.router.get("/summary", controller.getSummary.bind(controller));

    // GET /transactions/v1/:id
    this.router.get("/:id", controller.getOne.bind(controller));

    // PATCH /transactions/v1/:id
    this.router.patch(
      "/:id",
      validateRequest(updateTransactionSchema),
      controller.update.bind(controller),
    );

    // DELETE /transactions/v1/:id
    this.router.delete("/:id", controller.delete.bind(controller));
  }
}

