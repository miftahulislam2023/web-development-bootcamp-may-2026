import "dotenv/config";

import { hash } from "bcryptjs";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
      username: "demouser",
      bio: "This is a seeded demo account.",
      passwordHash,
    },
  });

  const room = await prisma.room.upsert({
    where: { name: "general" },
    update: {},
    create: {
      name: "general",
      description: "Default room for setup checks",
      createdById: user.id,
    },
  });

  await prisma.roomMember.upsert({
    where: {
      roomId_userId: {
        roomId: room.id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      roomId: room.id,
      userId: user.id,
    },
  });

  // eslint-disable-next-line no-console
  console.log("Seed complete: demo@example.com / password123");
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
