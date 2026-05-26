import { Server } from "http";
import http from "http";
import { bootstrapApp } from "./app/bootstrap";
import app from "./app";
import { prisma } from "./lib/prisma";
import config from "./app/config";
import { initSocket } from "./lib/socket";

// Start server
async function startServer() {
  let server: Server;
  const port = config.port || 3000;
  try {
    await bootstrapApp();
    console.log("Database connected");

    const server = http.createServer(app);

        //  Initialize Socket.IO
    initSocket(server);

    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port} `);

    });
    
    server.setTimeout(120000);

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log(`Server closed gracefully.`);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    process.on("SIGTERM", exitHandler);
    process.on("SIGINT", exitHandler);

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (error) => {
      console.log(
        "Unhandled Rejection is detected, we are closing our server...",
      );
      if (server) {
        server.close(() => {
          console.log(error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  } catch (error) {
    console.log("server failed to start", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
startServer();