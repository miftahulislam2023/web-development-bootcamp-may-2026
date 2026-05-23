import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { NotFoundError } from "@/core/errors/AppError";
import { CreateTransactionDTO } from "./TransactionDTO";

export class TransactionService {
  private logger = new AppLogger("TransactionService");

  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, data: CreateTransactionDTO) {
    this.logger.info("Creating transaction for user", { userId });

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        date: new Date(data.date),
        notes: data.notes,
        name: data.name,
        accountId: data.accountId,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });

    return transaction;
  }

  async list(
    userId: string,
    page: number,
    limit: number,
    filters?: { type?: string; startDate?: string; endDate?: string },
  ) {
    this.logger.info("Fetching transactions", { userId, page, limit });

    const where: any = { userId };
    if (filters?.type) where.type = filters.type;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    const offset = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { date: "desc" },
        include: { category: true },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async getById(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id: transactionId, userId },
    });

    if (!transaction) throw new NotFoundError("Transaction");
    return transaction;
  }

  async update(
    userId: string,
    transactionId: string,
    data: Partial<CreateTransactionDTO>,
  ) {
    this.logger.info("Updating transaction", { userId, transactionId });

    const existing = await this.getById(userId, transactionId);
    if (!existing) throw new NotFoundError("Transaction");

    const updated = await this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        paymentMethod: data.paymentMethod,
        date: data.date ? new Date(data.date) : undefined,
        notes: data.notes,
        accountId: data.accountId,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });

    return updated;
  }

  async delete(userId: string, transactionId: string) {
    this.logger.info("Deleting transaction", { userId, transactionId });

    const existing = await this.getById(userId, transactionId);
    if (!existing) throw new NotFoundError("Transaction");

    await this.prisma.transaction.delete({ where: { id: transactionId } });
  }
}
