export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
      <header className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Phase 0</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Realtime Chat App Setup</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600">
          Initial architecture is prepared with App Router, Prisma, NextAuth credentials,
          Socket.IO structure, Zustand state, and toast provider.
        </p>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <a href="/sign-in" className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
          <h2 className="text-lg font-semibold">Sign In</h2>
          <p className="mt-1 text-sm text-zinc-600">Credentials auth page scaffold.</p>
        </a>

        <a href="/chat" className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
          <h2 className="text-lg font-semibold">Chat Shell</h2>
          <p className="mt-1 text-sm text-zinc-600">Room and message UI layout placeholder.</p>
        </a>

        <a href="/profile" className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-zinc-600">Avatar and bio structure placeholder.</p>
        </a>

        <a href="/api/health" className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300">
          <h2 className="text-lg font-semibold">Health API</h2>
          <p className="mt-1 text-sm text-zinc-600">Basic route handler readiness check.</p>
        </a>
      </section>
    </main>
  );
}
