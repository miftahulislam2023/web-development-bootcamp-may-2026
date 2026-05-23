import { PrismaClient } from "@/generated/prisma/client";
// import { Redis } from "ioredis";
// import Stripe from "stripe";

export interface ServiceMap {
  prisma: PrismaClient;
  // redis: Redis;
  // stripe: Stripe;
}
