import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.wrap" title="إجراءات الإنهاء" icon="🎁" fields='["id","name","state","production_id","responsible_id","wrap_date"]' columns='[{"key":"name","label":"الإنهاء"},{"key":"production_id","label":"المشروع","type":"many2one"},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","in_progress":"قيد التنفيذ","done":"منتهي"}},{"key":"responsible_id","label":"المسؤول","type":"many2one"},{"key":"wrap_date","label":"تاريخ الإنهاء","type":"date"}]'
    />
  );
}
