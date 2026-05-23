import { Request, Response } from "express";
import { BaseController } from "@/core/BaseController";
import { AppLogger } from "@/core/logging/logger";
import { CreateCategoryDTO, ListCategoriesQuery } from "./CategoryDTO";
import { CategoryService } from "./category.service";
import jwt from "jsonwebtoken";
import { config } from "@/core/config";
import { AuthenticationError } from "@/core/errors/AppError";

export class CategoryController extends BaseController {
  private logger = new AppLogger("CategoryController");

  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  private getUserIdFromRequest(req: Request): string {
    const auth = req.headers.authorization;
    if (!auth) throw new AuthenticationError("Missing authorization header");
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      throw new AuthenticationError("Invalid authorization header");

    try {
      const payload = jwt.verify(parts[1], config.security.jwt.secret!) as any;
      return payload.userId;
    } catch {
      throw new AuthenticationError("Invalid token");
    }
  }

  async create(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const data = req.validatedBody as CreateCategoryDTO;

    const category = await this.categoryService.create(userId, data);
    return this.sendCreatedResponse(req, res, category, "Category created");
  }

  async list(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const query = req.validatedQuery as ListCategoriesQuery;

    const userCategories = await this.categoryService.list(userId, query.type);
    const globalCategories = await this.categoryService.listGlobal(query.type);

    const allCategories = [...userCategories, ...globalCategories];

    return this.sendResponse(
      req,
      res,
      "Categories fetched",
      undefined,
      allCategories,
    );
  }

  async getById(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;

    const category = await this.categoryService.getById(userId, id);
    return this.sendResponse(req, res, "Category fetched", undefined, category);
  }

  async update(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;
    const data = req.validatedBody as Partial<CreateCategoryDTO>;

    const category = await this.categoryService.update(userId, id, data);
    return this.sendResponse(req, res, "Category updated", undefined, category);
  }

  async delete(req: Request, res: Response) {
    const userId = this.getUserIdFromRequest(req);
    const { id } = req.params;

    await this.categoryService.delete(userId, id);
    return this.sendNoContentResponse(res);
  }
}
