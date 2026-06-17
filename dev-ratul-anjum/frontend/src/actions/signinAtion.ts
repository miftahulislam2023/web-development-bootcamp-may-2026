import { authClient } from "@/lib/auth-client";
import { signinSchema } from "@/schema/signinSchema";
import { redirect } from "next/navigation";

const signinAction = async (prevState: FormState, formData: FormData) => {
  const isGuest = formData.get("guest") === "true";

  const rowData = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  if (isGuest) {
    rowData.email = "guest@gmail.com";
    rowData.password = "guest1aA@";
  }

  const values = {
    email: rowData.email,
    password: rowData.password,
  };

  console.log(values);

  // Zod validation
  const parsed = signinSchema.safeParse(rowData);

  if (!parsed.success) {
    const errors: NonNullable<FormState["errors"]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof NonNullable<FormState["errors"]>;
      errors[field] = issue.message;
    });

    return { values, errors };
  }

  //   Send to backend
  try {
    const { data, error } = await authClient.signIn.email({
      email: parsed.data.email, // required
      password: parsed.data.password, // required
      rememberMe: true,
      callbackURL: "/rooms",
    });

    if (!data && error) {
      return { values, errors: { general: error.message } };
    }
  } catch (error) {
    const errors: FormState["errors"] = {
      general: error instanceof Error ? error.message : "Something went wrong",
    };

    return { values, errors };
  }

  redirect("/rooms");
};

export default signinAction;

export type FormState = {
  values: {
    email: string;
    password: string;
  };
  errors: Partial<Record<"email" | "password" | "general", string>>;
};
