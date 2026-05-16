import { MessageSquare, Shield, Zap } from "lucide-react";

export function AuthHero() {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-soft-accent w-1/2 min-h-screen relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <MessageSquare size={24} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold text-text-primary tracking-tight">
            DevConnect
          </span>
        </div>

        <h1 className="text-4xl font-extrabold text-text-primary leading-tight mb-4">
          Live Chatting Platform <br />
          <span className="text-primary">for Modern Teams.</span>
        </h1>
        <p className="text-lg text-text-secondary max-w-md">
          Simple real-time conversations for friends, teams, and groups. Connect,
          collaborate, and grow together.
        </p>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-sm max-w-sm ml-auto animate-in slide-in-from-right duration-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success-text">
              <Shield size={16} />
            </div>
            <span className="font-semibold text-text-primary">Secure & Private</span>
          </div>
          <p className="text-sm text-text-secondary">
            End-to-end encrypted messaging keeps your data safe and sound.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-md max-w-sm animate-in slide-in-from-left duration-700 delay-150">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">MI</div>
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary leading-none">Mohammad Irfan</p>
              <p className="text-xs text-text-muted">Active now</p>
            </div>
          </div>
          <div className="bg-muted-surface p-3 rounded-xl rounded-tl-none text-sm text-text-primary mb-2">
            Hey! Check out the new design. It looks amazing!
          </div>
          <div className="flex justify-end">
            <div className="bg-primary p-3 rounded-xl rounded-tr-none text-sm text-white">
              Agreed! It's  clean and minimal.
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-6 text-sm text-text-muted font-medium">
        <div className="flex items-center gap-2">

          <span>Real-time</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-border" />
        <span>Group Chats</span>
        <div className="w-1 h-1 rounded-full bg-border" />
        <span>Direct Messages</span>
      </div>
    </div>
  );
}
