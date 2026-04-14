import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="media.vfx" title="VFX وما بعد الإنتاج" icon="⚡" fields='["id","name","shot_code","state","department","supervisor_id","due_date","complexity"]' columns='[{"key":"shot_code","label":"رمز اللقطة"},{"key":"name","label":"الوصف"},{"key":"state","label":"الحالة","type":"badge","badgeMap":{"brief":"موجز","in_progress":"قيد التنفيذ","review":"مراجعة","approved":"معتمد","delivered":"مُسلّم"}},{"key":"department","label":"القسم","type":"badge","badgeMap":{"vfx":"VFX","cgi":"CGI","motion":"موشن","color":"تلوين","sound_design":"تصميم صوت"}},{"key":"supervisor_id","label":"المشرف","type":"many2one"},{"key":"due_date","label":"الموعد النهائي","type":"date"},{"key":"complexity","label":"التعقيد","type":"badge","badgeMap":{"simple":"بسيط","medium":"متوسط","complex":"معقد","hero":"هيرو"}}]'
    />
  );
}
