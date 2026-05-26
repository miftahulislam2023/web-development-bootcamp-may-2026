import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-[#0F1419] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb orb-purple" />
      <div className="orb orb-cyan" />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-[#8B5CF6] via-[#06B6D4] to-[#10B981] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#06B6D4]/20">
          <span className="text-3xl">📧</span>
        </div>
        <h1 className="text-2xl font-bold text-[#F1F5F9] mb-3">Check your email</h1>
        <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
          We&apos;ve sent a verification link to your email address. Click the link to activate your account.
        </p>
        <div className="bg-[#1E2530] border border-[#334155] rounded-2xl p-6 shadow-2xl shadow-black/40">
          <p className="text-[#94A3B8] text-sm mb-4">Didn&apos;t receive the email?</p>
          <button className="w-full py-3 rounded-xl font-semibold text-[#06B6D4] border border-[#06B6D4]/30 hover:bg-[#06B6D4]/10 transition-colors text-sm">
            Resend verification email
          </button>
          <Link
            href="/login"
            className="block text-center text-sm text-[#94A3B8] hover:text-[#F1F5F9] mt-4 transition-colors"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}