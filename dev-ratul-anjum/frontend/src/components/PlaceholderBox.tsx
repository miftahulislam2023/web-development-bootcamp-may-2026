import { MessageSquare } from "lucide-react";

const TechPill = ({ label }: { label: string }) => (
  <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-xs font-medium hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors duration-300 cursor-default select-none">
    {label}
  </span>
);

const PlaceholderBox = () => {
  return (
    <main className="flex-1 flex flex-col relative bg-white dark:bg-slate-950">
      {/* Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Subtle background pattern for depth */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto p-6 md:p-12 text-center relative ">
          {/* Main Content Wrapper */}
          <div className="flex flex-col items-center space-y-10 animate-in fade-in duration-700">
            {/* Large Iconic Visual */}
            <div className="relative group">
              <div className="absolute -inset-6 bg-linear-to-tr from-violet-500/20 to-fuchsia-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <div className="relative bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 ring-4 ring-slate-50 dark:ring-slate-800/50">
                <MessageSquare
                  className="w-12 h-12 text-violet-600 dark:text-violet-400"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-4 max-w-lg">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome to Dialog
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                Dialog is a modern chat application designed for simplicity,
                clarity, and an organized messaging experience.
              </p>
              <div className="h-px w-24 bg-linear-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent mx-auto mt-6"></div>
              <p className="text-sm text-slate-400 dark:text-slate-500 pt-2">
                Select a conversation from the sidebar to start chatting.
              </p>
            </div>

            {/* Tech Stack Grid */}
            <div className="pt-4">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-4">
                Powered By
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                <TechPill label="Next.js" />
                <TechPill label="Express" />
                <TechPill label="Node.js" />
                <TechPill label="PostgreSQL" />
                <TechPill label="Prisma" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlaceholderBox;
