// src/core/IgnitorApp.ts
import express, { Express } from "express";
import { Context } from "./Context";
import { IgnitorModule } from "./IgnitorModule";
import { config } from "./config";
import { BaseModule } from "./BaseModule";
import { AppError } from "./errors/AppError";
import { HTTPStatusCode } from "@/types/HTTPStatusCode";
import { AppLogger } from "./logging/logger";
import { errorHandler } from "./errors/errorHandler";
import { notFoundHandler } from "@/middleware/notFound";
import { setupGlobalMiddlewares } from "@/middleware/globalMiddlewares";
import { sortModulesByDependencies } from "@/utils/moduleSorter";
import { Server } from "http";

export class IgnitorApp {
  private app: Express;
  private context: Context;
  private modules: IgnitorModule[] = [];

  constructor() {
    this.app = express();
    this.context = new Context();

    // Mission 1: Setup global Express middlewares (Helmet, CORS, rate limits, etc.)
    setupGlobalMiddlewares(this.app);
  }

  // Allow index.ts to access the Context to register infrastructure
  public getContext(): Context {
    return this.context;
  }

  public getApp(): Express {
    return this.app;
  }

  // Register an application module
  public registerModule(module: IgnitorModule): void {
    this.modules.push(module);
    AppLogger.info(`⚙ Registered module: ${module.name}`);
  }

  // The main boot sequence
  public async spark(port: number): Promise<void> {
    try {
      // 1. Initialize Infrastructure (Connects Prisma, Redis, etc.)
      await this.context.initialize();

      // 2. Sort and Initialize Modules
      const sortedModules = sortModulesByDependencies(this.modules);
      for (const module of sortedModules) {
        await module.initialize(this.context);

        // 3. Register module routes automatically if it's a BaseModule
        if (module instanceof BaseModule) {
          this.app.use(module.basePath, module.getRouter());
          AppLogger.info(`↩ Registered routes for module: ${module.name}`);
        }
      }

      this.app.get("/health", (req, res) => {
        res.status(200).json({
          status: "healthy",
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        });
      });

      // 4. Global 404 and Error Handlers (MUST be last)
      this.app.use(notFoundHandler());
      this.app.use(errorHandler());

      // 5. Start the server
      AppLogger.info("🙭 Starting server...");
      const server = this.app.listen(port, () => {
        AppLogger.info(
          `🗲 Ignitor Server running on port ${port} in ${config.server.env} mode`,
        );
      });

      // 6. Setup Event Listeners for crash and shutdown safety
      this.setupServerEvents(server, port);
      this.setupGracefulShutdown(server);

      AppLogger.info("✔ Server setup complete");
    } catch (error) {
      AppLogger.error(" Failed to start server:", { error });
      throw error;
    }
  }

  private setupServerEvents(server: Server, port: number): void {
    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        throw new AppError({
          statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
          message: `Port ${port} is already in use`,
          code: "PORT_IN_USE",
        });
      }
      throw err;
    });
  }

  private setupGracefulShutdown(server: Server): void {
    const shutdownSignals = ["SIGTERM", "SIGINT", "SIGUSR2"];

    shutdownSignals.forEach((signal) => {
      process.on(signal, async () => {
        AppLogger.info(` Received ${signal}, starting graceful shutdown...`);

        // Stop accepting new connections
        server.close(async () => {
          try {
            await this.shutdown();
            process.exit(0);
          } catch (error) {
            AppLogger.error(" Error during shutdown:", { error });
            process.exit(1);
          }
        });

        // Force shutdown if taking too long
        setTimeout(() => {
          AppLogger.error(" Forced shutdown due to timeout");
          process.exit(1);
        }, 30000);
      });
    });
  }

  public async shutdown(): Promise<void> {
    AppLogger.info("🙭 Shutting down application...");

    // 1. Shutdown modules in reverse order
    for (let i = this.modules.length - 1; i >= 0; i--) {
      const module = this.modules[i];
      if (module.onShutdown) {
        try {
          AppLogger.info(`⚙ Shutting down module: ${module.name}`);
          await module.onShutdown();
        } catch (error) {
          AppLogger.error(` Error shutting down module ${module.name}`, {
            error,
          });
        }
      }
    }

    // 2. Shutdown infrastructure (Disconnect Prisma, Redis, etc.)
    await this.context.shutdown();
    AppLogger.info("✔ Application shutdown complete");
  }
}
