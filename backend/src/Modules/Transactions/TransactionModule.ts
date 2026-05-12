import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { validateRequest } from "@/middleware/validation";
import {
  createTransactionSchema,
  listTransactionsSchema,
} from "./TransactionDTO";

export class TransactionModule extends BaseModule {
  public name: string = "TransactionModule";
  public version: string = "1.0.0";
  public basePath: string = "/transactions/v1/";
  public dependencies?: string[] | undefined;

  private logger = new AppLogger("TransactionModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("TransactionService", new TransactionService(prisma));
  }

  protected async setupControllers(): Promise<void> {
    const transactionService =
      this.getService<TransactionService>("TransactionService");
    this.registerController(
      "TransactionController",
      new TransactionController(transactionService),
    );
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<TransactionController>(
      "TransactionController",
    );

    // GET /transactions/v1
    this.router.get(
      "/",
      validateRequest(listTransactionsSchema),
      controller.list.bind(controller),
    );

    // POST /transactions/v1
    this.router.post(
      "/",
      validateRequest(createTransactionSchema),
      controller.create.bind(controller),
    );

    // GET /transactions/v1/:id
    this.router.get("/:id", controller.getById.bind(controller));

    // PATCH /transactions/v1/:id
    this.router.patch(
      "/:id",
      validateRequest(createTransactionSchema),
      controller.update.bind(controller),
    );

    // DELETE /transactions/v1/:id
    this.router.delete("/:id", controller.delete.bind(controller));
  }
}
