import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Account blocked",
};

export default async function BlockedPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (!session.user.blocked) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-2xl font-bold">Account access paused</h1>
      <p className="text-sm text-[var(--muted-foreground)]">
        Your account has been restricted. Contact support if you believe this is a mistake.
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button type="submit" variant="secondary">
          Sign out
        </Button>
      </form>
    </div>
  );
}
