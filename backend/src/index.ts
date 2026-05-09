// src/index.ts
import { IgnitorApp } from "./core/IgnitorApp";
import { AppLogger } from "./core/logging/logger";
import { config } from "./core/config";

// Providers (Infrastructure)
import { PrismaProvider } from "./providers/PrismaProvider";
import { prisma } from "./lib/prisma";
import { AuthModule } from "./Modules/Auth/AuthModule";

// Modules (Business Logic)

async function bootstrap() {
  try {
    AppLogger.info("🗹 Starting application bootstrap");

    // 1. Initialize the Ignitor Engine
    const app = new IgnitorApp();

    // 2. Register Infrastructure Providers
    AppLogger.info("⚙ Registering infrastructure...");
    app.getContext().registerProvider("prisma", new PrismaProvider(prisma));

    // 3. Register Application Modules
    AppLogger.info("⚙ Registering modules...");
    app.registerModule(new AuthModule());
    // app.registerModule(new ProductModule());
    AppLogger.info("✔ All modules registered successfully");

    // 4. Spark the server!
    await app.spark(config.server.port);

    AppLogger.info("✷ Ignitor sparked successfully");
  } catch (error) {
    // Centralized Bootstrap Error Handling
    AppLogger.error("⬤ Failed to initialize application:", {
      error: error instanceof Error ? error : new Error(String(error)),
      context: "application-bootstrap",
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
}

// Start the application
bootstrap().catch((err) => {
  AppLogger.error("❌ Unhandled bootstrap error:", { error: err });
  process.exit(1);
});
