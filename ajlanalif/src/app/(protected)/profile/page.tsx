import Image from "next/image";
import { getServerSession } from "next-auth";

import { LogoutButton } from "@/components/auth/logout-button";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold">Profile Setup</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Avatar and bio structure are ready. Feature implementation can be added next.
        </p>
        <div className="mt-3">
          <LogoutButton />
        </div>
      </header>

      <section className="flex items-start gap-4 rounded-xl border border-zinc-200 p-5">
        <Image
          src={session?.user?.image ?? "https://api.dicebear.com/9.x/initials/svg?seed=User"}
          alt="Profile avatar"
          width={72}
          height={72}
          className="rounded-full border border-zinc-200"
        />
        <div className="space-y-1">
          <h2 className="text-lg font-medium">{session?.user?.name ?? "Unnamed user"}</h2>
          <p className="text-sm text-zinc-600">{session?.user?.email ?? "No email"}</p>
          <p className="text-sm text-zinc-700">{session?.user?.bio ?? "No bio yet."}</p>
        </div>
      </section>
    </main>
  );
}
