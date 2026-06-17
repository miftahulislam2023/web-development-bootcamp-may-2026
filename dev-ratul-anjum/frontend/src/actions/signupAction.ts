import { authClient } from "@/lib/auth-client";
import { signupSchema } from "@/schema/signupSchema";
import { redirect } from "next/navigation";

const signupAction = async (prevState: FormState, formData: FormData) => {
  let image: string = "";
  const rowData = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const photoEntry = formData.get("photo");
  const photo =
    photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : undefined;

  const values = {
    name: rowData.name,
    email: rowData.email,
    password: rowData.password,
  };

  // Zod validation
  const parsed = signupSchema.safeParse(rowData);

  if (!parsed.success) {
    const errors: NonNullable<FormState["errors"]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof NonNullable<FormState["errors"]>;
      errors[field] = issue.message;
    });

    return { values, errors };
  }

  //   Send to backend
  const backendForm = new FormData();

  if (photo) {
    backendForm.append("photo", photo);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/v1/upload-avatar`,
        {
          method: "POST",
          body: backendForm,
        },
      );
      const result = await response.json();

      if (result.success) {
        image = result.data.imageUrl;
      } else {
        return { values, errors: { general: result.message as string } };
      }
    } catch (error) {
      const errors: FormState["errors"] = {
        general:
          error instanceof Error ? error.message : "Something went wrong",
      };

      return { values, errors };
    }
  }

  try {
    const { data, error } = await authClient.signUp.email({
      name: parsed.data.name, // required
      email: parsed.data.email, // required
      password: parsed.data.password, // required
      image: image ? image : undefined,
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

export default signupAction;

export type FormState = {
  values: {
    name: string;
    email: string;
    password: string;
  };
  errors: Partial<Record<"name" | "email" | "password" | "general", string>>;
};
