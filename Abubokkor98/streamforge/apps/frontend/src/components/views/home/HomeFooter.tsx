import { GithubLogo, Globe, LinkedinLogo } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"

const CURRENT_YEAR = new Date().getFullYear()

async function HomeFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/50 px-6 py-12 backdrop-blur-sm md:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">
          {/* Brand & Description */}
          <div className="max-w-lg space-y-5">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="StreamForge Logo" 
                width={32} 
                height={32} 
                className="rounded-lg shadow-xl shadow-primary/20"
              />
              <span className="text-2xl font-black tracking-tighter text-primary uppercase">StreamForge</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
              &ldquo;The ultimate forge for digital creators. Build your audience, 
              stream with precision, and monetize your passion through 
              our high-performance broadcast infrastructure.&rdquo;
            </p>
          </div>

          {/* Social/GitHub Links */}
          <div className="flex flex-col gap-4 md:items-end">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Open Source</p>
            <a
              href="https://github.com/Abubokkor98/streamforge"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/40 transition-all hover:bg-secondary hover:border-primary/20"
              aria-label="GitHub repository"
            >
              <GithubLogo size={24} weight="duotone" className="group-hover:text-primary transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-bold">GitHub</span>
                <span className="text-[10px] text-muted-foreground">Star on GitHub</span>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/20 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">
              &copy; {CURRENT_YEAR} <span className="font-semibold text-foreground">Abu Bokkor Siddik</span>. All rights reserved.
            </p>
            <p className="text-[10px] text-muted-foreground">
              Built with precision for the next generation of streamers.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-border/40">
              <span className="text-xs text-muted-foreground">Developed by</span>
              <a 
                href="https://abubokkor.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-foreground transition-colors hover:text-primary underline decoration-primary/30 underline-offset-4"
              >
                Abu Bokkor Siddik
              </a>
            </div>
            <div className="flex items-center gap-3">
               <a href="https://abubokkor.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary" aria-label="Portfolio website">
                 <Globe size={18} weight="bold" />
               </a>
               <a href="https://linkedin.com/in/abubokkor" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary" aria-label="LinkedIn profile">
                 <LinkedinLogo size={18} weight="bold" />
               </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { HomeFooter }
