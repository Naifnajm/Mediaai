import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.locations" title="المواقع" icon="📍" fields='["id","name","location_type","state","city","country_id","daily_rate","permit_status"]' columns='[{"key":"name","label":"الموقع"},{"key":"location_type","label":"النوع","type":"badge","badgeMap":{"studio":"استوديو","outdoor":"خارجي","practical":"عملي","set":"ديكور"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"scouted":"تم المعاينة","approved":"معتمد","booked":"محجوز","released":"منتهي"}},{"key":"city","label":"المدينة"},{"key":"country_id","label":"الدولة","type":"many2one"},{"key":"daily_rate","label":"الأجر اليومي","type":"currency"}]'
    />
  );
}
