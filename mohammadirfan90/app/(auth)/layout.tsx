import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth - DevConnect",
  description: "Sign in or create an account to start chatting.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
