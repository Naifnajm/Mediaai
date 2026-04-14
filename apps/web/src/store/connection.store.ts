// ═══════════════════════════════════════════════════════
//  Connection Store — Server URL + DB (persisted)
// ═══════════════════════════════════════════════════════
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConnectionState {
  serverUrl: string | null;
  db: string | null;
  setConnection: (serverUrl: string, db: string) => void;
  clearConnection: () => void;
}

export const useConnectionStore = create<ConnectionState>()(
  persist(
    (set) => ({
      serverUrl: null,
      db: null,
      setConnection: (serverUrl, db) => set({ serverUrl, db }),
      clearConnection: () => set({ serverUrl: null, db: null }),
    }),
    {
      name: 'mediaos-connection',
      partialize: (state) => ({ serverUrl: state.serverUrl, db: state.db }),
    }
  )
);
