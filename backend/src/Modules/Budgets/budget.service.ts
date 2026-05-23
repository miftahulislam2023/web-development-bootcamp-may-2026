import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { NotFoundError } from "@/core/errors/AppError";
import { CreateBudgetDTO } from "./BudgetDTO";

export class BudgetService {
  private logger = new AppLogger("BudgetService");

  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, data: CreateBudgetDTO) {
    this.logger.info("Creating budget for user", { userId });

    const budget = await this.prisma.budget.create({
      data: {
        userId,
        name: data.name,
        limitAmount: data.limitAmount,
        currency: data.currency,
        period: data.period,
        alertThreshold: data.alertThreshold,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        categoryId: data.categoryId,
      },
    });

    return budget;
  }

  async list(userId: string) {
    this.logger.info("Fetching budgets for user", { userId });

    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    // Enrich with spent amount
    const enriched = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await this.prisma.transaction.aggregate({
          where: {
            userId,
            categoryId: budget.categoryId,
            type: "expense",
            date: {
              gte: budget.startDate,
              lte: budget.endDate,
            },
          },
          _sum: { amount: true },
        });

        return {
          ...budget,
          spent: transactions._sum.amount
            ? Number(transactions._sum.amount)
            : 0,
        };
      }),
    );

    return enriched;
  }

  async getById(userId: string, budgetId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id: budgetId, userId },
      include: { category: true },
    });

    if (!budget) throw new NotFoundError("Budget");
    return budget;
  }

  async update(
    userId: string,
    budgetId: string,
    data: Partial<CreateBudgetDTO>,
  ) {
    this.logger.info("Updating budget", { userId, budgetId });

    const existing = await this.getById(userId, budgetId);
    if (!existing) throw new NotFoundError("Budget");

    const updated = await this.prisma.budget.update({
      where: { id: budgetId },
      data: {
        name: data.name,
        limitAmount: data.limitAmount,
        currency: data.currency,
        period: data.period,
        alertThreshold: data.alertThreshold,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        categoryId: data.categoryId,
      },
    });

    return updated;
  }

  async delete(userId: string, budgetId: string) {
    this.logger.info("Deleting budget", { userId, budgetId });

    const existing = await this.getById(userId, budgetId);
    if (!existing) throw new NotFoundError("Budget");

    await this.prisma.budget.delete({ where: { id: budgetId } });
  }
}
