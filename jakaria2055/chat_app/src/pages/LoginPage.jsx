import { useContext, useState } from "react";
import { AuthContext } from "../../store/AuthStore";
import { CircleArrowLeft, Mail, Lock, User, Sparkles, CheckCircle } from "lucide-react";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (currState === "Sign up" && !agreeToTerms) {
      // Show error or shake animation
      const termsCheckbox = document.getElementById("terms-checkbox");
      termsCheckbox?.classList.add("shake");
      setTimeout(() => termsCheckbox?.classList.remove("shake"), 500);
      return;
    }

    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    setIsLoading(true);
    
    // Simulate async login/signup
    setTimeout(async () => {
      await login(currState === "Sign up" ? "signup" : "login", {
        fullName,
        email,
        password,
        bio,
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center gap-12 sm:justify-evenly max-sm:flex-col px-4 py-8 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* LEFT SECTION - Enhanced Branding */}
      <div className="flex flex-col items-center justify-center z-10 animate-fadeInUp">
        <div className="relative group">
          <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <img 
            src={"/icon/messenger-logo.svg"} 
            alt="ChatApp Logo" 
            className="relative w-36 h-36 rounded-full bg-white/10 object-cover backdrop-blur-sm p-3 shadow-2xl transition-transform duration-300 group-hover:scale-110" 
          />
        </div>
        <h2 className="mt-6 text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
          ChatApp
        </h2>
        <p className="mt-3 text-gray-300 text-center max-w-xs">
          Connect with friends and family in real-time
        </p>
      </div>

      {/* RIGHT SECTION - Enhanced Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 flex flex-col gap-5 rounded-2xl shadow-2xl z-10 animate-fadeInUp animation-delay-200"
      >
        <div className="flex justify-between items-center border-b border-white/20 pb-4">
          <h2 className="font-bold text-3xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {currState === "Sign up" ? "Create Account" : "Welcome Back"}
          </h2>
          {isDataSubmitted && (
            <button
              type="button"
              onClick={() => setIsDataSubmitted(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:rotate-180"
            >
              <CircleArrowLeft className="w-5 text-gray-300 hover:text-white" />
            </button>
          )}
        </div>

        {/* Full Name - Enhanced with Icon */}
        {currState === "Sign up" && !isDataSubmitted && (
          <div className="relative group">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="w-full p-3 pl-10 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-300"
              placeholder="Full Name"
              required
            />
          </div>
        )}

        {/* Email - Enhanced */}
        {!isDataSubmitted && (
          <>
            <div className="relative group">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${emailFocused ? 'text-purple-400' : 'text-gray-400'}`} />
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                type="email"
                placeholder="Email Address"
                required
                className="w-full p-3 pl-10 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>

            {/* Password - Enhanced */}
            <div className="relative group">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${passwordFocused ? 'text-purple-400' : 'text-gray-400'}`} />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                type="password"
                placeholder="Password"
                required
                className="w-full p-3 pl-10 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 transition-all duration-300"
              />
            </div>
          </>
        )}

        {/* Bio Textarea - Enhanced */}
        {currState === "Sign up" && isDataSubmitted && (
          <div className="animate-slideDown">
            <label className="block text-sm text-gray-300 mb-2 font-medium">
              Tell us about yourself
            </label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder-gray-400 resize-none transition-all duration-300"
              placeholder="Share a little bio... 🌟"
            />
            <p className="text-xs text-gray-400 mt-1">
              {bio.length}/200 characters
            </p>
          </div>
        )}

        {/* Submit Button - Enhanced */}
        <button
          type="submit"
          disabled={isLoading}
          className="relative group py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {currState === "Sign up" 
                    ? (isDataSubmitted ? "Complete Sign Up" : "Continue to Bio") 
                    : "Login Now"}
                </span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Terms Checkbox - Enhanced */}
        <div className="flex items-start gap-3 text-sm" id="terms-checkbox">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-2 cursor-pointer"
          />
          <label htmlFor="terms" className="text-gray-300 cursor-pointer">
            I agree to the{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300 underline-offset-2 hover:underline transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300 underline-offset-2 hover:underline transition-colors">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Switch Auth Mode */}
        <div className="pt-2 text-center">
          {currState === "Sign up" ? (
            <p className="text-gray-300">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setCurrState("login");
                  setIsDataSubmitted(false);
                  setBio("");
                }}
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline-offset-2 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-gray-300">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setCurrState("Sign up");
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setAgreeToTerms(false);
                }}
                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors underline-offset-2 hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Demo Hint - Optional */}
        <div className="mt-2 text-center text-xs text-gray-400">
          <p> Demo: Use any email & password to explore</p>
        </div>
      </form>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;