// src/bootstrap/ensureSuperAdmin.ts

import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

import config from "../config";
import { prisma } from "../../lib/prisma";

export const ensureSuperAdmin = async (): Promise<void> => {
  // Run only when explicitly enabled
  if (config.auto_seed_super_admin !== "true") {
    return;
  }

  const email = config.super_admin_email?.toLowerCase().trim();
  const password = config.super_admin_password;

  if (!email || !password) {
    console.log(
      "⚠️ SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is missing. Skipping super admin bootstrap."
    );
    return;
  }

  // Check if super admin already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (existingUser) {
    // Update role if needed
    if (existingUser.role !== Role.SUPER_ADMIN) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          role: Role.SUPER_ADMIN,
          isEmailVerified: true,
        },
      });

      console.log(`✅ Updated ${email} to SUPER_ADMIN`);
    } else {
      console.log(`ℹ️ Super Admin already exists: ${email}`);
    }

    return;
  }

  // Create new super admin
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isEmailVerified: true,
    },
  });

  console.log(`✅ Super Admin created successfully: ${email}`);
};