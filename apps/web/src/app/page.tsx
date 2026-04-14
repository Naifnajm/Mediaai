'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConnectionStore } from '@/store/connection.store';
import { useAuthStore } from '@/store/auth.store';

export default function RootPage() {
  const router = useRouter();
  const { serverUrl, db } = useConnectionStore();
  const session = useAuthStore((s) => s.session);

  useEffect(() => {
    if (!serverUrl || !db) {
      router.replace('/connect');
    } else if (!session) {
      router.replace('/login');
    } else {
      router.replace('/dashboard');
    }
  }, [serverUrl, db, session, router]);

  return null;
}
