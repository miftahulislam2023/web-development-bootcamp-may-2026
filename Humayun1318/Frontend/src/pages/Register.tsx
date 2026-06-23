import { RegisterForm } from "@/components/modules/Authentication/RegisterForm";
import AnimatedRegisterIllustration from "@/assets/icons/AnimatedRegisterIllustration";
import AuthLayout from "@/components/layout/Authlayout";

export default function Register() {
  return (
    <AuthLayout
      illustration={<AnimatedRegisterIllustration />}
      illustrationSide="left"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
