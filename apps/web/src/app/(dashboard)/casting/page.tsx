import { OdooList } from '@/components/odoo/odoo-list';

export default function CastingPage() {
  return (
    <OdooList
      model="media.casting"
      title="الكاستينج"
      icon="🎭"
      fields={['id', 'name', 'role_name', 'role_type', 'state', 'actor_id', 'audition_date', 'rate']}
      columns={[
        { key: 'role_name', label: 'الدور' },
        { key: 'role_type', label: 'نوع الدور', type: 'badge', badgeMap: { lead: 'بطولة', supporting: 'مساعد', featured: 'ظهور', extra: 'كومبارس' } },
        { key: 'state', label: 'الحالة', type: 'badge', badgeMap: { open: 'مفتوح', shortlisted: 'مختصر', selected: 'مختار', contracted: 'متعاقد' } },
        { key: 'actor_id', label: 'الممثل', type: 'many2one' },
        { key: 'audition_date', label: 'تاريخ التجربة', type: 'date' },
        { key: 'rate', label: 'الأجر', type: 'currency' },
      ]}
      createHref="/casting/new"
      detailHref={(id) => `/casting/${id}`}
      kanbanColumns={[
        { key: 'open', label: 'مفتوح', color: '#8d969e' },
        { key: 'shortlisted', label: 'مختصر', color: '#007bc2' },
        { key: 'selected', label: 'مختار', color: '#00a87e' },
        { key: 'contracted', label: 'متعاقد', color: '#494fdf' },
      ]}
      kanbanGroupBy="state"
    />
  );
}
