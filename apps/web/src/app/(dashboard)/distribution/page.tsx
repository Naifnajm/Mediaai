import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.distribution" title="التوزيع" icon="📡" fields='["id","name","platform","state","distributor_id","territory","date_release","minimum_guarantee"]' columns='[{"key":"name","label":"اسم الاتفاقية"},{"key":"platform","label":"المنصة","type":"badge","badgeMap":{"cinema":"سينما","streaming":"ستريمينج","broadcast":"بث","satellite":"قمر صناعي","dvd":"DVD","airline":"طيران","other":"أخرى"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"negotiating":"تفاوض","signed":"موقّع","active":"نشط","expired":"منتهي"}},{"key":"distributor_id","label":"الموزع","type":"many2one"},{"key":"territory","label":"الإقليم"},{"key":"date_release","label":"تاريخ الإصدار","type":"date"},{"key":"minimum_guarantee","label":"الحد الأدنى","type":"currency"}]'
    />
  );
}
