// ═══════════════════════════════════════════════════════
//  OdooClient — JSON-RPC v2.0
//  Connects to Odoo 19 Community — DB: MediaAi
// ═══════════════════════════════════════════════════════

import type { AuthSession, OdooAttachment, SearchReadOptions } from '@mediaos/types';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: 'call';
  id: number;
  params: unknown;
}

interface JsonRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  id: number;
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: {
      message: string;
      exception_type?: string;
      arguments?: string[];
    };
  };
}

export class OdooClient {
  private baseUrl: string;
  readonly db: string;
  private _session: AuthSession | null = null;

  constructor(baseUrl: string, db: string = 'MediaAi') {
    // Strip trailing slash
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.db = db;
  }

  get session(): AuthSession | null {
    return this._session;
  }

  get isAuthenticated(): boolean {
    return this._session !== null;
  }

  // ── Auth ────────────────────────────────────────────

  async authenticate(username: string, password: string): Promise<AuthSession> {
    const res = await this.jsonRpc<{
      uid: number | false;
      name: string;
      username: string;
      session_id: string;
      is_admin: boolean;
      partner_id: number;
      image_128: string;
      lang: string;
      tz: string;
      groups_id: number[];
    }>('/web/session/authenticate', {
      db: this.db,
      login: username,
      password,
    });

    if (!res.uid) {
      throw new Error('بيانات الدخول غير صحيحة');
    }

    this._session = {
      uid: res.uid,
      username: res.username,
      name: res.name,
      db: this.db,
      session_id: res.session_id,
      is_admin: res.is_admin,
      partner_id: res.partner_id,
      image_128: res.image_128,
      lang: res.lang,
      tz: res.tz,
      groups_id: res.groups_id,
    };

    return this._session;
  }

  async logout(): Promise<void> {
    await this.jsonRpc('/web/session/destroy', {});
    this._session = null;
  }

  async getSessionInfo(): Promise<AuthSession | null> {
    try {
      const res = await this.jsonRpc<{ uid: number | false; name: string; username: string }>('/web/session/get_session_info', {});
      if (!res.uid) {
        this._session = null;
        return null;
      }
      this._session = { uid: res.uid, name: res.name, username: res.username, db: this.db };
      return this._session;
    } catch {
      this._session = null;
      return null;
    }
  }

  // ── CRUD ────────────────────────────────────────────

  async searchRead<T>(
    model: string,
    domain: unknown[] = [],
    fields: string[] = [],
    options: SearchReadOptions = {}
  ): Promise<T[]> {
    return this.callKw<T[]>({
      model,
      method: 'search_read',
      args: [domain],
      kwargs: {
        fields,
        limit: options.limit ?? 80,
        offset: options.offset ?? 0,
        order: options.order ?? 'id desc',
        context: this.context(options.context),
      },
    });
  }

  async read<T>(model: string, ids: number[], fields: string[]): Promise<T[]> {
    return this.callKw<T[]>({
      model,
      method: 'read',
      args: [ids, fields],
    });
  }

  async readOne<T>(model: string, id: number, fields: string[]): Promise<T> {
    const results = await this.read<T>(model, [id], fields);
    const first = results[0];
    if (!first) throw new Error(`Record ${id} not found in ${model}`);
    return first;
  }

  async create(model: string, values: Record<string, unknown>): Promise<number> {
    return this.callKw<number>({
      model,
      method: 'create',
      args: [values],
    });
  }

  async write(model: string, ids: number[], values: Record<string, unknown>): Promise<boolean> {
    return this.callKw<boolean>({
      model,
      method: 'write',
      args: [ids, values],
    });
  }

  async unlink(model: string, ids: number[]): Promise<boolean> {
    return this.callKw<boolean>({
      model,
      method: 'unlink',
      args: [ids],
    });
  }

  async searchCount(model: string, domain: unknown[] = []): Promise<number> {
    return this.callKw<number>({
      model,
      method: 'search_count',
      args: [domain],
    });
  }

  async search(model: string, domain: unknown[] = [], limit?: number): Promise<number[]> {
    return this.callKw<number[]>({
      model,
      method: 'search',
      args: [domain],
      kwargs: { limit: limit ?? 100 },
    });
  }

  async fieldsGet(model: string, attributes: string[] = ['string', 'type', 'selection', 'required', 'readonly', 'help']): Promise<Record<string, { string: string; type: string; selection?: [string, string][]; required?: boolean; readonly?: boolean; help?: string }>> {
    return this.callKw({
      model,
      method: 'fields_get',
      args: [],
      kwargs: { attributes },
    });
  }

  // ── Button / Action ─────────────────────────────────

  async callButton(model: string, method: string, ids: number[], kwargs: Record<string, unknown> = {}): Promise<unknown> {
    return this.callKw({
      model,
      method,
      args: [ids],
      kwargs,
    });
  }

  async callMethod<T = unknown>(model: string, method: string, args: unknown[] = [], kwargs: Record<string, unknown> = {}): Promise<T> {
    return this.callKw<T>({
      model,
      method,
      args,
      kwargs,
    });
  }

  // ── Chatter ─────────────────────────────────────────

  async getMessages(model: string, resId: number, limit = 30): Promise<import('@mediaos/types').OdooMessage[]> {
    return this.searchRead(
      'mail.message',
      [['model', '=', model], ['res_id', '=', resId]],
      ['id', 'body', 'author_id', 'date', 'message_type', 'subtype_id', 'attachment_ids'],
      { limit, order: 'date desc' }
    );
  }

  async postMessage(model: string, resId: number, body: string, attachmentIds: number[] = []): Promise<number> {
    return this.callKw<number>({
      model,
      method: 'message_post',
      args: [resId],
      kwargs: {
        body,
        message_type: 'comment',
        attachment_ids: attachmentIds.map((id) => [4, id]),
      },
    });
  }

  async getActivities(model: string, resId: number): Promise<import('@mediaos/types').OdooActivity[]> {
    return this.searchRead(
      'mail.activity',
      [['res_model', '=', model], ['res_id', '=', resId]],
      ['id', 'activity_type_id', 'summary', 'note', 'date_deadline', 'user_id', 'state']
    );
  }

  // ── Attachments ─────────────────────────────────────

  async getAttachments(resModel: string, resId: number): Promise<OdooAttachment[]> {
    return this.searchRead<OdooAttachment>(
      'ir.attachment',
      [['res_model', '=', resModel], ['res_id', '=', resId]],
      ['id', 'name', 'mimetype', 'file_size', 'create_date', 'type', 'url', 'access_token']
    );
  }

  async uploadAttachment(file: File, resModel: string, resId: number): Promise<OdooAttachment> {
    const formData = new FormData();
    formData.append('ufile', file);
    formData.append('model', resModel);
    formData.append('id', resId.toString());

    const res = await fetch(`${this.baseUrl}/web/binary/upload_attachment`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Upload failed: ${res.statusText}`);
    }

    const data = await res.json() as { id: number; name: string; mimetype: string; file_size: number }[];
    const first = data[0];
    if (!first) throw new Error('Upload returned no data');
    return first as unknown as OdooAttachment;
  }

  async deleteAttachment(attachmentId: number): Promise<boolean> {
    return this.unlink('ir.attachment', [attachmentId]);
  }

  // ── Images ──────────────────────────────────────────

  imageUrl(model: string, id: number, field: string = 'image_128', size?: string): string {
    const base = `${this.baseUrl}/web/image/${model}/${id}/${field}`;
    return size ? `${base}?width=${size}` : base;
  }

  avatarUrl(partnerId: number, size: 128 | 256 | 512 = 128): string {
    return `${this.baseUrl}/web/image/res.partner/${partnerId}/image_${size}`;
  }

  // ── PDF ─────────────────────────────────────────────

  pdfUrl(reportName: string, id: number): string {
    return `${this.baseUrl}/report/pdf/${reportName}/${id}`;
  }

  // ── Namespaced helpers ──────────────────────────────

  /** Quick model selector — returns typed client helper */
  model<T extends Record<string, unknown>>(modelName: string) {
    const self = this;
    return {
      find: (domain: unknown[] = [], fields: string[] = [], opts: SearchReadOptions = {}) =>
        self.searchRead<T>(modelName, domain, fields, opts),
      get: (id: number, fields: string[]) => self.readOne<T>(modelName, id, fields),
      create: (values: Record<string, unknown>) => self.create(modelName, values),
      update: (ids: number[], values: Record<string, unknown>) => self.write(modelName, ids, values),
      delete: (ids: number[]) => self.unlink(modelName, ids),
      count: (domain: unknown[] = []) => self.searchCount(modelName, domain),
    };
  }

  // ── Internal ────────────────────────────────────────

  private context(extra: Record<string, unknown> = {}): Record<string, unknown> {
    return {
      lang: 'ar_001',
      tz: 'Asia/Riyadh',
      ...extra,
    };
  }

  private async callKw<T>(options: {
    model: string;
    method: string;
    args?: unknown[];
    kwargs?: Record<string, unknown>;
  }): Promise<T> {
    const result = await this.jsonRpc<T>('/web/dataset/call_kw', {
      model: options.model,
      method: options.method,
      args: options.args ?? [],
      kwargs: {
        context: this.context(),
        ...(options.kwargs ?? {}),
      },
    });

    return result;
  }

  async jsonRpc<T = unknown>(endpoint: string, params: unknown): Promise<T> {
    const body: JsonRpcRequest = {
      jsonrpc: '2.0',
      method: 'call',
      id: Date.now(),
      params: params as Record<string, unknown>,
    };

    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = (await res.json()) as JsonRpcResponse<T>;

    if (json.error) {
      const msg = json.error.data?.message ?? json.error.message;
      throw new Error(msg);
    }

    return json.result as T;
  }
}
