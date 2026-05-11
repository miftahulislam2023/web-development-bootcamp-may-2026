// src/Modules/Categories/category.controller.ts
import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CategoryService } from "./category.service";
import { CreateCategoryDTO } from "./CategoryDTO";

export class CategoryController extends BaseController {
  private logger = new AppLogger("CategoryController");

  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  /**
   * POST /categories/v1/
   */
  public async create(req: Request, res: Response) {
    const userId = (req as any).userId;
    const data = req.validatedBody as CreateCategoryDTO;

    const category = await this.categoryService.createCategory(userId, data);

    return this.sendCreatedResponse(req, res, category, "Category created");
  }

  /**
   * GET /categories/v1/
   */
  public async list(req: Request, res: Response) {
    const userId = (req as any).userId;
    const { type } = req.query;

    let categories;
    if (type) {
      categories = await this.categoryService.getCategoriesByType(userId, type as string);
    } else {
      categories = await this.categoryService.getCategories(userId);
    }

    return this.sendResponse(req, res, "Categories retrieved", 200, categories);
  }
}

