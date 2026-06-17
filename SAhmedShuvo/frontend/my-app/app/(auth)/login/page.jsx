"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch(
        "https://personal-expense-tracker-r33t.onrender.com/api/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await res.json();

      // Error Response
      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // Store Auth Data
      localStorage.setItem("token", data.data.access.token);

      localStorage.setItem("user", JSON.stringify(data.data));

      // Success Toast
      toast.success("Login successful!");

      router.replace("/dashboard");
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
          {/* Top Accent */}
          <div className="mb-6 flex justify-center">
            <div className="h-1.5 w-16 rounded-full bg-indigo-500/80" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[28px] font-bold leading-tight tracking-tight text-slate-800">
              Sign In to Expense
              <span className="text-indigo-600">Tracker</span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-14 pr-5 text-[15px] text-slate-800 shadow-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="mt-1 h-14 w-full rounded-2xl bg-indigo-600 text-[15px] font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.99]"
            >
              Continue
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link
              href="/register"
              className="text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600"
            >
              New here? <span className="text-indigo-600">Create account</span>
            </Link>
            <p className="pt-6 text-[11px] text-slate-400 italic">
              you can access the application with: sabbirjunior@gmail.com pass:
              thankyou07
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
