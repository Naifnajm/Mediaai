// ═══════════════════════════════════════════════════════
//  OdooClient — Dynamic singleton (reads from connection store)
// ═══════════════════════════════════════════════════════
import { OdooClient } from '@mediaos/api';

let _client: OdooClient | null = null;

function readConnection(): { serverUrl: string; db: string } {
  if (typeof window === 'undefined') {
    return {
      serverUrl: process.env.NEXT_PUBLIC_ODOO_URL ?? 'http://localhost:8069',
      db: process.env.NEXT_PUBLIC_ODOO_DB ?? 'MediaAi',
    };
  }
  try {
    const raw = localStorage.getItem('mediaos-connection');
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { serverUrl?: string; db?: string } };
      const { serverUrl, db } = parsed.state ?? {};
      if (serverUrl && db) return { serverUrl, db };
    }
  } catch {
    // fallback below
  }
  return {
    serverUrl: process.env.NEXT_PUBLIC_ODOO_URL ?? 'http://localhost:8069',
    db: process.env.NEXT_PUBLIC_ODOO_DB ?? 'MediaAi',
  };
}

export function getOdooClient(): OdooClient {
  if (!_client) {
    const { serverUrl, db } = readConnection();
    _client = new OdooClient(serverUrl, db);
  }
  return _client;
}

/** Call after changing the server connection so the next call uses the new URL/DB */
export function resetOdooClient(): void {
  _client = null;
}

// Backwards-compatible singleton — all existing `odoo.x()` calls work unchanged
export const odoo: OdooClient = new Proxy({} as OdooClient, {
  get(_, prop: string | symbol) {
    const client = getOdooClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

export { OdooClient };
