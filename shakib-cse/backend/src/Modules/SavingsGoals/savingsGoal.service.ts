import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { NotFoundError } from "@/core/errors/AppError";
import { CreateSavingsGoalDTO } from "./SavingsGoalDTO";

export class SavingsGoalService {
  private logger = new AppLogger("SavingsGoalService");

  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, data: CreateSavingsGoalDTO) {
    this.logger.info("Creating savings goal for user", { userId });

    return this.prisma.savingsGoal.create({
      data: {
        userId,
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        currency: data.currency,
        deadline: new Date(data.deadline),
      },
    });
  }

  async list(userId: string) {
    this.logger.info("Fetching savings goals", { userId });

    return this.prisma.savingsGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(userId: string, goalId: string) {
    const goal = await this.prisma.savingsGoal.findFirst({
      where: { id: goalId, userId },
    });

    if (!goal) throw new NotFoundError("Savings goal");
    return goal;
  }

  async update(
    userId: string,
    goalId: string,
    data: Partial<CreateSavingsGoalDTO>,
  ) {
    this.logger.info("Updating savings goal", { userId, goalId });

    await this.getById(userId, goalId);

    return this.prisma.savingsGoal.update({
      where: { id: goalId },
      data: {
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        currency: data.currency,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
      },
    });
  }

  async delete(userId: string, goalId: string) {
    this.logger.info("Deleting savings goal", { userId, goalId });

    await this.getById(userId, goalId);
    await this.prisma.savingsGoal.delete({ where: { id: goalId } });
  }
}
