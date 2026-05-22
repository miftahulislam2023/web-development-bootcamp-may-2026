"use client";

import ImageUploadWidget from "./ImageUploadWidget";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";
import { customToast } from "@/components/ui/customToast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: string;
    createdAt: Date;
  };
  stats: {
    transactionCount: number;
    budgetCount: number;
  };
}

export default function ProfileCard({ user, stats }: ProfileCardProps) {
  const router = useRouter();
  const { update } = useSession();

  const handleImageUpdate = async (imageUrl: string) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile picture");
      }

      await update({ image: imageUrl });
      customToast.success("Success", "Profile picture updated successfully");
      router.refresh(); // Refresh to update the server component data
    } catch (error: unknown) {
      if (error instanceof Error) {
        customToast.error("Error", error.message);
      } else {
        customToast.error("Error", "An unknown error occurred");
      }
    }
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col items-center">
      <ImageUploadWidget onSuccess={handleImageUpdate}>
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-card shadow-md bg-muted flex items-center justify-center">
          {user.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-muted-foreground/50" />
          )}
        </div>
      </ImageUploadWidget>

      <h2 className="mt-4 text-2xl font-bold text-foreground text-center">
        {user.name}
      </h2>
      
      <div className="flex items-center gap-1 mt-1 text-primary bg-primary/10 px-3 py-1 rounded-full text-sm font-medium">
        <ShieldCheck className="w-4 h-4" />
        <span className="capitalize">{user.role}</span>
      </div>

      <div className="w-full mt-8 space-y-4">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="p-2 bg-muted rounded-lg">
            <Mail className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</span>
            <span className="text-sm truncate">{user.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="p-2 bg-muted rounded-lg">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</span>
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{stats.transactionCount}</p>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Transactions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{stats.budgetCount}</p>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Budgets</p>
        </div>
      </div>
    </div>
  );
}
