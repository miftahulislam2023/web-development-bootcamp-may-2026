import { Button } from "@/components/ui/Button";

export function CtaBannerSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#020617] border border-white/10 px-8 py-20 text-center shadow-[0_0_50px_-12px_rgba(79,70,229,0.2)] sm:px-16 transition-all duration-500 hover:border-indigo-500/30">
          {/* Advanced Decorative Elements */}
          <div className="pointer-events-none absolute inset-0">
            {/* Mesh Gradients */}
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px] transition-opacity group-hover:opacity-80" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px] transition-opacity group-hover:opacity-80" />
            
            {/* Animated Light Beam */}
            <div className="absolute left-1/2 top-0 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            
            {/* Modern Grid Overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] invert dark:invert-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l0 60M0 30l60 0' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Dynamic Floating Badges (Visible on Desktop) */}
          <div className="pointer-events-none absolute left-12 top-12 hidden md:block">
            <div className="animate-float flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              Lightning fast engine
            </div>
          </div>
          
          <div className="pointer-events-none absolute right-12 bottom-12 hidden md:block">
            <div className="animate-float-slow flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
              <span className="flex h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              Unlimited creativity
            </div>
          </div>

          {/* Main Content Area */}
          <div className="relative z-10">
            {/* Status Badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-indigo-200 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
              </span>
              Start building today — it&apos;s free
            </div>

            {/* Typography */}
            <h2 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Build your dream website{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                right now.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Join over 12,000 builders who use Nexora Studio to create stunning, responsive websites
              in minutes — no code required, no limits on creativity.
            </p>

            {/* Action Buttons */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
              <Button
                href="/register"
                size="lg"
                className="group/btn relative h-14 overflow-hidden rounded-2xl bg-indigo-600 px-8 font-bold text-white transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Building for Free
                  <svg className="h-5 w-5 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
              
              <Button
                href="/login"
                size="lg"
                variant="outline"
                className="h-14 rounded-2xl border-white/10 bg-white/5 px-8 font-semibold text-white backdrop-blur-md hover:bg-white/10 hover:border-white/20"
              >
                Sign in to Dashboard
              </Button>
            </div>

            {/* Feature Checkmarks */}
            <div className="mt-12 grid grid-cols-2 gap-y-4 gap-x-8 text-center sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10">
              {[
                "No credit card required",
                "Free plan forever",
                "Deploy in one click",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 text-sm font-medium text-slate-400">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
