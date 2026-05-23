import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { NotFoundError } from "@/core/errors/AppError";
import { CreateCategoryDTO } from "./CategoryDTO";

export class CategoryService {
  private logger = new AppLogger("CategoryService");

  constructor(private readonly prisma: PrismaClient) {}

  async create(userId: string, data: CreateCategoryDTO) {
    this.logger.info("Creating category for user", { userId });

    const category = await this.prisma.category.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
      },
    });

    return category;
  }

  async list(userId: string, type?: string) {
    this.logger.info("Fetching categories for user", { userId, type });

    const where: any = { userId };
    if (type) where.type = type;

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return categories;
  }

  async listGlobal(type?: string) {
    this.logger.info("Fetching global categories", { type });

    const where: any = { userId: null };
    if (type) where.type = type;

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return categories;
  }

  async getById(userId: string, categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [{ userId }, { userId: null }],
      },
    });

    if (!category) throw new NotFoundError("Category");
    return category;
  }

  async update(
    userId: string,
    categoryId: string,
    data: Partial<CreateCategoryDTO>,
  ) {
    this.logger.info("Updating category", { userId, categoryId });

    const existing = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!existing) throw new NotFoundError("Category");

    const updated = await this.prisma.category.update({
      where: { id: categoryId },
      data: {
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
      },
    });

    return updated;
  }

  async delete(userId: string, categoryId: string) {
    this.logger.info("Deleting category", { userId, categoryId });

    const existing = await this.prisma.category.findFirst({
      where: { id: categoryId, userId },
    });

    if (!existing) throw new NotFoundError("Category");

    await this.prisma.category.delete({ where: { id: categoryId } });
  }
}
