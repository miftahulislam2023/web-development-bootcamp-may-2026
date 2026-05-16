import {
  NextResponse,
} from "next/server"

import type {
  NextRequest,
} from "next/server"

export function  proxy(
  request: NextRequest
) {

  const token =
    request.cookies.get(
      "token"
    )?.value

  const isDashboardRoute =
    request.nextUrl.pathname.startsWith(
      "/dashboard"
    )

  const isAuthRoute =
    request.nextUrl.pathname ===
      "/login" ||
    request.nextUrl.pathname ===
      "/signup"

  // protect dashboard
  if (
    isDashboardRoute &&
    !token
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    )
  }

  // prevent login/signup after auth
  if (
    isAuthRoute &&
    token
  ) {
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        request.url
      )
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
}