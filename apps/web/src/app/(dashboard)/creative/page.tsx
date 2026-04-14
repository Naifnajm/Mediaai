import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.creative" title="الإبداع والسيناريو" icon="✍️" fields='["id","name","script_type","state","writer_id","version","page_count","scene_count"]' columns='[{"key":"name","label":"السيناريو"},{"key":"script_type","label":"النوع","type":"badge","badgeMap":{"screenplay":"سيناريو","treatment":"معالجة","outline":"مخطط","shooting_script":"سيناريو تصوير"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","review":"مراجعة","approved":"معتمد","locked":"مقفل"}},{"key":"writer_id","label":"الكاتب","type":"many2one"},{"key":"version","label":"الإصدار"},{"key":"page_count","label":"عدد الصفحات"},{"key":"scene_count","label":"عدد المشاهد"}]'
    />
  );
}
