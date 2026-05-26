// src/bootstrap/ensureUsers.ts

import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

import { prisma } from "../../lib/prisma";

type SeedUser = {
  name: string;
  email: string;
  password: string;
};

export const ensureUsers = async (): Promise<void> => {
  const users: SeedUser[] = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: "password123",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      password: "password123",
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      password: "password123",
    },
    {
      name: "Diana Miller",
      email: "diana@example.com",
      password: "password123",
    },
  ];

  for (const userData of users) {
    const email = userData.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      console.log(`ℹ️ User already exists: ${email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    await prisma.user.create({
      data: {
        name: userData.name,
        email,
        password: hashedPassword,
        role: Role.USER,
        isEmailVerified: true,
      },
    });

    console.log(`✅ User created: ${email}`);
  }
};