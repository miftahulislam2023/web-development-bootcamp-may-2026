/**
 * 
 * this is the landing page
 * 
 */

import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
    </main>
  )
}
