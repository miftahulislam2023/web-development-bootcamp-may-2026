import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CreateTransactionDTO, ListTransactionsQuery } from "./TransactionDTO";
import { TransactionService } from "./transaction.service";
import jwt from "jsonwebtoken";
import { config } from "@/core/config";
import { AuthenticationError } from "@/core/errors/AppError";

export class TransactionController extends BaseController {
  private logger = new AppLogger("TransactionController");

  constructor(private readonly transactionService: TransactionService) {
    super();
  }

  private getUserIdFromRequest(req: Request): string {
    const auth = req.headers.authorization;
    if (!auth) throw new AuthenticationError("Missing authorization header");
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      throw new AuthenticationError("Invalid authorization header");

    try {
      const payload = jwt.verify(parts[1], config.security.jwt.secret!) as any;
      return payload.userId;
    } catch {
      throw new AuthenticationError("Invalid token");
    }
  }

  async create(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const data = req.validatedBody as CreateTransactionDTO;

    const transaction = await this.transactionService.create(userId, data);
    return this.sendCreatedResponse(
      req,
      res,
      transaction,
      "Transaction created",
    );
  }

  async list(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const query = req.validatedQuery as ListTransactionsQuery;

    const result = await this.transactionService.list(
      userId,
      query.page,
      query.limit,
      {
        type: query.type,
        startDate: query.startDate,
        endDate: query.endDate,
      },
    );

    return this.sendPaginatedResponse(
      req,
      res,
      result.pagination,
      "Transactions fetched",
      result.data,
    );
  }

  async getById(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;

    const transaction = await this.transactionService.getById(userId, id);
    return this.sendResponse(
      req,
      res,
      "Transaction fetched",
      undefined,
      transaction,
    );
  }

  async update(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;
    const data = req.validatedBody as Partial<CreateTransactionDTO>;

    const transaction = await this.transactionService.update(userId, id, data);
    return this.sendResponse(
      req,
      res,
      "Transaction updated",
      undefined,
      transaction,
    );
  }

  async delete(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;

    await this.transactionService.delete(userId, id);
    return this.sendNoContentResponse(res);
  }
}
