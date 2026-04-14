import { OdooList } from '@/components/odoo/odoo-list';

export default function Page() {
  return (
    <OdooList
      model="hr.employee" title="الموارد البشرية" icon="👤" fields='["id","name","job_title","department_id","job_id","work_email","mobile_phone"]' columns='[{"key":"name","label":"الاسم"},{"key":"job_title","label":"المسمى الوظيفي"},{"key":"department_id","label":"القسم","type":"many2one"},{"key":"job_id","label":"الوظيفة","type":"many2one"},{"key":"work_email","label":"البريد"},{"key":"mobile_phone","label":"الجوال"}]'
    />
  );
}
