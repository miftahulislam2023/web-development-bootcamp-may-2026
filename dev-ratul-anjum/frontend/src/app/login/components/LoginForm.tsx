"use client";

import Form from "next/form";
import { useState, useActionState } from "react";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { FormState } from "@/actions/signinAtion";
import signinAction from "@/actions/signinAtion";
import AuthSubmitButton from "./AuthSubmitButton";

const initialState: FormState = {
  values: {
    email: "",
    password: "",
  },
  errors: {},
};

const LoginForm = () => {
  const [state, formAction, isPending] = useActionState(
    signinAction,
    initialState,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [activeSubmitButton, setActiveSubmitButton] = useState<
    "login" | "guest" | null
  >(null);

  return (
    <Form className="space-y-4" action={formAction}>
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
          Email
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-slate-400" />
          </div>
          <input
            type="email"
            name="email"
            placeholder="m@example.com"
            className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300 ${
              state?.errors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-slate-800 focus:border-transparent"
            }`}
            defaultValue={state.values.email}
          />
        </div>
        {state?.errors.email && (
          <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
          Password
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock size={18} className="text-slate-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="********"
            className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300 ${
              state?.errors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-slate-800 focus:border-transparent"
            }`}
            defaultValue={state.values.password}
          />

          {/* toggle button */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 cursor-pointer"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {state?.errors.password && (
          <p className="text-red-500 text-xs mt-1 ml-1">
            {state.errors.password}
          </p>
        )}
      </div>

      {state?.errors.general && (
        <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.general}</p>
      )}

      <AuthSubmitButton
        type="login"
        active={activeSubmitButton}
        setActive={setActiveSubmitButton}
        isPending={isPending}
      />

      <AuthSubmitButton
        type="guest"
        active={activeSubmitButton}
        setActive={setActiveSubmitButton}
        isPending={isPending}
      />
    </Form>
  );
};

export default LoginForm;
