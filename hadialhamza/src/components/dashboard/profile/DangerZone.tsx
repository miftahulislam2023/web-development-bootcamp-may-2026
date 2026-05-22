"use client";

import { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { customToast } from "@/components/ui/customToast";
import { signOut } from "next-auth/react";

export default function DangerZone() {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const executeDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete account");

      customToast.success("Success", "Account deleted successfully");
      await signOut({ callbackUrl: "/" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        customToast.error("Error", error.message);
      } else {
        customToast.error("Error", "An unknown error occurred");
      }
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (confirmText !== "DELETE") return;
    
    customToast.confirm(
      "Delete Account",
      "Are you absolutely sure? All data will be lost.",
      () => {
        executeDelete();
      }
    );
  };

  return (
    <div className="bg-destructive/5 rounded-2xl p-6 border border-destructive/20 shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <h3 className="text-lg font-bold text-destructive">Danger Zone</h3>
      </div>
      
      <p className="text-sm text-destructive/80 mb-6">
        Once you delete your account, there is no going back. Please be certain. 
        All your transactions, budgets, and goals will be permanently removed.
      </p>

      <div className="space-y-4">
        <InputGroup
          label="Type 'DELETE' to confirm"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="DELETE"
          containerClassName="max-w-md"
          className="border-destructive/30 focus:border-destructive"
        />

        <Button 
          variant="danger" 
          onClick={handleDeleteAccount} 
          isLoading={isLoading} 
          disabled={confirmText !== "DELETE"}
        >
          Permanently Delete Account
        </Button>
      </div>
    </div>
  );
}
