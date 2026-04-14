import { OdooClient } from '@mediaos/api';

const ODOO_URL = process.env.EXPO_PUBLIC_ODOO_URL ?? 'http://localhost:8069';
const ODOO_DB = process.env.EXPO_PUBLIC_ODOO_DB ?? 'MediaAi';

export const odoo = new OdooClient(ODOO_URL, ODOO_DB);
