// src/Modules/Transactions/transaction.controller.ts
import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { TransactionService } from "./transaction.service";
import { CreateTransactionDTO, UpdateTransactionDTO } from "./TransactionDTO";

export class TransactionController extends BaseController {
  private logger = new AppLogger("TransactionController");

  constructor(private readonly transactionService: TransactionService) {
    super();
  }

  /**
   * POST /transactions/v1/
   */
  public async create(req: Request, res: Response) {
    const userId = (req as any).userId;
    const data = req.validatedBody as CreateTransactionDTO;

    const transaction = await this.transactionService.createTransaction(userId, data);

    return this.sendCreatedResponse(req, res, transaction, "Transaction created");
  }

  /**
   * GET /transactions/v1/
   */
  public async list(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { page = 1, pageSize = 20, type, startDate, endDate, categoryId } = req.query;

    const result = await this.transactionService.getTransactions(
      userId,
      Number(page),
      Number(pageSize),
      {
        type: type as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        categoryId: categoryId as string,
      },
    );

    return this.sendPaginatedResponse(
      req,
      res,
      result.meta,
      "Transactions retrieved",
      result.data,
    );
  }

  /**
   * GET /transactions/v1/:id
   */
  public async getOne(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { id } = req.params;

    const transaction = await this.transactionService.getTransaction(userId, id);

    return this.sendResponse(req, res, "Transaction retrieved", 200, transaction);
  }

  /**
   * PATCH /transactions/v1/:id
   */
  public async update(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { id } = req.params;
    const data = req.validatedBody as UpdateTransactionDTO;

    const transaction = await this.transactionService.updateTransaction(userId, id, data);

    return this.sendResponse(req, res, "Transaction updated", 200, transaction);
  }

  /**
   * DELETE /transactions/v1/:id
   */
  public async delete(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { id } = req.params;

    await this.transactionService.deleteTransaction(userId, id);

    return this.sendNoContentResponse(res);
  }

  /**
   * GET /transactions/v1/summary
   */
  public async getSummary(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { startDate, endDate } = req.query;

    const summary = await this.transactionService.getSummary(
      userId,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
    );

    return this.sendResponse(req, res, "Summary retrieved", 200, summary);
  }
}

