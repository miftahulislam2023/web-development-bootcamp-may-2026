// src/core/BaseModule.ts
import { Router } from "express";
import { Context } from "./Context";
import { IgnitorModule } from "./IgnitorModule";
import { AppLogger } from "./logging/logger";

// Registry interface for localized Dependency Injection
export interface ModuleDependencies {
  services: Map<string, any>;
  controllers: Map<string, any>;
}

export abstract class BaseModule implements IgnitorModule {
  public abstract readonly name: string;
  public abstract readonly version: string;
  public abstract readonly basePath: string;
  public abstract readonly dependencies?: string[];

  protected router: Router;
  protected context!: Context;

  // Internal DI container for the module
  protected container: ModuleDependencies = {
    services: new Map(),
    controllers: new Map(),
  };

  constructor() {
    this.router = Router();
  }

  /**
   * Initialize the module
   * Follows Clean Architecture Dependency Rule: from innermost layer to outermost layer
   */
  public async initialize(context: Context): Promise<void> {
    this.context = context;

    AppLogger.info(`Initializing module: ${this.name} v${this.version}`);

    // 1. Pre-init hooks
    await this.onBeforeInit();

    // 2. Business Logic / Use Cases Layer
    await this.setupUseCases();

    // 3. Interface Adapters Layer (Controllers)
    await this.setupControllers();

    // 4. Delivery Layer (Routes)
    await this.setupRoutes();

    // 5. Post-init hooks
    await this.onAfterInit();

    AppLogger.info(`Module ${this.name} initialized successfully`);
  }

  // ==========================================
  // Abstract Methods (To be implemented by child modules)
  // ==========================================

  /**
   * Layer 1: Setup business logic Services / Use Cases
   */
  protected abstract setupUseCases(): Promise<void>;

  /**
   * Layer 2: Setup Presentation Controllers
   */
  protected abstract setupControllers(): Promise<void>;

  /**
   * Layer 3: Wire HTTP routes to controllers
   */
  protected abstract setupRoutes(): Promise<void>;

  // ==========================================
  // Dependency Injection Helpers
  // ==========================================

  protected registerService(key: string, instance: any): void {
    this.container.services.set(key, instance);
  }

  protected getService<T>(key: string): T {
    return this.container.services.get(key) as T;
  }

  protected registerController(key: string, instance: any): void {
    this.container.controllers.set(key, instance);
  }

  protected getController<T>(key: string): T {
    return this.container.controllers.get(key) as T;
  }

  // ==========================================
  // Lifecycle Hooks & Utilities
  // ==========================================

  protected async onBeforeInit(): Promise<void> {}
  protected async onAfterInit(): Promise<void> {}

  public async onShutdown(): Promise<void> {
    AppLogger.info(`Shutting down module: ${this.name}`);
    await this.cleanup();
  }

  protected async cleanup(): Promise<void> {
    // Clear DI registries to prevent memory leaks during shutdown
    this.container.services.clear();
    this.container.controllers.clear();
  }

  public getRouter(): Router {
    return this.router;
  }

  public getMetadata() {
    return {
      name: this.name,
      version: this.version,
      dependencies: this.dependencies || [],
    };
  }

  public async healthCheck(): Promise<{
    status: "healthy" | "unhealthy";
    details?: any;
  }> {
    return { status: "healthy" };
  }
}
