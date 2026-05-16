import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/dashboard", "/expenses"];
  const authRoutes = ["/login", "/register"];
  const publicRoutes = ["/auth/confirm"];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/expenses/:path*", "/auth/:path*", "/login", "/register"],
};
