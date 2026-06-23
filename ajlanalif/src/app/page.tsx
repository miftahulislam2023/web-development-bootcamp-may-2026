import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
        <div className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8 lg:p-10">
          <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
            Realtime chat MVP
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Building a polished realtime collaboration experience.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Authentication, rooms, persistence, realtime messaging, edit/delete, reconnect recovery,
            and a clean SaaS-style interface are ready for demo use.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/chat"
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Open chat
            </Link>
            <Link
              href="/profile"
              className="rounded-full border border-cyan-400/20 bg-slate-900/70 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900"
            >
              View profile
            </Link>
          </div>
        </div>

        <aside className="rounded-[28px] border border-cyan-400/12 bg-slate-950/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-slate-50">Demo ready</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The current build emphasizes a premium dashboard feel with minimal visual noise and a
            responsive layout that reads well on desktop and mobile.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">Dark layered background</div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">Cyan accent system</div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">Fast feedback with toasts</div>
          </div>
        </aside>
      </section>
    </main>
  );
}
