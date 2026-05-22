"use client";
import { FormEvent } from "react";
import { Button } from "../ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function SignIn({
  title,
  variant,
}: {
  title: string;
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
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Server errror");
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Button variant={variant} size={"lg"} type="submit">
          {title} {<LogIn />}
        </Button>
      </form>
    </>
  );
}
