// src/middleware.ts    (or middleware.js)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthenticated = !!session?.user;

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      // Not logged in → redirect to home
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Logged in → allow access
    return NextResponse.next();
  }

  // if logged-in user tries to visit "/" or landing page → send to dashboard
  if (isAuthenticated && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match everything except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // You can also be more specific:
    // "/:path*",           // ← everything
    // "/dashboard/:path*", // ← only dashboard + subroutes
  ],
};
