import { User } from "$/prisma/generated/client.ts";

declare global {
  namespace Express {
    interface Request {
      user?: User.Pick<"id" | "name" | "email">;
    }
  }
}
