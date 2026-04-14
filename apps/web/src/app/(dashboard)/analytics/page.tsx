import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.analytics.kpi" title="التحليلات والمؤشرات" icon="📈" fields='["id","production_id","period","views","revenue","budget_utilization","schedule_adherence","platform"]' columns='[{"key":"production_id","label":"المشروع","type":"many2one"},{"key":"period","label":"الفترة"},{"key":"views","label":"المشاهدات"},{"key":"revenue","label":"الإيرادات","type":"currency"},{"key":"budget_utilization","label":"استخدام الميزانية %"},{"key":"schedule_adherence","label":"الالتزام بالجدول %"},{"key":"platform","label":"المنصة"}]'
    />
  );
}
