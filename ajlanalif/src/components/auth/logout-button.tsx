"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/sign-in" })}
      className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-slate-900/80 hover:text-white"
    >
      Logout
    </button>
  );
}
