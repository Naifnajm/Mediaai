// ═══════════════════════════════════════════════════════
//  Connection Store — Mobile (AsyncStorage)
// ═══════════════════════════════════════════════════════
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ serverUrl: s.serverUrl, db: s.db }),
    }
  )
);
