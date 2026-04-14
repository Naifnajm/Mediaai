import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.crew" title="الطاقم" icon="👷" fields='["id","name","department","role","state","employee_id","date_start","daily_rate"]' columns='[{"key":"name","label":"الاسم"},{"key":"department","label":"القسم","type":"badge","badgeMap":{"direction":"إخراج","camera":"كاميرا","lighting":"إضاءة","sound":"صوت","art":"فن","production":"إنتاج","post":"بوست","vfx":"VFX","other":"أخرى"}},{"key":"role","label":"الوظيفة"},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","confirmed":"مؤكد","active":"نشط","released":"منتهي"}},{"key":"employee_id","label":"الموظف","type":"many2one"},{"key":"date_start","label":"تاريخ البدء","type":"date"},{"key":"daily_rate","label":"الراتب اليومي","type":"currency"}]'
    />
  );
}
