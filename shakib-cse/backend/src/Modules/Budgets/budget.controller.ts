import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CreateBudgetDTO } from "./BudgetDTO";
import { BudgetService } from "./budget.service";
import jwt from "jsonwebtoken";
import { config } from "@/core/config";
import { AuthenticationError } from "@/core/errors/AppError";

export class BudgetController extends BaseController {
  private logger = new AppLogger("BudgetController");

  constructor(private readonly budgetService: BudgetService) {
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
    const data = req.validatedBody as CreateBudgetDTO;

    const budget = await this.budgetService.create(userId, data);
    return this.sendCreatedResponse(req, res, budget, "Budget created");
  }

  async list(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);

    const budgets = await this.budgetService.list(userId);
    return this.sendResponse(req, res, "Budgets fetched", undefined, budgets);
  }

  async getById(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;

    const budget = await this.budgetService.getById(userId, id);
    return this.sendResponse(req, res, "Budget fetched", undefined, budget);
  }

  async update(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;
    const data = req.validatedBody as Partial<CreateBudgetDTO>;

    const budget = await this.budgetService.update(userId, id, data);
    return this.sendResponse(req, res, "Budget updated", undefined, budget);
  }

  async delete(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;

    await this.budgetService.delete(userId, id);
    return this.sendNoContentResponse(res);
  }
}
