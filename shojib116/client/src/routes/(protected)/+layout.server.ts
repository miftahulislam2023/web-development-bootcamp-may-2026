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
  console.log("here");

  const chatListRes = await fetch(`${baseUrl}/chatlist`);
  const chatList = await chatListRes.json();

  return { user, users, chatList };
};
