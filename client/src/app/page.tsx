'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isLoading } = useAuth(false);
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (user) router.push('/chat');
    else if (!token) router.push('/login');
  }, [user, token, isLoading]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{
          width: 40, height: 40,
          borderRadius: '50%',
          border: '3px solid var(--accent-light)',
          borderTopColor: 'var(--accent)',
        }}
      />
    </div>
  );
}
