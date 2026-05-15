import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import CommonPageHeader from "../../components/CommonPageHeader";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Login = () => {
  const { signInUser, loginGoogle, } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);



  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      await signInUser(email, password);
      toast.success("Welcome back! Ready for a movie marathon?");
      navigate(location.state || "/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    const email = role === 'admin' ? 'admin@demo.com' : 'user@demo.com';
    const password = 'Rakib32@#';

    try {
      await signInUser(email, password);
      toast.success(`Welcome back, Demo ${role === 'admin' ? 'Admin' : 'User'}!`);
      navigate(location.state || "/");
    } catch (error) {
      console.error(error);
      toast.error(`Demo ${role} login failed. Please ensure the user exists.`);
    }
  }

  const handleGoogleLogin = () => {

    loginGoogle()
      .then((result) => {
        console.log(result.user);
        const { displayName, email, photoURL } = result.user || {};

        axiosSecure
          .post("/users-create", {
            displayName,
            email,
            photoURL,
          })
          .then(() => {
            toast.success("Signed in with Google successfully!");
            navigate(location.state || "/");
          });
      })
      .catch(() => {
        toast.error("Google sign-in failed.");
      });


  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col relative overflow-x-hidden my-10">
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-500/10 rounded-full blur-[150px] -z-10" />

      <CommonPageHeader
        title="Sign In"
        subtitle="Access your account to manage your watchlist and collection."
      />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-2 w-full max-w-6xl bg-base-100/80 backdrop-blur-2xl border border-base-content/10 rounded-4xl shadow-xl overflow-hidden">
          
          <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-gray-900 via-gray-800 to-black text-white relative">
        
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tight mb-2 text-white">
                Movie Master Pro
              </h2>
              <p className="text-white/60 text-sm font-medium uppercase tracking-widest">
                Cinema at your fingertips
              </p>
            </div>

            <div className="relative z-10 space-y-4">
              <h1 className="text-4xl xl:text-5xl font-black leading-tight text-white">
                Welcome Back to <br />{" "}
                <span className="text-primary">The Theater.</span>
              </h1>
              <p className="text-base xl:text-lg text-white/80 max-w-md leading-relaxed">
                Pick up right where you left off. Your collection is waiting for
                you.
              </p>
            </div>

            <div className="relative z-10 text-xs text-white/40 font-medium">
              © 2025 MovieMaster Inc.
            </div>
          </div>

          
          <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center w-full">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-black text-base-content mb-2">
                Account Login
              </h2>
              <p className="text-base-content/60 text-sm">
                Enter your credentials to access your account.
              </p>
            </div>

            
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleDemoLogin('user')}
                className="flex-1 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent font-bold hover:bg-accent/20 transition-all text-sm cursor-pointer"
              >
                Demo User
              </button>
              <button
                onClick={() => handleDemoLogin('admin')}
                className="flex-1 py-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold hover:bg-secondary/20 transition-all text-sm cursor-pointer"
              >
                Demo Admin
              </button>
            </div>

            
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border-2 border-base-content/10 hover:bg-base-200 hover:border-base-content/20 transition-all font-bold text-base-content mb-6 active:scale-95 cursor-pointer"
            >
              <FcGoogle size={22} />
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-2 items-center mb-6">
              <div className="grow border-t border-base-content/10"></div>
              <span className="shrink-0 mx-4 text-xs font-bold text-base-content/40 uppercase tracking-widest">
                Or with email
              </span>
              <div className="grow border-t border-base-content/10"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium text-base-content placeholder:text-base-content/30 text-sm"
                  />
                </div>
              </div>

            
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium text-base-content placeholder:text-base-content/30 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            
            <p className="text-center mt-8 text-base-content/60 text-sm font-medium">
              Don't have an account?{" "}
              <NavLink
                state={location.state}
                to="/register"
                className="text-primary font-bold hover:underline"
              >
                Create free account
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
