import { NextRequest, NextResponse } from "next/server";
import { getDecodedCookies } from "./lib/cookies";
import { authClient } from "./lib/auth-client";

const protectedRoutes = ["/rooms", "/profile", "/settings", "/add-chat"];

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/sign-up";
  let isAuthenticated = false;

  const cookieHeader = await getDecodedCookies();

  // Skip non-protected and non-auth routes
  if (
    !isAuthPage &&
    !protectedRoutes.includes(pathname) &&
    !pathname.startsWith("/rooms/")
  ) {
    return NextResponse.next();
  }

  try {
    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: {
          Cookie: cookieHeader,
        },
      },
    });

    if (session) {
      isAuthenticated = true;
    }
  } catch (error) {
    console.error(error);
  }

  // If logged in and trying to access auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/rooms", request.url));
  }

  // If not logged in and trying to access protected pages
  if (
    !isAuthenticated &&
    (protectedRoutes.includes(pathname) || pathname.startsWith("/rooms/"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
  ],
};
