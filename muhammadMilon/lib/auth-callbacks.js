import { NextResponse } from "next/server";

const PROD_DOMAIN = "https://nexora-studio-ten.vercel.app";

/** Shared JWT/session callbacks for Edge middleware and Node Auth.js instance. */
export const authCallbacks = {
  /**
   * Runs for proxy/middleware (`auth` with a Request). Keeps `proxy.js` as a thin
   * `auth(req)` dispatch instead of `auth((req) => …)`, which breaks under Next.js 16 proxy.
   */
  authorized({ request, auth }) {
    const path = request.nextUrl.pathname;
    const isProd = process.env.NODE_ENV === "production";
    
    // Force production origin if in production to prevent localhost redirects
    const origin = isProd ? PROD_DOMAIN : request.nextUrl.origin;

    if (path.startsWith("/blocked")) {
      return true;
    }

    if (auth?.user?.blocked) {
      if (path.startsWith("/dashboard") || path.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/blocked", origin));
      }
    }

    if (path.startsWith("/admin")) {
      if (!auth?.user) {
        return false;
      }
      if (auth.user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", origin));
      }
      return true;
    }

    if (path.startsWith("/dashboard") && !auth?.user) {
      return false;
    }
    if ((path === "/login" || path === "/register") && auth?.user && !auth.user.blocked) {
      const dest = auth.user.role === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, origin));
    }
    return true;
  },
  async jwt({ token, user, account }) {
    if (user) {
      token.id = user.id;
      if (user.email) token.email = user.email;
      token.role = user.role ?? "user";
      token.blocked = Boolean(user.blockedAt);
    }
    if (account?.provider === "google" && user?.id) {
      token.id = user.id;
      token.role = user.role ?? "user";
      token.blocked = Boolean(user.blockedAt);
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role ?? "user";
      session.user.blocked = Boolean(token.blocked);
    }
    return session;
  },
};
