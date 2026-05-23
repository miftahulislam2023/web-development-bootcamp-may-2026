import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { AuthenticationError } from "@/core/errors/AppError";
import { config } from "@/core/config";
import { SavingsGoalService } from "./savingsGoal.service";
import { CreateSavingsGoalDTO } from "./SavingsGoalDTO";

export class SavingsGoalController extends BaseController {
  private logger = new AppLogger("SavingsGoalController");

  constructor(private readonly savingsGoalService: SavingsGoalService) {
    super();
  }

  private getUserIdFromRequest(req: Request): string {
    const auth = req.headers.authorization;
    if (!auth) throw new AuthenticationError("Missing authorization header");
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new AuthenticationError("Invalid authorization header");
    }

    try {
      const payload = jwt.verify(parts[1], config.security.jwt.secret!) as any;
      return payload.userId;
    } catch {
      throw new AuthenticationError("Invalid token");
    }
  }

  async create(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const data = req.validatedBody as CreateSavingsGoalDTO;
    const goal = await this.savingsGoalService.create(userId, data);
    return this.sendCreatedResponse(req, res, goal, "Savings goal created");
  }

  async list(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const goals = await this.savingsGoalService.list(userId);
    return this.sendResponse(
      req,
      res,
      "Savings goals fetched",
      undefined,
      goals,
    );
  }

  async getById(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;
    const goal = await this.savingsGoalService.getById(userId, id);
    return this.sendResponse(req, res, "Savings goal fetched", undefined, goal);
  }

  async update(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;
    const data = req.validatedBody as Partial<CreateSavingsGoalDTO>;
    const goal = await this.savingsGoalService.update(userId, id, data);
    return this.sendResponse(req, res, "Savings goal updated", undefined, goal);
  }

  async delete(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;
    await this.savingsGoalService.delete(userId, id);
    return this.sendNoContentResponse(res);
  }
}
