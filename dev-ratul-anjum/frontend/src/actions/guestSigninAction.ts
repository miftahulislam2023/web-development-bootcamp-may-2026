import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

const guestSigninAction = async () => {
  const email = "guest@gmail.com";
  const password = "guest1aA@";

  try {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: "/rooms",
    });

    if (!data && error) {
      return {
        errors: {
          general: error.message,
        },
      };
    }
  } catch (error) {
    return {
      errors: {
        general:
          error instanceof Error ? error.message : "Something went wrong",
      },
    };
  }

  redirect("/rooms");
};

export default guestSigninAction;
