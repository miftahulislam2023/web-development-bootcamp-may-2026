import { auth } from "@/lib/auth";

// Redirects unauthenticated requests for protected routes to /login.
// The definitive auth check still happens inside (dashboard)/layout.tsx and
// the builder page — this proxy is the fast first line of defense.
export default auth((req) => {
  if (!req.auth) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/builder/:path*"],
};
