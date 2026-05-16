import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { apiFetch } from "$lib/server/api";

export const load: LayoutServerLoad = async ({ cookies, request }) => {
  const ctx = { cookies, request };

  const meRes = await apiFetch("/me", {}, ctx);
  if (!meRes.ok) throw redirect(303, "/signin");
  const user = await meRes.json();

  const [usersRes, chatListRes] = await Promise.all([
    apiFetch("/users", {}, ctx),
    apiFetch("/chatlist", {}, ctx),
  ]);

  return {
    user,
    users: await usersRes.json(),
    chatList: await chatListRes.json(),
  };
};
