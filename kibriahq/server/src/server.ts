import http from "http";
import app from "./app/app.js";
import startServer from "./utils/startServer.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 4000;
const server = http.createServer(app);


startServer(server, PORT);

async function gracefulShutdown(signal: string) {
    console.log(`${signal} received. Shutting down gracefully...`)

    server.close(async () => {
        await prisma.$disconnect()
        process.exit(0)
    })
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"))
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"))