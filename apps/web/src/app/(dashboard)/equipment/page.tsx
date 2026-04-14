import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.equipment" title="المعدات" icon="🎥" fields='["id","name","category","state","brand","model","daily_rate","vendor_id"]' columns='[{"key":"name","label":"المعدة"},{"key":"category","label":"الفئة","type":"badge","badgeMap":{"camera":"كاميرا","lens":"عدسة","lighting":"إضاءة","sound":"صوت","grip":"جريب","electric":"كهرباء","transport":"مواصلات","other":"أخرى"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"available":"متاح","rented":"مؤجر","maintenance":"صيانة","retired":"متقاعد"}},{"key":"brand","label":"الماركة"},{"key":"daily_rate","label":"الأجر اليومي","type":"currency"},{"key":"vendor_id","label":"المورد","type":"many2one"}]'
    />
  );
}
