"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      toast.error("Please fix the form errors");

      return;
    }

    try {
      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed");

        return;
      }

      toast.success("Account created successfully!");

      // Redirect after short delay
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-60px)] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-white via-slate-50 to-indigo-50 px-6 py-10">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-emerald-200/20 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[460px]">
        <div className="rounded-[24px] border border-white/70 bg-white/80 px-8 py-9 shadow-[0_25px_70px_rgba(15,23,42,0.08)] ring-1 ring-slate-100/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 lg:px-10 lg:py-10">
          {/* Accent */}
          <div className="mb-6 flex justify-center">
            <div className="h-1.5 w-16 rounded-full bg-indigo-500/80" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-800">
              Sign Up in Expense
              <span className="text-indigo-600">Tracker</span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <div className="relative">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="User Name"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-14 text-[15px] shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-14 text-[15px] shadow-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="h-14 w-full rounded-2xl bg-indigo-600 text-[15px] font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.99]"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-sm text-slate-500 hover:text-indigo-600"
            >
              Already have an account?{" "}
              <span className="text-indigo-600">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
