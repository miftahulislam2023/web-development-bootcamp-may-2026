import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const REFRESH_TOKEN_COOKIE = "refreshToken"
const LOGIN_PATH = "/login"
const DASHBOARD_PATH = "/dashboard"

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-otp"]

/**
 * Optimistic auth guard — checks for the existence of the refresh token cookie.
 *
 * This is NOT the security boundary. The actual token validation happens
 * in the API client (backend verifies JWT + refresh token on every request).
 * This proxy only prevents unauthenticated users from seeing protected
 * page shells before the client-side redirect kicks in, and prevents
 * authenticated users from accessing auth pages.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_TOKEN_COOKIE)
  const pathname = request.nextUrl.pathname

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (hasSession && isAuthRoute) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url))
  }

  if (!hasSession && !isAuthRoute) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`,
    )
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/host/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ],
}
