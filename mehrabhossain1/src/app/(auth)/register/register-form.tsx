"use client";

import { CircleAlert } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

import { registerUser, type RegisterState } from "./actions";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerUser,
    initialState,
  );

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      {state.error ? (
        <p
          aria-live="polite"
          className="flex items-center gap-2 rounded-field bg-rose-50 px-3 py-2 text-sm font-medium text-danger"
        >
          <CircleAlert className="size-4 shrink-0" />
          {state.error}
        </p>
      ) : null}

      <Field
        label="Name"
        name="name"
        type="text"
        autoComplete="name"
        required
      />

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
      />

      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="At least 8 characters."
      />

      <Button
        type="submit"
        variant="gradient"
        loading={pending}
        className="mt-2 w-full"
      >
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
