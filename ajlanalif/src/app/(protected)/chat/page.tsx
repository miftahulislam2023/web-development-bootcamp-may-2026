import { getServerSession } from "next-auth";

import { LogoutButton } from "@/components/auth/logout-button";
import { authOptions } from "@/lib/auth";

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
      <section className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:grid-cols-[280px_1fr]">
        <aside className="border-b border-zinc-200 p-4 md:border-b-0 md:border-r">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Rooms</h2>
          <p className="mt-2 text-sm text-zinc-600">Room list structure placeholder</p>
        </aside>

        <div className="flex flex-col">
          <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
            <h1 className="text-base font-semibold">General Room</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500">Signed in as {session?.user?.email}</span>
              <LogoutButton />
            </div>
          </header>

          <div className="flex-1 p-4 text-sm text-zinc-600">Real-time message feed scaffold</div>

          <footer className="border-t border-zinc-200 p-4">
            <div className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-500">
              Message composer scaffold
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
