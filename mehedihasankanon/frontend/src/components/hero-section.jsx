'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export function HeroSection() {
  const router = useRouter();

  const handleSignIn = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 text-center bg-black text-white">
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        
        <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl text-balance">
          Store and share files easily.
        </h1>

        <p className="mt-8 text-lg font-medium text-zinc-500 sm:text-3xl tracking-tight">
          Simple. Fast. Secure.
        </p>

        <div className="mt-12">
          <button
            onClick={handleSignIn}
            className="group relative inline-flex items-center gap-4 rounded-full border 
            border-zinc-800 bg-black px-10 py-4 text-lg font-semibold text-white transition-all
            hover:border-white hover:bg-white hover:text-black hover:cursor-pointer hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Sign in
            <ArrowRight className="h-6 w-6 transition-transform duration-300 ease-in-out group-hover:translate-x-2" />

            <div className="absolute inset-0 -z-10 rounded-full bg-white/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </section>
  )
}