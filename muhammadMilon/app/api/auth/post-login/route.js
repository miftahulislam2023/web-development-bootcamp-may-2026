import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function GET(request) {
  const session = await auth();
  const url = new URL(request.url);
  const fallback = url.searchParams.get("callbackUrl") || "/dashboard";

  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.blocked) {
    redirect("/blocked");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }
  redirect(fallback.startsWith("/admin") ? "/dashboard" : fallback);
}
