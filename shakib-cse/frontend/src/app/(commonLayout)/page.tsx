import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{
        backgroundImage: "url('/icons/banner.jpg')",
      }}
    >
      {/* Dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
        <h1 className="text-5xl font-extrabold mb-4 text-white">
          FinanceApp
        </h1>

        <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
          A small finance tracker starter template. Log in to view your
          dashboard.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-lg bg-primary text-white hover:opacity-90 transition"
          >
            Get Started
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg border border-white text-white hover:bg-white/10 transition"
          >
            View Demo
          </Link>
        </div>
      </div>
    </div>
  );
}