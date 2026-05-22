import Header from "@/components/header";
import { checkUser } from "@/lib/checkUser";
import { BackgroundProcessor } from "@/components/background-processor";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await checkUser();

  return (
    <>
      <BackgroundProcessor />
      <Header />
      <main className="min-h-screen pt-16">{children}</main>
      <footer className="border-t bg-blue-200 border-border/40 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Made by Mahi</p>
        </div>
      </footer>
    </>
  );
}