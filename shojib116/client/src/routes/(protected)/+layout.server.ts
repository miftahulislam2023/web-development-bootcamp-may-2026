import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

let baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

export const load: LayoutServerLoad = async ({ fetch }) => {
  const res = await fetch(baseUrl + "/me");
  if (!res.ok) {
    throw redirect(303, "/signin");
  }
  const user = await res.json();

  const usersRes = await fetch(`${baseUrl}/users`);
  const users = await usersRes.json();

  console.log(users);

  return { user, users };
};
