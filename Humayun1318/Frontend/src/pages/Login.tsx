import { useEffect, useState } from "react";
import AnimatedLoginIllustration from "@/assets/icons/AnimatedLoginIllustration";
import AuthLayout from "@/components/layout/Authlayout";
import { LoginForm } from "@/components/modules/Authentication/LoginForm";
import { toast } from "sonner";
import LoginCredentials from "@/components/LoginCredentials";

export default function Login() {

  const [demoCredentials, setDemoCredentials] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error) {
      setTimeout(() => {
        console.log("Error param detected:", decodeURIComponent(error));
        if (decodeURIComponent(error) === "User is deleted") {
          toast.error(
            "Your account has been deleted, if you think this is a mistake, please contact support.",
          );
        }
      }, 200);

      // IMPORTANT: remove query so it won't trigger again
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  return (
    <AuthLayout
      illustration={<AnimatedLoginIllustration />}
      illustrationSide="right"
    >
      <LoginForm demoCredentials={demoCredentials} />
      <LoginCredentials setDemoCredentials={setDemoCredentials}/>
    </AuthLayout>
  );
}
