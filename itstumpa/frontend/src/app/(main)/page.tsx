// import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-base overflow-x-hidden">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* mesh gradient background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-108 h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl " />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#06B6D4]/20 rounded-full blur-3xl  " />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#334155] bg-[#1E2530]/50 text-sm text-[#94A3B8] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            Real-time messaging platform
          </div>

{/* headline */}
<h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
  Connect Instantly,{" "}
  <span className="bg-gradient-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
    Chat Seamlessly
  </span>
</h1>

<p className="text-[#94A3B8] hidden md:flex text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
  Experience lightning-fast real-time conversations with file sharing,
  read receipts, and typing indicators — all in one beautiful platform.
</p>

{/* CTAs */}
<div className="flex flex-col xs:flex-row items-center justify-center gap-4 md:pt-14 pt-6">
  <Link
    href="/signup"
    className="w-full xs:w-auto px-4 py-2 md:px-8 md:py-4 rounded-xl font-semibold text-white bg-[#8B5CF6] hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/20 text-lg"
  >
    Start for Free →
  </Link>
  <Link
    href="/login"
    className="w-full xs:w-auto px-4 py-2 md:px-8 md:py-4 rounded-xl font-semibold text-[#F1F5F9] border-2 border-[#334155] bg-[#1E2530] hover:bg-[#2D3748] hover:border-[#06B6D4]/50 transition-all text-lg"
  >
    Sign In
  </Link>
</div>
        </div>
      </section>
    </main>
  );
}