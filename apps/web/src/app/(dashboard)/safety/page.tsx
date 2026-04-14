import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.safety" title="السلامة والامتثال" icon="🛡️" fields='["id","name","document_type","state","responsible_id","date_issue","date_expiry","risk_level"]' columns='[{"key":"name","label":"الوثيقة"},{"key":"document_type","label":"النوع","type":"badge","badgeMap":{"risk_assessment":"تقييم مخاطر","safety_plan":"خطة سلامة","incident_report":"تقرير حادث","permit":"تصريح","certificate":"شهادة"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","review":"مراجعة","approved":"معتمد","expired":"منتهي"}},{"key":"responsible_id","label":"المسؤول","type":"many2one"},{"key":"risk_level","label":"مستوى الخطر","type":"badge","badgeMap":{"low":"منخفض","medium":"متوسط","high":"مرتفع","critical":"حرج"}},{"key":"date_expiry","label":"تاريخ الانتهاء","type":"date"}]'
    />
  );
}
