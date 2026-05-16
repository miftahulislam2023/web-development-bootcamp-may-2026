import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { authCallbacks } from "@/lib/auth-callbacks";
import { getAuthSecret } from "@/lib/auth-secret";
import { getGoogleOAuthCredentials } from "@/lib/google-oauth-env";

// Force production URL as early as possible to prevent localhost redirects on Vercel
if (process.env.NODE_ENV === "production") {
  const prodUrl = "https://nexora-studio-ten.vercel.app";
  if (!process.env.AUTH_URL || process.env.AUTH_URL.includes("localhost")) {
    process.env.AUTH_URL = prodUrl;
  }
  process.env.NEXTAUTH_URL = process.env.AUTH_URL;
}

/**
 * Clean Auth.js v5 config for production.
 * Uses Google provider only and ensures trustHost: true.
 */
export const { handlers, signIn, signOut, auth } = NextAuth(async () => {
  return {
    adapter: PrismaAdapter(prisma),
    trustHost: true,
    basePath: "/api/auth",
    secret: getAuthSecret(),
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
      signIn: "/login",
    },
    debug: process.env.AUTH_DEBUG === "true",
    providers: [
      Google({
        clientId: getGoogleOAuthCredentials().clientId,
        clientSecret: getGoogleOAuthCredentials().clientSecret,
      }),
    ],
    callbacks: authCallbacks,
  };
});
