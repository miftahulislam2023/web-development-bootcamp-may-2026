import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import CommonPageHeader from "../../components/CommonPageHeader";
import useAxiosSecure from "../../hooks/useAxiosSecure";
 import { LazyLoadImage } from "react-lazy-load-image-component";

const Register = () => {
  const { createUser, updateUser, loginGoogle, signInUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
 

  // console.log(location.state)

  const handleGoogleLogin = () => {
    loginGoogle()
      .then((result) => {
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
      .catch((error) => {
        console.error(error);
        toast.error("Google sign-in failed.");
      });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    const displayName = e.target.name.value;
    const email = e.target.email.value;
    const photoURL = e.target.photoURL.value;
    const password = e.target.password.value;

    // Password Validation
    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
      setPasswordError(
        "Password must have 1 uppercase, 1 lowercase & 6+ chars."
      );
      setIsLoading(false);
      return;
    }

    try {
      // await createUser(email, password);
      // await updateUser(name, photoURL);

      // console.log(name, email, photoURL, password);
      axiosSecure
        .post("/users-create", {
          displayName,
          email,
          photoURL,
        })
        .then(async () => {
          await createUser(email, password);
          await updateUser(displayName, photoURL);
          toast.success(`Welcome aboard, ${displayName}! Account created.`);
          navigate(location.state || "/");
        });

      // toast.success(`Welcome aboard, ${name}! Account created.`);
      // navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col relative overflow-x-hidden my-10">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-150 h-150 bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-purple-500/10 rounded-full blur-[150px] -z-10" />

      {/* --- Header --- */}
      <CommonPageHeader
        title="Join the Club"
        subtitle="Create your account to start your cinematic journey today."
      />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-2 w-full max-w-6xl bg-base-100/80 backdrop-blur-2xl border border-base-content/10 rounded-4xl shadow-xl overflow-hidden">
          {/* --- LEFT: Registration Form --- */}
          <div className="p-6 sm:p-10 md:p-14 flex flex-col justify-center w-full order-2 lg:order-1">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-black text-base-content mb-2">
                Create Account
              </h2>
              <p className="text-base-content/60 text-sm">
                Fill in your details to get started.
              </p>
            </div>

            {/* Demo Buttons */}
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

            {/* Google Button */}
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

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium text-base-content placeholder:text-base-content/30 text-sm"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider ml-1">
                  Email Address
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

              {/* Photo URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider ml-1">
                  Profile Picture URL
                </label>
                <div className="relative group">
                  <ImageIcon
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <input
                    name="photoURL"
                    type="url"
                    placeholder="https://..."
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-base-200/50 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium text-base-content placeholder:text-base-content/30 text-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider ml-1">
                  Password
                </label>
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
                    className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-base-200/50 border-2 outline-none transition-all font-medium text-base-content placeholder:text-base-content/30 text-sm ${passwordError
                        ? "border-red-500 focus:border-red-500"
                        : "border-transparent focus:border-primary/50 focus:bg-base-100"
                      }`}
                  />
                </div>
                {/* Error Message or Helper Text */}
                {passwordError ? (
                  <p className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500" />{" "}
                    {passwordError}
                  </p>
                ) : (
                  <p className="text-[10px] text-base-content/40 ml-1">
                    Must be at least 6 characters with uppercase & lowercase
                    letters.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 cursor-pointer"
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center mt-8 text-base-content/60 text-sm font-medium">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* --- RIGHT: Feature Showcase (Visible on LG screens) --- */}
          <div className="hidden lg:flex flex-col justify-center p-12 bg-linear-to-bl from-gray-900 via-gray-800 to-black text-white relative order-1 lg:order-2">
            {/* Overlay Image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=1456&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-transparent to-black/80"></div>

            <div className="relative z-10 space-y-8 pl-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-white">
                  Why Join Us?
                </h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
              </div>

              <div className="space-y-6">
                <FeatureItem
                  title="Curate Your Collection"
                  desc="Build a personalized library of your favorite films and shows."
                />
                <FeatureItem
                  title="Discover Hidden Gems"
                  desc="Get recommendations based on your unique taste."
                />
                <FeatureItem
                  title="Seamless Experience"
                  desc="Enjoy ad-free browsing with our premium interface."
                />
              </div>
            </div>

            <div className="relative z-10 mt-12 pl-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <LazyLoadImage  
                    className="w-10 h-10 rounded-full border-2 border-black"
                    src="https://i.pravatar.cc/100?img=1"
                    alt="User"
                    effect="blur"
                  />
                  <LazyLoadImage
                    className="w-10 h-10 rounded-full border-2 border-black"
                    src="https://i.pravatar.cc/100?img=2"
                    alt="User"
                    effect="blur"
                  />
                  <LazyLoadImage
                    className="w-10 h-10 rounded-full border-2 border-black"
                    src="https://i.pravatar.cc/100?img=3"
                    alt="User"
                    effect="blur"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                    +2k
                  </div>
                </div>
                <p className="text-sm font-medium text-white/80">
                  Join 2,000+ movie lovers today!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for features
const FeatureItem = ({ title, desc }) => (
  <div className="flex gap-4">
    <div className="mt-1 shrink-0">
      <CheckCircle className="text-primary" size={20} />
    </div>
    <div>
      <h3 className="font-bold text-lg text-white">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Register;
