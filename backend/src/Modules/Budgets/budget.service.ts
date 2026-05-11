// src/Modules/Budgets/budget.service.ts
import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { NotFoundError } from "@/core/errors/AppError";
import { CreateBudgetDTO, UpdateBudgetDTO } from "./BudgetDTO";

export class BudgetService {
  private logger = new AppLogger("BudgetService");

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new budget
   */
  public async createBudget(userId: string, data: CreateBudgetDTO) {
    this.logger.info("Creating budget", { userId });

    const startDate = new Date();
    const endDate = this.calculateEndDate(startDate, data.period);

    const budget = await this.prisma.budget.create({
      data: {
        userId,
        name: data.name,
        categoryId: data.categoryId,
        limitAmount: data.limitAmount,
        currency: data.currency,
        period: data.period,
        alertThreshold: data.alertThreshold,
        startDate,
        endDate,
      },
      include: {
        category: true,
      },
    });

    return budget;
  }

  /**
   * Get all budgets for a user
   */
  public async getBudgets(userId: string) {
    this.logger.info("Fetching budgets", { userId });

    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate spent amount and percentage for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async budget => {
        const spent = await this.getSpentAmount(userId, budget.categoryId);
        return {
          ...budget,
          spent: spent,
          percentage: (spent / parseFloat(budget.limitAmount.toString())) * 100,
        };
      }),
    );

    return budgetsWithSpent;
  }

  /**
   * Get single budget
   */
  public async getBudget(userId: string, budgetId: string) {
    const budget = await this.prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        category: true,
      },
    });

    if (!budget || budget.userId !== userId) {
      throw new NotFoundError("Budget");
    }

    const spent = await this.getSpentAmount(userId, budget.categoryId);
    const percentage = (spent / parseFloat(budget.limitAmount.toString())) * 100;

    return {
      ...budget,
      spent,
      percentage,
    };
  }

  /**
   * Update budget
   */
  public async updateBudget(
    userId: string,
    budgetId: string,
    data: UpdateBudgetDTO,
  ) {
    await this.getBudget(userId, budgetId);

    const updated = await this.prisma.budget.update({
      where: { id: budgetId },
      data,
      include: {
        category: true,
      },
    });

    const spent = await this.getSpentAmount(userId, updated.categoryId);
    const percentage = (spent / parseFloat(updated.limitAmount.toString())) * 100;

    return {
      ...updated,
      spent,
      percentage,
    };
  }

  /**
   * Delete budget
   */
  public async deleteBudget(userId: string, budgetId: string) {
    await this.getBudget(userId, budgetId);

    await this.prisma.budget.delete({
      where: { id: budgetId },
    });
  }

  /**
   * Get spent amount for a category
   */
  private async getSpentAmount(userId: string, categoryId: string | null): Promise<number> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        type: "expense",
        categoryId,
      },
    });

    return transactions.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  }

  /**
   * Calculate end date based on period
   */
  private calculateEndDate(startDate: Date, period: string): Date {
    const endDate = new Date(startDate);
    if (period === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (period === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    return endDate;
  }
}

