import { OdooList } from '@/components/odoo/odoo-list';

export default function ProjectsPage() {
  return (
    <OdooList
      model="media.production"
      title="المشاريع والإنتاجات"
      icon="🎬"
      fields={['id', 'name', 'production_type', 'state', 'director_id', 'date_start', 'date_end', 'budget_total']}
      columns={[
        { key: 'name', label: 'اسم المشروع' },
        {
          key: 'production_type',
          label: 'النوع',
          type: 'badge',
          badgeMap: { film: 'فيلم', series: 'مسلسل', documentary: 'وثائقي', commercial: 'إعلان', short: 'قصير' },
        },
        {
          key: 'state',
          label: 'الحالة',
          type: 'badge',
          badgeMap: {
            draft: 'مسودة',
            pre_production: 'ما قبل الإنتاج',
            production: 'إنتاج',
            post_production: 'ما بعد الإنتاج',
            delivered: 'مسلّم',
            cancelled: 'ملغي',
          },
        },
        { key: 'director_id', label: 'المخرج', type: 'many2one' },
        { key: 'date_start', label: 'تاريخ البدء', type: 'date' },
        { key: 'budget_total', label: 'الميزانية', type: 'currency' },
      ]}
      createHref="/projects/new"
      detailHref={(id) => `/projects/${id}`}
      kanbanColumns={[
        { key: 'draft', label: 'مسودة', color: '#8d969e' },
        { key: 'pre_production', label: 'ما قبل الإنتاج', color: '#007bc2' },
        { key: 'production', label: 'إنتاج', color: '#00a87e' },
        { key: 'post_production', label: 'ما بعد الإنتاج', color: '#ec7e00' },
        { key: 'delivered', label: 'مسلّم', color: '#494fdf' },
      ]}
      kanbanGroupBy="state"
    />
  );
}
