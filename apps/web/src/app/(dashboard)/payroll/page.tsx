import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.payroll.sa" title="الرواتب" icon="💳" fields='["id","name","state","employee_id","date_from","date_to","basic_wage","net_wage"]' columns='[{"key":"name","label":"كشف الراتب"},{"key":"employee_id","label":"الموظف","type":"many2one"},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","verify":"مراجعة","done":"منتهي","cancel":"ملغي"}},{"key":"date_from","label":"من","type":"date"},{"key":"date_to","label":"إلى","type":"date"},{"key":"basic_wage","label":"الراتب الأساسي","type":"currency"},{"key":"net_wage","label":"صافي الراتب","type":"currency"}]'
    />
  );
}
