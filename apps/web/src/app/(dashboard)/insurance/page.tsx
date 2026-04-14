import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.insurance" title="التأمين" icon="☂️" fields='["id","name","policy_type","state","insurer_id","policy_number","date_start","date_end","coverage_amount"]' columns='[{"key":"name","label":"الوثيقة"},{"key":"policy_type","label":"النوع","type":"badge","badgeMap":{"production":"إنتاج","equipment":"معدات","liability":"مسؤولية","workers_comp":"عمال"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","active":"نشط","expired":"منتهي","claimed":"مُطالب"}},{"key":"insurer_id","label":"المؤمّن","type":"many2one"},{"key":"date_start","label":"البداية","type":"date"},{"key":"date_end","label":"الانتهاء","type":"date"},{"key":"coverage_amount","label":"مبلغ التأمين","type":"currency"}]'
    />
  );
}
