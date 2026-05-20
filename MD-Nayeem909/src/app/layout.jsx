import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { MobileNav } from '@/components/MobileNav';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/AuthProvider';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AIChatBot } from '@/components/AIChatBot';
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });

export const metadata = {
  title: 'Personal Expense Tracker',
  description: 'A minimalist and premium expense tracking application.',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.className} bg-background text-foreground antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {session ? (
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 w-full md:ml-64">
                  <header className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                    <div className="flex items-center gap-2">
                      <MobileNav />
                      <h1 className="text-xl font-semibold tracking-tight">Overview</h1>
                    </div>
                    <div className="flex items-center gap-4">
                      <ThemeToggle />
                      <AddTransactionModal />
                    </div>
                  </header>
                  <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-8">
                    {children}
                  </main>
                </div>
              </div>
            ) : (
              <main className="flex-1 overflow-hidden bg-background">
                {children}
              </main>
            )}
            <AIChatBot />
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
