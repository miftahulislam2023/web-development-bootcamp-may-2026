"use client";

import { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { Shield } from "lucide-react";
import { customToast } from "@/components/ui/customToast";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      customToast.success("Success", "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        customToast.error("Error", error.message);
      } else {
        customToast.error("Error", "An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Security Settings</h3>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <InputGroup
          label="Current Password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          required
        />
        <InputGroup
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password (min 6 chars)"
          helperText="Make sure it's at least 6 characters long."
          required
        />

        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!currentPassword || newPassword.length < 6}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}
