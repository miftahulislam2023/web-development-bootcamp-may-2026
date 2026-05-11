// src/Modules/Budgets/budget.controller.ts
import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { BudgetService } from "./budget.service";
import { CreateBudgetDTO, UpdateBudgetDTO } from "./BudgetDTO";

export class BudgetController extends BaseController {
  private logger = new AppLogger("BudgetController");

  constructor(private readonly budgetService: BudgetService) {
    super();
  }

  /**
   * POST /budgets/v1/
   */
  public async create(req: Request, res: Response) {
    const userId = (req as any).userId;
    const data = req.validatedBody as CreateBudgetDTO;

    const budget = await this.budgetService.createBudget(userId, data);

    return this.sendCreatedResponse(req, res, budget, "Budget created");
  }

  /**
   * GET /budgets/v1/
   */
  public async list(req: Request, res: Response) {
    const userId = (req as any).userId;

    const budgets = await this.budgetService.getBudgets(userId);

    return this.sendResponse(req, res, "Budgets retrieved", 200, budgets);
  }

  /**
   * GET /budgets/v1/:id
   */
  public async getOne(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { id } = req.params;

    const budget = await this.budgetService.getBudget(userId, id);

    return this.sendResponse(req, res, "Budget retrieved", 200, budget);
  }

  /**
   * PATCH /budgets/v1/:id
   */
  public async update(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { id } = req.params;
    const data = req.validatedBody as UpdateBudgetDTO;

    const budget = await this.budgetService.updateBudget(userId, id, data);

    return this.sendResponse(req, res, "Budget updated", 200, budget);
  }

  /**
   * DELETE /budgets/v1/:id
   */
  public async delete(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { id } = req.params;

    await this.budgetService.deleteBudget(userId, id);

    return this.sendNoContentResponse(res);
  }
}

