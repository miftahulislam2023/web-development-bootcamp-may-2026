"use client";

import Form from "next/form";
import { useState, useActionState, useRef } from "react";
import {
  Camera,
  Mail,
  Lock,
  User,
  Loader2,
  X,
  EyeOff,
  Eye,
} from "lucide-react";
import signupAction, { FormState } from "@/actions/signupAction";
import GuestLoginButton from "./GuestLoginButton";

const initialState: FormState = {
  values: {
    name: "",
    email: "",
    password: "",
  },
  errors: {},
};

const SignupForm = () => {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: FormData) => {
    if (photo) {
      formData.set("photo", photo);
    }

    return formAction(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 0.1 * 1024 * 1024; // 100kb
    const allowed_types = ["image/png", "image/jpeg", "image/jpg"];
    const selectedFile = e.target.files?.[0];

    setPhoto(selectedFile ?? null);

    if (selectedFile) {
      if (!allowed_types.includes(selectedFile.type)) {
        setFileError("Only JPG, JPEG, and PNG image files are allowed.");
        return;
      }

      if (selectedFile.size > MAX_FILE_SIZE) {
        setFileError("Image must be under 100 KB");
        return;
      }
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setFileError(null);
    if (photoRef.current) {
      photoRef.current.value = "";
    }
  };

  return (
    <Form className="space-y-4" action={handleFormSubmit}>
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
          Name
          <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            defaultValue={state.values.name}
            className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-slate-300 ${
              state?.errors?.name
                ? "border-red-500 focus:ring-red-200"
                : "border-slate-200 focus:ring-slate-800 focus:border-transparent"
            }`}
          />
        </div>
        {state?.errors?.name && (
          <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.name}</p>
        )}
      </div>

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

      {/* Photo Upload Field */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
          Profile Photo
        </label>

        <input
          id="photo-input"
          type="file"
          className="hidden"
          accept="image/*"
          name="photo"
          ref={photoRef}
          onChange={(e) => handleFileChange(e)}
        />

        {!photo ? (
          <label
            htmlFor="photo-input"
            className="flex items-center justify-center w-full px-4 py-3 border border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center space-x-2">
              <Camera
                size={18}
                className="text-slate-400 group-hover:text-slate-600"
              />
              <span className="text-sm text-slate-500 group-hover:text-slate-700">
                Upload a photo
              </span>
            </div>
          </label>
        ) : (
          <div
            className={`flex items-center justify-between w-full px-4 py-3 border rounded-lg transition-colors ${
              fileError
                ? "border-red-500 bg-red-50"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0 text-slate-500">
                <Camera size={16} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-700 truncate">
                  {photo.name}
                </span>
                <span className="text-xs text-slate-400">
                  {(photo.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={removePhoto}
              className="p-2 hover:bg-white hover:shadow-sm rounded-full text-slate-400 hover:text-red-500 transition-all cursor-pointer"
              title="Remove photo"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {fileError && (
        <p className="text-red-500 text-xs mt-1 ml-1">{fileError}</p>
      )}

      {state?.errors.general && (
        <p className="text-red-500 text-xs mt-1 ml-1">{state.errors.general}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending || !!fileError}
        className={`w-full bg-slate-900 hover:bg-black text-white font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-slate-900/10 mt-2 flex items-center justify-center ${
          isPending || !!fileError
            ? "opacity-70 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
            Processing...
          </>
        ) : (
          "Create Account"
        )}
      </button>
      <GuestLoginButton />
    </Form>
  );
};

export default SignupForm;
