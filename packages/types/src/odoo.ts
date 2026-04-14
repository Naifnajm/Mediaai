// ═══════════════════════════════════════════════════════
//  Odoo Base Types
// ═══════════════════════════════════════════════════════

export interface OdooRecord {
  id: number;
  display_name?: string;
  create_date?: string;
  write_date?: string;
  create_uid?: [number, string];
  write_uid?: [number, string];
}

export type OdooMany2one = [number, string] | false;
export type OdooOne2many = number[];
export type OdooMany2many = number[];
export type OdooSelection<T extends string = string> = T | false;
export type OdooBinary = string | false; // base64

export interface OdooDomain {
  field: string;
  operator: string;
  value: unknown;
}

export type Domain = Array<string | [string, string, unknown]>;

export interface SearchReadOptions {
  limit?: number;
  offset?: number;
  order?: string;
  context?: Record<string, unknown>;
}

export interface OdooCallOptions {
  model: string;
  method: string;
  args?: unknown[];
  kwargs?: Record<string, unknown>;
}

export interface OdooAttachment extends OdooRecord {
  name: string;
  mimetype: string;
  file_size: number;
  datas?: string;
  res_model: string;
  res_id: number;
  type: 'url' | 'binary';
  url?: string;
  access_token?: string;
}

export interface OdooMessage extends OdooRecord {
  body: string;
  author_id: OdooMany2one;
  date: string;
  message_type: 'comment' | 'notification' | 'email';
  subtype_id?: OdooMany2one;
  attachment_ids: OdooOne2many;
  model?: string;
  res_id?: number;
}

export interface OdooActivity extends OdooRecord {
  activity_type_id: OdooMany2one;
  summary?: string;
  note?: string;
  date_deadline: string;
  user_id: OdooMany2one;
  res_model: string;
  res_id: number;
  state: 'overdue' | 'today' | 'planned';
}

export interface OdooPartner extends OdooRecord {
  name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  image_128?: OdooBinary;
  company_name?: string;
  is_company: boolean;
  street?: string;
  city?: string;
  country_id?: OdooMany2one;
}

export interface OdooEmployee extends OdooRecord {
  name: string;
  job_title?: string;
  department_id?: OdooMany2one;
  job_id?: OdooMany2one;
  user_id?: OdooMany2one;
  image_128?: OdooBinary;
  work_email?: string;
  mobile_phone?: string;
  active: boolean;
}

export interface OdooProject extends OdooRecord {
  name: string;
  description?: string;
  user_id?: OdooMany2one;
  partner_id?: OdooMany2one;
  date_start?: string;
  date?: string;
  state?: string;
  task_count?: number;
}

export interface OdooTask extends OdooRecord {
  name: string;
  description?: string;
  project_id?: OdooMany2one;
  user_ids?: OdooMany2many;
  date_deadline?: string;
  priority: '0' | '1';
  stage_id?: OdooMany2one;
  kanban_state?: 'normal' | 'done' | 'blocked';
}

export interface OdooInvoice extends OdooRecord {
  name: string;
  partner_id: OdooMany2one;
  invoice_date?: string;
  invoice_date_due?: string;
  amount_total: number;
  amount_residual: number;
  state: 'draft' | 'posted' | 'cancel';
  move_type: 'out_invoice' | 'out_refund' | 'in_invoice' | 'in_refund';
  currency_id: OdooMany2one;
}

export interface AuthSession {
  uid: number;
  username: string;
  name: string;
  db: string;
  session_id?: string;
  is_admin?: boolean;
  partner_id?: number;
  image_128?: string;
  lang?: string;
  tz?: string;
  groups_id?: number[];
}
