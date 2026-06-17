import SignupForm from "@/app/sign-up/components/SignupForm";
import Link from "next/link";
import SocialAuth from "@/components/auth/SocialAuth";
import AuthFooter from "@/components/auth/AuthFooter";
import AuthBranding from "@/components/auth/AuthBranding";

export const metadata = {
  title: "Dialog | Sign Up",
  description:
    "Create your Dialog account and start chatting instantly. Join communities, connect with friends, and experience seamless messaging.",
  keywords: [
    "dialog chat application",
    "Ratul Anjum",
    "sign up",
    "create account",
    "real-time chat",
  ],
  openGraph: {
    type: "website",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up`,
    title: "Dialog | Sign Up",
    description:
      "Create your Dialog account and start chatting instantly. Join communities, connect with friends, and experience seamless messaging.",
    siteName: "Dialog",
  },
  twitter: {
    card: "summary",
    title: "Dialog | Sign Up",
    description:
      "Create your Dialog account and start chatting instantly. Join communities, connect with friends, and experience seamless messaging.",
    site: "@yourtwitterhandle",
  },
};

const SignupPage = () => {
  return (
    <div className="min-h-screen bg-[#F2F4F7] flex flex-col items-center justify-center p-4  text-slate-800">
      {/* Main Card Container */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-150">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-slate-900">
              Create your account
            </h1>
            <p className="text-center text-slate-500 mb-8 text-sm">
              Enter your details below to create your account
            </p>

            <SignupForm />
            <SocialAuth />

            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                prefetch={true}
                className="font-medium text-slate-900 underline hover:text-black"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Chat Application Interface Branding */}
        <AuthBranding />
      </div>

      {/* Footer Terms */}
      <AuthFooter />
    </div>
  );
};

export default SignupPage;
