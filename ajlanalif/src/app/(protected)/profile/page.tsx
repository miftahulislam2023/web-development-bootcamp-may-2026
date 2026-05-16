import Image from "next/image";
import { getServerSession } from "next-auth";

import { LogoutButton } from "@/components/auth/logout-button";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const avatarSeed = session?.user?.username ?? session?.user?.name ?? session?.user?.email ?? "User";
  const avatarUrl = session?.user?.image ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`;
  const joinedDate = null;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Image
              src={avatarUrl}
              alt="Profile avatar"
              width={88}
              height={88}
              className="rounded-3xl border border-cyan-400/15 bg-slate-900 object-cover shadow-lg"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Profile</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
                {session?.user?.name ?? session?.user?.username ?? "Unnamed user"}
              </h1>
              <p className="mt-2 text-sm text-slate-300">{session?.user?.bio ?? "No bio yet."}</p>
            </div>
          </div>

          <LogoutButton />
        </div>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Username</dt>
            <dd className="mt-2 text-sm font-medium text-slate-100">{session?.user?.username ?? "Not set"}</dd>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Email</dt>
            <dd className="mt-2 text-sm font-medium text-slate-100">{session?.user?.email ?? "No email"}</dd>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Bio</dt>
            <dd className="mt-2 text-sm font-medium text-slate-100">{session?.user?.bio ?? "No bio added yet."}</dd>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
            <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Joined</dt>
            <dd className="mt-2 text-sm font-medium text-slate-100">
              {joinedDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(joinedDate) : "Not available in session"}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
