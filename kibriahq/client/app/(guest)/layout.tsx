"use client"

import AuthHeader from '@/components/auth/AuthHeader'
import AuthLink from '@/components/auth/AuthLink'
import { Store } from '@/store'
import { useStoreState } from 'easy-peasy'
import { useRouter } from 'next/navigation'

const layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuth } = useStoreState((state: Store) => state.auth)
  const router = useRouter()

  if (isAuth) {
    router.replace('/');
  }
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-surface p-4 text-on-surface md:p-0">
      <div className="ghost-border ambient-shadow flex max-h-auto w-full max-w-[500px] flex-col overflow-hidden rounded-4xl bg-surface-container-lowest md:flex-row my-5">

        <section className="flex w-full flex-1 flex-col items-center justify-center bg-surface-container-lowest px-8 py-8">
          <div className="w-full">
            <div className="mb-8 font-headline text-2xl font-black tracking-tight text-primary md:hidden">
              CollabTool
            </div>

            <AuthHeader />

            {children}

            <AuthLink />
          </div>
        </section>
      </div>
    </main>
  )
}

export default layout