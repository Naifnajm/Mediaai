import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.crm" title="CRM — العملاء والشركاء" icon="💼" fields='["id","name","lead_type","state","partner_id","probability","expected_revenue","user_id"]' columns='[{"key":"name","label":"العميل/الفرصة"},{"key":"lead_type","label":"النوع","type":"badge","badgeMap":{"client":"عميل","broadcaster":"قناة","distributor":"موزع","sponsor":"راعي","talent_agency":"وكالة"}},{"key":"state","label":"المرحلة","type":"badge","badgeMap":{"new":"جديد","qualified":"مؤهل","proposal":"عرض","negotiation":"تفاوض","won":"رُبح","lost":"خُسر"}},{"key":"partner_id","label":"الشريك","type":"many2one"},{"key":"probability","label":"الاحتمال %"},{"key":"expected_revenue","label":"الإيراد المتوقع","type":"currency"}]'
    />
  );
}
