import { goto } from "$app/navigation";
import { authStore } from "$lib/store/auth";

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;

export async function signin(
  username: string,
  password: string,
): Promise<Response> {
  return fetch(`${baseUrl}/auth/signin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function signout(): Promise<void> {
  try {
    await fetch(`${baseUrl}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    authStore.clear();
    await goto("/signin", { invalidateAll: true });
  }
}

export async function addFriend(userId: string) {
  return fetch(`${baseUrl}/add-friend`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}
