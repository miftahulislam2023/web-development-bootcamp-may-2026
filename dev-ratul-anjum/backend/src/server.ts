import "dotenv/config";
import http from "http";
import { Server } from "http";
import { prisma } from "./prisma/index.js";
import { env } from "./utils/env.js";
import app from "./app.js";
import { initSocket } from "./socket/index.js";

let server: Server;

const httpServer = http.createServer(app);

// attach socket
initSocket(httpServer);

// Start the server
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    server = httpServer.listen(env.PORT, () => {
      console.log(`Server started on http://localhost:${env.PORT}`);
    });
  } catch (error: any) {
    console.log(`Failed to start the server :`, error.message);
    process.exit(1);
  }
};
startServer();

// Handle Server Errors
const shutDown = (message: string) => {
  console.error(message);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
};

process.on("unhandledRejection", (err: { message: string }) => {
  shutDown(`Unhandled Promise Rejection occurred : ${err.message}`);
});

process.on("uncaughtException", (err) => {
  shutDown(`Uncaught Exception occurred : ${err.message}`);
});

process.on("SIGTERM", () => {
  shutDown("SIGTERM received. Server is shutting down gracefully...");
});

process.on("SIGINT", () => {
  shutDown("SIGINT received. Server is shutting down gracefully...");
});
