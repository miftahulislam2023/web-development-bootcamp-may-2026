import { createDb } from "@socialIO/db";
import * as schema from "@socialIO/db/schema/auth";
import { env } from "@socialIO/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth() {
  const db = createDb();

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",

      schema: schema,
    }),
    user: {
      fields: {
        image: "imageUrl",
      },
      additionalFields: {
        imagePublicId: {
          type: "string",
          input: false,
        },
      },
    },
    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [],
  });
}

export const auth = createAuth();
