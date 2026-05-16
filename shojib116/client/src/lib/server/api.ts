import type { Cookies } from "@sveltejs/kit";
import * as setCookieParser from "set-cookie-parser";

const API_BASE = import.meta.env.VITE_SERVER_BASE_URL;

type Ctx = {
  cookies: Cookies;
  request: Request;
};

function mergeNewCookies(
  original: string,
  newCookies: setCookieParser.Cookie[],
): string {
  const map = new Map<string, string>();
  original.split(";").forEach((pair) => {
    const [name, ...rest] = pair.trim().split("=");
    if (name) map.set(name.trim(), rest.join("="));
  });
  newCookies.forEach((c) => map.set(c.name, c.value));
  return Array.from(map.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

export async function apiFetch(
  path: string,
  init: RequestInit,
  ctx: Ctx,
): Promise<Response> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const incomingCookies = ctx.request.headers.get("cookie") ?? "";

  const res = await globalThis.fetch(url, {
    ...init,
    headers: { ...(init.headers ?? {}), cookie: incomingCookies },
  });

  if (res.status !== 401 || url.endsWith("/auth/refresh")) return res;

  const refreshRes = await globalThis.fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { cookie: incomingCookies },
  });

  if (!refreshRes.ok) return res;

  const parsed = setCookieParser.parse(refreshRes.headers.getSetCookie(), {
    decodeValues: false,
  });

  for (const c of parsed) {
    ctx.cookies.set(c.name, c.value, {
      path: c.path ?? "/",
      httpOnly: c.httpOnly ?? true,
      secure: c.secure ?? true,
      sameSite:
        (c.sameSite?.toLowerCase() as "strict" | "lax" | "none") ?? "strict",
      expires: c.expires,
      maxAge: c.maxAge,
    });
  }

  const mergedCookies = mergeNewCookies(incomingCookies, parsed);

  return globalThis.fetch(url, {
    ...init,
    headers: { ...(init.headers ?? {}), cookie: mergedCookies },
  });
}
