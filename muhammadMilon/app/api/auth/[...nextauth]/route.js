import { handlers } from "@/lib/auth";

/** Prisma and bcrypt must run on Node, not Edge. */
export const runtime = "nodejs";

/** Avoid static caching of OAuth/session responses. */
export const dynamic = "force-dynamic";

export const { GET, POST } = handlers;
