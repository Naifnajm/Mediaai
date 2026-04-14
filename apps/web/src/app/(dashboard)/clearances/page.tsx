import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.clearances" title="التصاريح والموافقات" icon="✅" fields='["id","name","clearance_type","state","party_id","date_requested","fee"]' columns='[{"key":"name","label":"التصريح"},{"key":"clearance_type","label":"النوع","type":"badge","badgeMap":{"talent_release":"إخلاء ممثل","location_release":"إخلاء موقع","music_sync":"مزامنة موسيقى","archive":"أرشيف","trademark":"علامة تجارية","other":"أخرى"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"pending":"معلق","in_progress":"قيد التنفيذ","cleared":"تم","rejected":"مرفوض"}},{"key":"party_id","label":"الطرف","type":"many2one"},{"key":"date_requested","label":"تاريخ الطلب","type":"date"},{"key":"fee","label":"الرسوم","type":"currency"}]'
    />
  );
}
