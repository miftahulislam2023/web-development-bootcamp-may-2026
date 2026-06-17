"use client";

import { Loader2 } from "lucide-react";

type ButtonType = "login" | "guest";

type Props = {
  type: ButtonType;
  active: ButtonType | null;
  setActive: (value: ButtonType) => void;
  isPending: boolean;
};

const AuthSubmitButton = ({ type, active, setActive, isPending }: Props) => {
  const isActive = isPending && active === type;

  const isGuest = type === "guest";

  return (
    <button
      type="submit"
      name={isGuest ? "guest" : undefined}
      value={isGuest ? "true" : undefined}
      disabled={isPending}
      onClick={() => setActive(type)}
      className={`w-full font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-slate-900/10 mt-2 flex items-center justify-center ${
        isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      } ${
        isGuest
          ? "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
          : "bg-slate-900 hover:bg-black text-white"
      }`}
    >
      {isActive ? (
        <>
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          {isGuest ? "Entering as Guest..." : "Logging in..."}
        </>
      ) : (
        <>{isGuest ? "Continue as Guest" : "Login"}</>
      )}
    </button>
  );
};

export default AuthSubmitButton;
