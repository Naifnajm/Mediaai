// ═══════════════════════════════════════════════════════
//  Auth Store — Zustand
// ═══════════════════════════════════════════════════════
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession } from '@mediaos/types';

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
  setSession: (session: AuthSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      isLoading: false,
      error: null,
      setSession: (session) => set({ session, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      logout: () => set({ session: null }),
    }),
    {
      name: 'mediaos-auth',
      partialize: (state) => ({ session: state.session }),
    }
  )
);
