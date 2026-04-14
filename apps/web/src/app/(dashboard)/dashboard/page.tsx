'use client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { odoo } from '@/lib/odoo/client';
import { Card, CardHeader, CardBody } from '@/components/ui/card';
import { Badge, getStateVariant } from '@/components/ui/badge';
import { PageSpinner } from '@/components/ui/spinner';
import { DashboardCharts } from '@/components/charts/dashboard-charts';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

// ── KPI Card ─────────────────────────────────────────
function KpiCard({ icon, label, value, sub, trend }: {
  icon: string; label: string; value: string | number; sub?: string; trend?: 'up' | 'down';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-border p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={trend === 'up' ? 'text-success text-xs font-semibold' : 'text-danger text-xs font-semibold'}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-text-primary font-display tracking-tight">{value}</div>
      <div className="text-[13px] text-text-muted mt-1">{label}</div>
      {sub && <div className="text-[11px] text-text-muted mt-0.5">{sub}</div>}
    </motion.div>
  );
}

// ── Recent Activity Item ──────────────────────────────
function ActivityItem({ icon, title, sub, time }: { icon: string; title: string; sub?: string; time?: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <span className="text-base mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-text-primary truncate">{title}</p>
        {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
      </div>
      {time && <span className="text-xs text-text-muted flex-shrink-0">{time}</span>}
    </div>
  );
}

export default function DashboardPage() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: async () => {
      const [productions, crew, scheduleToday, budgetAlerts, pendingContracts, activities] = await Promise.all([
        odoo.searchCount('media.production', [['state', 'not in', ['cancelled', 'delivered']]]),
        odoo.searchCount('media.crew', [['state', '=', 'active']]),
        odoo.searchRead('media.schedule.line', [['date', '=', today]], ['id', 'name', 'location_id', 'call_time'], { limit: 10 }),
        odoo.searchCount('media.budget.line', [['variance_pct', '<', -10]]),
        odoo.searchCount('media.contract', [['state', 'in', ['draft', 'sent']]]),
        odoo.searchRead('mail.activity', [['date_deadline', '<=', today]], ['id', 'summary', 'res_model', 'user_id', 'date_deadline'], { limit: 5 }),
      ]);
      return { productions, crew, scheduleToday, budgetAlerts, pendingContracts, activities };
    },
    staleTime: 60_000,
  });

  const { data: recentProductions } = useQuery({
    queryKey: ['recent-productions'],
    queryFn: () => odoo.searchRead<{ id: number; name: string; state: string; production_type: string; date_start: string }>(
      'media.production', [], ['id', 'name', 'state', 'production_type', 'date_start'], { limit: 5 }
    ),
  });

  const { data: recentContracts } = useQuery({
    queryKey: ['recent-contracts'],
    queryFn: () => odoo.searchRead<{ id: number; name: string; state: string; contract_type: string; amount: number }>(
      'media.contract', [], ['id', 'name', 'state', 'contract_type', 'amount'], { limit: 5 }
    ),
  });

  if (isLoading) return <PageSpinner />;

  const typeLabels: Record<string, string> = {
    film: 'فيلم', series: 'مسلسل', documentary: 'وثائقي', commercial: 'إعلان', short: 'قصير',
    crew: 'طاقم', talent: 'موهبة', location: 'موقع', equipment: 'معدات', service: 'خدمة',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-text-primary font-display tracking-tight">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">
          {format(new Date(), 'EEEE، d MMMM yyyy', { locale: arSA })}
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon="🎬" label="مشاريع نشطة" value={kpis?.productions ?? 0} trend="up" />
        <KpiCard icon="👷" label="طاقم فعال" value={kpis?.crew ?? 0} />
        <KpiCard icon="📅" label="مشاهد اليوم" value={kpis?.scheduleToday?.length ?? 0} sub={`${today}`} />
        <KpiCard icon="⚠️" label="تجاوزات الميزانية" value={kpis?.budgetAlerts ?? 0} trend={kpis?.budgetAlerts ? 'down' : undefined} />
      </div>

      {/* Charts + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DashboardCharts />
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader icon="📅" title="جدول اليوم" subtitle={`${kpis?.scheduleToday?.length ?? 0} مشهد`} />
          <CardBody className="p-0">
            {(kpis?.scheduleToday?.length ?? 0) === 0 ? (
              <p className="text-text-muted text-sm text-center py-8">لا يوجد تصوير اليوم</p>
            ) : (
              <div>
                {kpis?.scheduleToday?.map((scene: { id: number; name?: string; call_time?: string; location_id?: [number, string] | false }) => (
                  <div key={scene.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0">
                    <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center text-accent text-xs font-bold">
                      {scene.call_time?.slice(0, 5) ?? '--'}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-text-primary">{scene.name ?? `مشهد ${scene.id}`}</p>
                      {scene.location_id && typeof scene.location_id !== 'boolean' && (
                        <p className="text-xs text-text-muted">{scene.location_id[1]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Productions */}
        <Card>
          <CardHeader icon="🎬" title="آخر المشاريع" />
          <CardBody className="p-0">
            {(recentProductions?.length ?? 0) === 0 ? (
              <p className="text-text-muted text-sm text-center py-6">لا توجد مشاريع</p>
            ) : (
              <div>
                {recentProductions?.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary truncate">{p.name}</p>
                      <p className="text-xs text-text-muted">{typeLabels[p.production_type] ?? p.production_type}</p>
                    </div>
                    <Badge variant={getStateVariant(p.state)}>
                      {p.state === 'pre_production' ? 'ما قبل الإنتاج' :
                        p.state === 'post_production' ? 'ما بعد الإنتاج' :
                        p.state === 'production' ? 'إنتاج' :
                        p.state === 'draft' ? 'مسودة' :
                        p.state === 'delivered' ? 'مسلّم' : p.state}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Contracts */}
        <Card>
          <CardHeader icon="📄" title="آخر العقود" />
          <CardBody className="p-0">
            {(recentContracts?.length ?? 0) === 0 ? (
              <p className="text-text-muted text-sm text-center py-6">لا توجد عقود</p>
            ) : (
              <div>
                {recentContracts?.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3 border-b border-border last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary truncate">{c.name}</p>
                      <p className="text-xs text-text-muted">{typeLabels[c.contract_type] ?? c.contract_type}</p>
                    </div>
                    <Badge variant={getStateVariant(c.state)}>
                      {c.state === 'draft' ? 'مسودة' : c.state === 'signed' ? 'موقّع' : c.state === 'active' ? 'نشط' : c.state}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Overdue Activities */}
        <Card>
          <CardHeader icon="⚡" title="أنشطة عاجلة" />
          <CardBody className="p-0">
            {(kpis?.activities?.length ?? 0) === 0 ? (
              <p className="text-text-muted text-sm text-center py-6">لا توجد أنشطة متأخرة</p>
            ) : (
              <div>
                {kpis?.activities?.map((a: { id: number; summary?: string; date_deadline: string; res_model?: string }) => (
                  <ActivityItem
                    key={a.id}
                    icon="📌"
                    title={a.summary ?? 'نشاط'}
                    sub={a.res_model}
                    time={a.date_deadline}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
