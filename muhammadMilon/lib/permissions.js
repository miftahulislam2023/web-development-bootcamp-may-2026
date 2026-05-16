/** @param {import("next-auth").Session | null} session */
export function isAdmin(session) {
  return session?.user?.role === "admin";
}

/** @param {import("next-auth").Session | null} session */
export function isBlocked(session) {
  return Boolean(session?.user?.blocked);
}
