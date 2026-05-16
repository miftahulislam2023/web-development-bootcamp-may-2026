import type { ServerLoad } from "@sveltejs/kit";

const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
export const load: ServerLoad = async ({ fetch, params }) => {
  let messages = [];
  const res = await fetch(
    `${baseUrl}/messages?conversation_id=${params.chat_id}`,
  );

  if (res.ok) messages = await res.json();
  return { messages, chat_id: params.chat_id };
};
