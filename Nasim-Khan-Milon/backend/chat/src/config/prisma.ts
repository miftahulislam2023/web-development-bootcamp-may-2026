import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log("Prisma connected");

export default prisma;