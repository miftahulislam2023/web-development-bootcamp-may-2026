import { MessageCircle, Send } from "lucide-react";

const AuthBranding = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-[#EBEBEB] relative flex-col items-center justify-center p-12 overflow-hidden">
      {/* Decorative faint grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Chat Interface Mockup Container */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Floating Elements */}
        <div className="absolute -top-12 -left-8 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm animate-bounce duration-3000">
          <MessageCircle size={20} className="text-slate-400" />
        </div>
        <div className="absolute top-1/2 -right-8 bg-slate-800 p-3 rounded-2xl rounded-br-none shadow-lg transform translate-x-4">
          <Send size={20} className="text-white" />
        </div>

        {/* Central Brand Box */}
        <div className="bg-white/40 backdrop-blur-sm border border-white/50 p-8 rounded-3xl shadow-sm text-center">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-6">
            <div className="w-8 h-8 rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-3">Dialog</h2>
          <p className="text-slate-500 leading-relaxed">
            Connect with your team instantly. Experience the future of seamless
            communication.
          </p>
        </div>

        {/* Decorative background circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 border border-slate-300/30 rounded-full -z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 border border-slate-300/40 rounded-full -z-10 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default AuthBranding;
