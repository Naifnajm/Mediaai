import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.petty.cash" title="الصندوق النقدي" icon="💵" fields='["id","name","state","custodian_id","opening_balance","current_balance","total_expenses","date_open"]' columns='[{"key":"name","label":"الصندوق"},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","open":"مفتوح","reconciling":"مطابقة","closed":"مُغلق"}},{"key":"custodian_id","label":"المسؤول","type":"many2one"},{"key":"opening_balance","label":"رصيد الافتتاح","type":"currency"},{"key":"current_balance","label":"الرصيد الحالي","type":"currency"},{"key":"total_expenses","label":"إجمالي المصروفات","type":"currency"}]'
    />
  );
}
