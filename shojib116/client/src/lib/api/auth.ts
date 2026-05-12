const base_url = import.meta.env.VITE_SERVER_BASE_URL;

export async function signin(username: string) {
  return fetch(`${base_url}/signin`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
}

export async function signout(userId: string) {
  return fetch(`${base_url}/signout`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
}
