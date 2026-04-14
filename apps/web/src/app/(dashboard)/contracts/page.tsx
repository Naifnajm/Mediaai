import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.contract" title="العقود" icon="📄" fields='["id","name","contract_type","state","party_id","date_start","date_end","amount"]' columns='[{"key":"name","label":"العقد"},{"key":"contract_type","label":"النوع","type":"badge","badgeMap":{"crew":"طاقم","talent":"موهبة","location":"موقع","equipment":"معدات","service":"خدمة","distribution":"توزيع"}},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"draft":"مسودة","sent":"مُرسل","signed":"موقّع","active":"نشط","expired":"منتهي","terminated":"مُنهى"}},{"key":"party_id","label":"الطرف","type":"many2one"},{"key":"date_start","label":"البداية","type":"date"},{"key":"amount","label":"القيمة","type":"currency"}]'
    />
  );
}
