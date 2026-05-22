"use client";

import { useState } from "react";
import InputGroup from "@/components/ui/InputGroup";
import { Button } from "@/components/ui/Button";
import { User as UserIcon } from "lucide-react";
import { customToast } from "@/components/ui/customToast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface GeneralSettingsProps {
  user: {
    name: string;
  };
}

export default function GeneralSettings({ user }: GeneralSettingsProps) {
  const [name, setName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSave = async () => {
    if (!name.trim() || name === user.name) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      await update({ name: name.trim() });
      customToast.success("Success", "Profile updated successfully");
      router.refresh();
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
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-bold text-foreground mb-6">General Information</h3>
      
      <div className="space-y-6">
        <InputGroup
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<UserIcon />}
          placeholder="Enter your full name"
        />

        <div className="flex justify-end pt-4 border-t border-border">
          <Button 
            onClick={handleSave} 
            isLoading={isLoading} 
            disabled={!name.trim() || name === user.name}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
