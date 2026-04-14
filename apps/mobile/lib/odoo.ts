// ═══════════════════════════════════════════════════════
//  OdooClient — Mobile dynamic singleton
// ═══════════════════════════════════════════════════════
import { OdooClient } from '@mediaos/api';
import { useConnectionStore } from '../store/connection';

let _client: OdooClient | null = null;

export function getOdooClient(): OdooClient {
  // getState() works synchronously (reads in-memory Zustand state)
  const { serverUrl, db } = useConnectionStore.getState();
  const url = serverUrl ?? process.env.EXPO_PUBLIC_ODOO_URL ?? 'http://localhost:8069';
  const database = db ?? process.env.EXPO_PUBLIC_ODOO_DB ?? 'MediaAi';

  if (!_client) {
    _client = new OdooClient(url, database);
  }
  return _client;
}

export function resetOdooClient(): void {
  _client = null;
}

// Backwards-compatible proxy
export const odoo: OdooClient = new Proxy({} as OdooClient, {
  get(_, prop: string | symbol) {
    const client = getOdooClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});
