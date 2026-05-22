/**
 * Edge-safe Auth.js instance for middleware only (no Prisma).
 * Lazy config so AUTH_SECRET is read after env is available.
 */
import NextAuth from "next-auth";
import { authCallbacks } from "@/lib/auth-callbacks";
import { getAuthSecret } from "@/lib/auth-secret";

// Force production URL in Edge runtime as well to prevent localhost redirects on Vercel
if (process.env.NODE_ENV === "production") {
  const prodUrl = "https://nexora-studio-ten.vercel.app";
  if (!process.env.AUTH_URL || process.env.AUTH_URL.includes("localhost")) {
    process.env.AUTH_URL = prodUrl;
  }
  process.env.NEXTAUTH_URL = process.env.AUTH_URL;
}

export const { auth } = NextAuth(async () => ({
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
  providers: [],
  callbacks: authCallbacks,
}));
