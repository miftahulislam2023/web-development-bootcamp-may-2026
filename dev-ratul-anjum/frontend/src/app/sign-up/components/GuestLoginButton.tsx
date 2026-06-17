"use client";

import { useTransition } from "react";
import guestSigninAction from "@/actions/guestSigninAction";
import { Loader2 } from "lucide-react";

const GuestLoginButton = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await guestSigninAction();
        });
      }}
      disabled={isPending}
      className={`w-full border border-slate-300 text-slate-700 font-medium py-2.5 rounded-lg mt-3 hover:bg-slate-100 flex items-center justify-center ${
        isPending ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          Entering as Guest...
        </>
      ) : (
        "Continue as Guest"
      )}
    </button>
  );
};

export default GuestLoginButton;
