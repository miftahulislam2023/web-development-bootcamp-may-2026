import FinanceHeroIllustration from "@/assets/icons/Financeheroillustration";
import { Link } from "react-router";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col items-center justify-center gap-10 px-4">
      {/* ── Subtle radial glow behind illustration ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* ── Animated illustration ── */}
      <div className="relative z-10 w-full max-w-sm">
        <FinanceHeroIllustration />
      </div>

      {/* ── Headline + sub ── */}
      <div className="relative z-10 text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Track Every Taka.
        </h1>
        <p className="text-slate-400 text-base max-w-xs mx-auto leading-relaxed">
          Your personal finance dashboard — income, expenses, and recurring
          payments all in one place.
        </p>
      </div>

      {/* ── CTA ── */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Link
          to="/login"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-8 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-400/30 hover:-translate-y-0.5 active:translate-y-0"
        >
          Get Started — Sign In
        </Link>
        <span className="text-slate-500 text-xs">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-400 underline-offset-2 hover:underline"
          >
            Register free
          </Link>
        </span>
      </div>
    </main>
  );
}
