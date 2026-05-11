// src/Modules/Transactions/transaction.service.ts
import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { NotFoundError } from "@/core/errors/AppError";
import { CreateTransactionDTO, UpdateTransactionDTO } from "./TransactionDTO";

export class TransactionService {
  private logger = new AppLogger("TransactionService");

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new transaction
   */
  public async createTransaction(userId: string, data: CreateTransactionDTO) {
    this.logger.info("Creating transaction", { userId });

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        type: data.type,
        amount: data.amount,
        currency: data.currency,
        date: data.date,
        categoryId: data.categoryId,
        accountId: data.accountId,
        notes: data.notes,
      },
      include: {
        category: true,
        account: true,
      },
    });

    return transaction;
  }

  /**
   * Get all transactions for a user with pagination and filters
   */
  public async getTransactions(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      type?: string;
      startDate?: Date;
      endDate?: Date;
      categoryId?: string;
    },
  ) {
    this.logger.info("Fetching transactions", { userId, page, pageSize });

    const offset = (page - 1) * pageSize;

    const whereClause: any = { userId };
    if (filters?.type) whereClause.type = filters.type;
    if (filters?.categoryId) whereClause.categoryId = filters.categoryId;
    if (filters?.startDate || filters?.endDate) {
      whereClause.date = {};
      if (filters.startDate) whereClause.date.gte = filters.startDate;
      if (filters.endDate) whereClause.date.lte = filters.endDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: whereClause,
        include: {
          category: true,
          account: true,
        },
        orderBy: { date: "desc" },
        skip: offset,
        take: pageSize,
      }),
      this.prisma.transaction.count({ where: whereClause }),
    ]);

    return {
      data,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Get single transaction
   */
  public async getTransaction(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        category: true,
        account: true,
      },
    });

    if (!transaction || transaction.userId !== userId) {
      throw new NotFoundError("Transaction");
    }

    return transaction;
  }

  /**
   * Update transaction
   */
  public async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionDTO,
  ) {
    const existing = await this.getTransaction(userId, transactionId);

    const updated = await this.prisma.transaction.update({
      where: { id: transactionId },
      data,
      include: {
        category: true,
        account: true,
      },
    });

    return updated;
  }

  /**
   * Delete transaction
   */
  public async deleteTransaction(userId: string, transactionId: string) {
    await this.getTransaction(userId, transactionId);

    await this.prisma.transaction.delete({
      where: { id: transactionId },
    });
  }

  /**
   * Get summary (income, expense, by category)
   */
  public async getSummary(userId: string, startDate?: Date, endDate?: Date) {
    const whereClause: any = { userId };
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = startDate;
      if (endDate) whereClause.date.lte = endDate;
    }

    const transactions = await this.prisma.transaction.findMany({
      where: whereClause,
      include: {
        category: true,
      },
    });

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      byCategory: {} as Record<string, number>,
    };

    transactions.forEach((t) => {
      if (t.type === "income") {
        summary.totalIncome += parseFloat(t.amount.toString());
      } else if (t.type === "expense") {
        summary.totalExpense += parseFloat(t.amount.toString());
      }

      const categoryName = t.category?.name || "Uncategorized";
      summary.byCategory[categoryName] =
        (summary.byCategory[categoryName] || 0) +
        parseFloat(t.amount.toString());
    });

    return summary;
  }
}
