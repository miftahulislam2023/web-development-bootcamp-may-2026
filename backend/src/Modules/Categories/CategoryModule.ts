// src/Modules/Categories/CategoryModule.ts
import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { validateRequest } from "@/middleware/validation";
import { createCategorySchema } from "./CategoryDTO";

export class CategoryModule extends BaseModule {
  public name: string = "CategoryModule";
  public version: string = "1.0.0";
  public basePath: string = "/categories/v1/";

  private logger = new AppLogger("CategoryModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("CategoryService", new CategoryService(prisma));
  }

  protected async setupControllers(): Promise<void> {
    const categoryService = this.getService<CategoryService>("CategoryService");
    this.registerController("CategoryController", new CategoryController(categoryService));
  }

  protected async setupRoutes(): Promise<void> {
    const controller = this.getController<CategoryController>("CategoryController");

    // POST /categories/v1/
    this.router.post(
      "/",
      validateRequest(createCategorySchema),
      controller.create.bind(controller),
    );

    // GET /categories/v1/
    this.router.get("/", controller.list.bind(controller));
  }
}

