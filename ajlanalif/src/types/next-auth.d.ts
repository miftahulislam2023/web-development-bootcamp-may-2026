import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string | null;
      bio: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    username: string | null;
    bio: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string | null;
    bio?: string | null;
  }
}
