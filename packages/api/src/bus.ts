// ═══════════════════════════════════════════════════════
//  OdooBus — WebSocket Real-time Client
//  Connects to Odoo 19 WebSocket Bus
// ═══════════════════════════════════════════════════════

type BusCallback = (payload: unknown) => void;

interface BusMessage {
  type: string;
  payload: unknown;
}

export class OdooBus {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, BusCallback[]>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectDelay = 2000;
  private maxReconnectDelay = 30000;
  private shouldReconnect = false;
  private odooHost: string;

  constructor(odooHost: string) {
    // e.g. "your-odoo-server.com" (no protocol)
    this.odooHost = odooHost.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  connect(): void {
    this.shouldReconnect = true;
    this.openSocket();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  on(channel: string, callback: BusCallback): () => void {
    if (!this.listeners.has(channel)) {
      this.listeners.set(channel, []);
    }
    this.listeners.get(channel)!.push(callback);

    // Return unsubscribe function
    return () => {
      const arr = this.listeners.get(channel);
      if (arr) {
        const idx = arr.indexOf(callback);
        if (idx !== -1) arr.splice(idx, 1);
      }
    };
  }

  private openSocket(): void {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const url = `${protocol}://${this.odooHost}/websocket`;

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.reconnectDelay = 2000;
      };

      this.ws.onmessage = (event: MessageEvent<string>) => {
        try {
          const messages = JSON.parse(event.data) as BusMessage[];
          for (const msg of messages) {
            const handlers = this.listeners.get(msg.type) ?? [];
            for (const fn of handlers) {
              fn(msg.payload);
            }
          }
        } catch {
          // Ignore parse errors
        }
      };

      this.ws.onclose = () => {
        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      if (this.shouldReconnect) this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    this.reconnectTimer = setTimeout(() => {
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
      this.openSocket();
    }, this.reconnectDelay);
  }
}
