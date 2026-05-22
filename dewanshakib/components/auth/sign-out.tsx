"use client";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";

export default function SignOut({
  variant,
  size,
}: {
  size:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
    | null
    | undefined;
  variant:
    | "link"
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | null
    | undefined;
}) {
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
      toast.success("User signed out successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Server errror");
    }
  };

  return (
    <>
      <form className="w-full" onSubmit={onSubmit}>
        <Button variant={variant} size={size} type="submit">
          <LogOutIcon />
          Sign out
        </Button>
      </form>
    </>
  );
}