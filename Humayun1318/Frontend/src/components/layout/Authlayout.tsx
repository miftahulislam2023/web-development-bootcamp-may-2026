import { Link } from "react-router";

interface AuthLayoutProps {
  children: React.ReactNode;
  illustration: React.ReactNode;
  illustrationSide?: "left" | "right";
}

export default function AuthLayout({
  children,
  illustration,
  illustrationSide = "right",
}: AuthLayoutProps) {
  // For form panel UI part______________________
  const formPanel = (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-12 xl:px-16 bg-slate-950">
      {/* Logo mark — always visible on the form side */}
      <Link
        to="/"
        className="mb-8 flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold">
          $
        </span>
        <span className="text-sm font-semibold tracking-wide text-slate-300">
          ExpenseTracker
        </span>
      </Link>

      {/* Form slot */}
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );

  // for svg Illustration part
  const illustrationPanel = (
    <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 relative overflow-hidden px-10">
      {/* Radial glow behind illustration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">{illustration}</div>

      {/* Bottom tagline */}
      <p className="absolute bottom-8 left-0 right-0 text-center text-xs text-slate-600">
        Your finances, visualised.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {illustrationSide === "left" ? (
        <>
          {illustrationPanel}
          {formPanel}
        </>
      ) : (
        <>
          {formPanel}
          {illustrationPanel}
        </>
      )}
    </div>
  );
}
