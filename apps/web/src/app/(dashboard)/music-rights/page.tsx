import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.music.rights" title="حقوق الموسيقى" icon="🎵" fields='["id","track_title","artist","state","license_type","territory","license_fee","date_start"]' columns='[{"key":"track_title","label":"المقطوعة"},{"key":"artist","label":"الفنان"},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"searching":"بحث","negotiating":"تفاوض","licensed":"مُرخّص","rejected":"مرفوض"}},{"key":"license_type","label":"نوع الترخيص","type":"badge","badgeMap":{"sync":"مزامنة","master":"ماستر","both":"كلاهما"}},{"key":"territory","label":"الإقليم"},{"key":"license_fee","label":"رسوم الترخيص","type":"currency"}]'
    />
  );
}
