import { BaseModule } from "@/core/BaseModule";
import { AppLogger } from "@/core/logging/logger";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { validateRequest } from "@/middleware/validation";
import { createCategorySchema, listCategoriesSchema } from "./CategoryDTO";

export class CategoryModule extends BaseModule {
  public name: string = "CategoryModule";
  public version: string = "1.0.0";
  public basePath: string = "/categories/v1/";
  public dependencies?: string[] | undefined;

  private logger = new AppLogger("CategoryModule");

  protected async setupUseCases(): Promise<void> {
    const prisma = this.context.getService("prisma");
    this.registerService("CategoryService", new CategoryService(prisma));
  }

  protected async setupControllers(): Promise<void> {
    const categoryService = this.getService<CategoryService>("CategoryService");
    this.registerController(
      "CategoryController",
      new CategoryController(categoryService),
    );
  }

  protected async setupRoutes(): Promise<void> {
    const controller =
      this.getController<CategoryController>("CategoryController");

    // GET /categories/v1
    this.router.get(
      "/",
      validateRequest(listCategoriesSchema),
      controller.list.bind(controller),
    );

    // POST /categories/v1
    this.router.post(
      "/",
      validateRequest(createCategorySchema),
      controller.create.bind(controller),
    );

    // GET /categories/v1/:id
    this.router.get("/:id", controller.getById.bind(controller));

    // PATCH /categories/v1/:id
    this.router.patch(
      "/:id",
      validateRequest(createCategorySchema),
      controller.update.bind(controller),
    );

    // DELETE /categories/v1/:id
    this.router.delete("/:id", controller.delete.bind(controller));
  }
}
