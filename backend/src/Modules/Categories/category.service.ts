// src/Modules/Categories/category.service.ts
import { PrismaClient } from "@/prisma/generated/client";
import { AppLogger } from "@/core/logging/logger";
import { CreateCategoryDTO } from "./CategoryDTO";

export class CategoryService {
  private logger = new AppLogger("CategoryService");

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Create a new category
   */
  public async createCategory(userId: string, data: CreateCategoryDTO) {
    this.logger.info("Creating category", { userId });

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

  /**
   * Get all categories (global + user-specific)
   */
  public async getCategories(userId: string) {
    this.logger.info("Fetching categories", { userId });

    const categories = await this.prisma.category.findMany({
      where: {
        OR: [
          { userId: null }, // Global categories
          { userId }, // User-specific categories
        ],
      },
      orderBy: { name: "asc" },
    });

    return categories;
  }

  /**
   * Get categories by type
   */
  public async getCategoriesByType(userId: string, type: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        type,
        OR: [
          { userId: null },
          { userId },
        ],
      },
      orderBy: { name: "asc" },
    });

    return categories;
  }
}

