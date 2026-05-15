'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export const useAuth = (redirectIfUnauthenticated = true) => {
  const { user, token, isLoading, _hasHydrated, hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // only hydrate if we have a token but no user (initial load after refresh)
    if (_hasHydrated && token && !user) {
      hydrate();
    }
  }, [_hasHydrated, token, user, hydrate]);

  useEffect(() => {
    // wait until hydration is complete before deciding to redirect
    if (!_hasHydrated) return;

    if (!isLoading && !user && redirectIfUnauthenticated) {
      if (!token) {
        router.push('/login');
      }
    }
  }, [_hasHydrated, user, isLoading, token, redirectIfUnauthenticated, router]);

  return { user, isLoading: !_hasHydrated || isLoading, isAuthenticated: !!user };
};
