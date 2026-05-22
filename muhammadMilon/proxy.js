import { auth as edgeAuth } from "@/lib/auth.edge";

/**
 * Next.js 16 `proxy.js` must export `export default function proxy` or `export function proxy`.
 * Auth.js middleware entry is `auth(request)` — not `auth((req) => …)` — so route logic lives in
 * `authorized` in `lib/auth-callbacks.js`.
 */
export default async function proxy(request, context) {
  return edgeAuth(request, context);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/blocked", "/login", "/register"],
};
