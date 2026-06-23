import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your personal expenses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}