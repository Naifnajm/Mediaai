import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/auth';
import { useConnectionStore } from '../store/connection';

export default function Index() {
  const session = useAuthStore((s) => s.session);
  const { serverUrl, db } = useConnectionStore();

  // Wait one tick for Zustand AsyncStorage hydration
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;

  if (!serverUrl || !db) return <Redirect href="/(auth)/connect" />;
  if (!session) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(tabs)/" />;
}
