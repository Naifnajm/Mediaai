// ═══════════════════════════════════════════════════════
//  MediaOS Custom Models — 25 Custom Modules
// ═══════════════════════════════════════════════════════

import type { OdooRecord, OdooMany2one, OdooOne2many, OdooMany2many, OdooSelection, OdooBinary } from './odoo';

// ─── 1. media_production ─────────────────────────────
export interface MediaProduction extends OdooRecord {
  name: string;
  code?: string;
  production_type: OdooSelection<'film' | 'series' | 'documentary' | 'commercial' | 'short'>;
  state: OdooSelection<'draft' | 'pre_production' | 'production' | 'post_production' | 'delivered' | 'cancelled'>;
  project_id?: OdooMany2one;
  director_id?: OdooMany2one;
  producer_id?: OdooMany2one;
  client_id?: OdooMany2one;
  date_start?: string;
  date_end?: string;
  budget_total?: number;
  budget_spent?: number;
  currency_id?: OdooMany2one;
  description?: string;
  image?: OdooBinary;
  episode_count?: number;
  shooting_days?: number;
  crew_count?: number;
  task_count?: number;
  contract_count?: number;
}

// ─── 2. media_project ────────────────────────────────
export interface MediaProject extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  manager_id?: OdooMany2one;
  state: OdooSelection<'draft' | 'active' | 'paused' | 'done' | 'cancelled'>;
  date_start?: string;
  date_end?: string;
  progress?: number;
  task_count?: number;
  description?: string;
}

// ─── 3. media_creative ───────────────────────────────
export interface MediaCreative extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  script_type: OdooSelection<'screenplay' | 'treatment' | 'outline' | 'shooting_script'>;
  state: OdooSelection<'draft' | 'review' | 'approved' | 'locked'>;
  writer_id?: OdooMany2one;
  version?: string;
  synopsis?: string;
  genre?: string;
  logline?: string;
  page_count?: number;
  scene_count?: number;
  script_file?: OdooBinary;
}

// ─── 4. media_ai_breakdown ───────────────────────────
export interface MediaAiBreakdown extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  script_id?: OdooMany2one;
  state: OdooSelection<'pending' | 'processing' | 'done' | 'failed'>;
  scene_count?: number;
  character_count?: number;
  location_count?: number;
  prop_count?: number;
  breakdown_date?: string;
  ai_model?: string;
  raw_output?: string;
}

export interface MediaAiScene extends OdooRecord {
  breakdown_id: OdooMany2one;
  scene_number: string;
  scene_heading?: string;
  int_ext: OdooSelection<'INT' | 'EXT' | 'INT/EXT'>;
  day_night: OdooSelection<'DAY' | 'NIGHT' | 'DUSK' | 'DAWN'>;
  location_id?: OdooMany2one;
  page_count?: number;
  character_ids?: OdooMany2many;
  prop_ids?: OdooMany2many;
  vehicle_ids?: OdooMany2many;
  equipment_ids?: OdooMany2many;
  notes?: string;
}

// ─── 5. media_casting ────────────────────────────────
export interface MediaCasting extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  role_name: string;
  role_type: OdooSelection<'lead' | 'supporting' | 'featured' | 'extra'>;
  state: OdooSelection<'open' | 'shortlisted' | 'selected' | 'contracted'>;
  actor_id?: OdooMany2one;
  casting_director_id?: OdooMany2one;
  audition_date?: string;
  character_description?: string;
  age_range?: string;
  gender?: OdooSelection<'male' | 'female' | 'any'>;
  nationality?: string;
  rate?: number;
  currency_id?: OdooMany2one;
}

// ─── 6. media_crew ───────────────────────────────────
export interface MediaCrew extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  employee_id?: OdooMany2one;
  partner_id?: OdooMany2one;
  department: OdooSelection<'direction' | 'camera' | 'lighting' | 'sound' | 'art' | 'production' | 'post' | 'vfx' | 'other'>;
  role: string;
  state: OdooSelection<'draft' | 'confirmed' | 'active' | 'released'>;
  date_start?: string;
  date_end?: string;
  daily_rate?: number;
  currency_id?: OdooMany2one;
  contract_id?: OdooMany2one;
  nationality?: string;
  id_number?: string;
}

// ─── 7. media_schedule ───────────────────────────────
export interface MediaScheduleLine extends OdooRecord {
  production_id: OdooMany2one;
  scene_id?: OdooMany2one;
  date: string;
  day_number?: number;
  call_time?: string;
  wrap_time?: string;
  location_id?: OdooMany2one;
  int_ext: OdooSelection<'INT' | 'EXT'>;
  day_night: OdooSelection<'DAY' | 'NIGHT'>;
  pages?: number;
  crew_ids?: OdooMany2many;
  cast_ids?: OdooMany2many;
  equipment_ids?: OdooMany2many;
  state: OdooSelection<'draft' | 'confirmed' | 'shot' | 'postponed'>;
  notes?: string;
}

// ─── 8. media_locations ──────────────────────────────
export interface MediaLocation extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  location_type: OdooSelection<'studio' | 'outdoor' | 'practical' | 'set'>;
  state: OdooSelection<'scouted' | 'approved' | 'booked' | 'released'>;
  address?: string;
  city?: string;
  country_id?: OdooMany2one;
  coordinates?: string;
  contact_id?: OdooMany2one;
  daily_rate?: number;
  currency_id?: OdooMany2one;
  permit_required: boolean;
  permit_status?: OdooSelection<'pending' | 'approved' | 'rejected'>;
  notes?: string;
  image?: OdooBinary;
}

// ─── 9. media_equipment ──────────────────────────────
export interface MediaEquipment extends OdooRecord {
  name: string;
  category: OdooSelection<'camera' | 'lens' | 'lighting' | 'sound' | 'grip' | 'electric' | 'transport' | 'other'>;
  state: OdooSelection<'available' | 'rented' | 'maintenance' | 'retired'>;
  serial_number?: string;
  brand?: string;
  model?: string;
  daily_rate?: number;
  currency_id?: OdooMany2one;
  vendor_id?: OdooMany2one;
  rental_from?: string;
  rental_to?: string;
  production_id?: OdooMany2one;
  notes?: string;
}

// ─── 10. media_safety ────────────────────────────────
export interface MediaSafety extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  document_type: OdooSelection<'risk_assessment' | 'safety_plan' | 'incident_report' | 'permit' | 'certificate'>;
  state: OdooSelection<'draft' | 'review' | 'approved' | 'expired'>;
  responsible_id?: OdooMany2one;
  date_issue?: string;
  date_expiry?: string;
  risk_level?: OdooSelection<'low' | 'medium' | 'high' | 'critical'>;
  description?: string;
}

// ─── 11. media_budget ────────────────────────────────
export interface MediaBudget extends OdooRecord {
  name: string;
  production_id: OdooMany2one;
  state: OdooSelection<'draft' | 'submitted' | 'approved' | 'locked'>;
  currency_id: OdooMany2one;
  total_approved?: number;
  total_actual?: number;
  total_estimated?: number;
  variance?: number;
  variance_pct?: number;
  line_ids?: OdooOne2many;
}

export interface MediaBudgetLine extends OdooRecord {
  budget_id: OdooMany2one;
  name: string;
  department_id?: OdooMany2one;
  category: string;
  approved: number;
  actual: number;
  estimated: number;
  variance: number;
  variance_pct: number;
}

// ─── 12. media_petty_cash ────────────────────────────
export interface MediaPettyCash extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  custodian_id?: OdooMany2one;
  state: OdooSelection<'draft' | 'open' | 'reconciling' | 'closed'>;
  currency_id?: OdooMany2one;
  opening_balance?: number;
  current_balance?: number;
  total_expenses?: number;
  date_open?: string;
  date_close?: string;
}

// ─── 13. media_contracts ─────────────────────────────
export interface MediaContract extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  contract_type: OdooSelection<'crew' | 'talent' | 'location' | 'equipment' | 'service' | 'distribution'>;
  state: OdooSelection<'draft' | 'sent' | 'signed' | 'active' | 'expired' | 'terminated'>;
  party_id?: OdooMany2one;
  date_start?: string;
  date_end?: string;
  amount?: number;
  currency_id?: OdooMany2one;
  payment_terms?: string;
  sign_request_id?: OdooMany2one;
  notes?: string;
}

// ─── 14. media_clearances ────────────────────────────
export interface MediaClearance extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  clearance_type: OdooSelection<'talent_release' | 'location_release' | 'music_sync' | 'archive' | 'trademark' | 'other'>;
  state: OdooSelection<'pending' | 'in_progress' | 'cleared' | 'rejected'>;
  party_id?: OdooMany2one;
  responsible_id?: OdooMany2one;
  date_requested?: string;
  date_cleared?: string;
  fee?: number;
  currency_id?: OdooMany2one;
  description?: string;
  territory?: string;
  usage_terms?: string;
}

// ─── 15. media_music_rights ──────────────────────────
export interface MediaMusicRight extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  track_title: string;
  artist?: string;
  composer?: string;
  publisher_id?: OdooMany2one;
  state: OdooSelection<'searching' | 'negotiating' | 'licensed' | 'rejected'>;
  license_type: OdooSelection<'sync' | 'master' | 'both'>;
  territory?: string;
  usage_type?: string;
  license_fee?: number;
  currency_id?: OdooMany2one;
  date_start?: string;
  date_end?: string;
  duration?: number;
}

// ─── 16. media_insurance ─────────────────────────────
export interface MediaInsurance extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  policy_type: OdooSelection<'production' | 'equipment' | 'liability' | 'workers_comp' | 'e&o'>;
  state: OdooSelection<'draft' | 'active' | 'expired' | 'claimed'>;
  insurer_id?: OdooMany2one;
  policy_number?: string;
  date_start?: string;
  date_end?: string;
  coverage_amount?: number;
  premium?: number;
  currency_id?: OdooMany2one;
  deductible?: number;
}

// ─── 17. media_dam ───────────────────────────────────
export interface MediaDamAsset extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  folder_id?: OdooMany2one;
  asset_type: OdooSelection<'image' | 'video' | 'audio' | 'document' | 'archive' | 'other'>;
  state: OdooSelection<'active' | 'archived' | 'deleted'>;
  mimetype?: string;
  file_size?: number;
  duration?: number;
  resolution?: string;
  tags?: string;
  description?: string;
  attachment_id?: OdooMany2one;
  thumbnail?: OdooBinary;
  version?: string;
  checksum?: string;
}

export interface MediaDamFolder extends OdooRecord {
  name: string;
  parent_id?: OdooMany2one;
  production_id?: OdooMany2one;
  asset_count?: number;
  children_count?: number;
  path?: string;
}

// ─── 18. media_vfx ───────────────────────────────────
export interface MediaVfx extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  shot_code: string;
  description?: string;
  state: OdooSelection<'brief' | 'in_progress' | 'review' | 'approved' | 'delivered'>;
  department: OdooSelection<'vfx' | 'cgi' | 'motion' | 'color' | 'sound_design'>;
  supervisor_id?: OdooMany2one;
  artist_id?: OdooMany2one;
  due_date?: string;
  version?: number;
  frames?: number;
  fps?: number;
  resolution?: string;
  complexity: OdooSelection<'simple' | 'medium' | 'complex' | 'hero'>;
  notes?: string;
}

// ─── 19. media_distribution ──────────────────────────
export interface MediaDistribution extends OdooRecord {
  name: string;
  production_id?: OdooMany2one;
  distributor_id?: OdooMany2one;
  platform: OdooSelection<'cinema' | 'streaming' | 'broadcast' | 'satellite' | 'dvd' | 'airline' | 'other'>;
  state: OdooSelection<'negotiating' | 'signed' | 'active' | 'expired'>;
  territory?: string;
  language?: string;
  date_release?: string;
  date_start?: string;
  date_end?: string;
  minimum_guarantee?: number;
  revenue_share?: number;
  currency_id?: OdooMany2one;
  exclusive: boolean;
}

// ─── 20. media_analytics ─────────────────────────────
export interface MediaAnalyticsKpi extends OdooRecord {
  production_id?: OdooMany2one;
  period: string;
  views?: number;
  revenue?: number;
  budget_utilization?: number;
  schedule_adherence?: number;
  crew_utilization?: number;
  platform?: string;
  region?: string;
}

// ─── 21. media_crm ───────────────────────────────────
export interface MediaCrmLead extends OdooRecord {
  name: string;
  partner_id?: OdooMany2one;
  contact_name?: string;
  email?: string;
  phone?: string;
  lead_type: OdooSelection<'client' | 'broadcaster' | 'distributor' | 'sponsor' | 'talent_agency'>;
  state: OdooSelection<'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'>;
  probability?: number;
  expected_revenue?: number;
  currency_id?: OdooMany2one;
  user_id?: OdooMany2one;
  production_id?: OdooMany2one;
  description?: string;
}

// ─── 22. media_hr_sa ─────────────────────────────────
export interface MediaHrEmployee extends OdooRecord {
  employee_id: OdooMany2one;
  national_id?: string;
  iqama_number?: string;
  iqama_expiry?: string;
  nationality_id?: OdooMany2one;
  is_saudi: boolean;
  visa_type?: string;
  visa_expiry?: string;
  gosi_number?: string;
  bank_account?: string;
  iban?: string;
  bank_id?: OdooMany2one;
  medical_insurance?: string;
  joining_date?: string;
}

// ─── 23. media_payroll_sa ────────────────────────────
export interface MediaPayroll extends OdooRecord {
  name: string;
  employee_id: OdooMany2one;
  date_from: string;
  date_to: string;
  state: OdooSelection<'draft' | 'verify' | 'done' | 'cancel'>;
  basic_wage?: number;
  housing_allowance?: number;
  transport_allowance?: number;
  other_allowances?: number;
  gosi_employee?: number;
  gosi_employer?: number;
  net_wage?: number;
  currency_id?: OdooMany2one;
  wps_reference?: string;
  payment_date?: string;
}

// ─── 24. media_wrap ──────────────────────────────────
export interface MediaWrap extends OdooRecord {
  name: string;
  production_id: OdooMany2one;
  state: OdooSelection<'draft' | 'in_progress' | 'done'>;
  wrap_date?: string;
  responsible_id?: OdooMany2one;
  equipment_returned: boolean;
  locations_cleared: boolean;
  crew_paid: boolean;
  assets_archived: boolean;
  contracts_closed: boolean;
  final_report_done: boolean;
  notes?: string;
}

// ─── Dashboard Types ──────────────────────────────────
export interface DashboardKpi {
  activeProductions: number;
  activeCrewCount: number;
  budgetUtilization: number;
  shootingToday: number;
  overdueActivities: number;
  pendingContracts: number;
}

export interface BudgetVarianceRow {
  id: number;
  department: string;
  category: string;
  approved: number;
  actual: number;
  estimated: number;
  variance: number;
  variancePct: number;
}
