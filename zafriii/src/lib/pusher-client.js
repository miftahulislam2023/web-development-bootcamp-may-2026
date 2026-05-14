import PusherClient from "pusher-js";

let pusherInstance = null;

export const getPusherClient = () => {
  if (typeof window === "undefined") return null;
  if (pusherInstance) return pusherInstance;

  pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  });

  return pusherInstance;
};
