'use client';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { odoo } from '@/lib/odoo/client';
import { Card, CardHeader, CardBody } from '@/components/ui/card';

const COLORS = ['#494fdf', '#00a87e', '#ec7e00', '#e23b4a', '#007bc2', '#191c1f'];

export function DashboardCharts() {
  const { data: budgetData } = useQuery({
    queryKey: ['budget-chart'],
    queryFn: async () => {
      const lines = await odoo.searchRead<{ department_id: [number, string] | false; approved: number; actual: number }>(
        'media.budget.line', [], ['department_id', 'approved', 'actual'], { limit: 50 }
      );
      // Group by department
      const map = new Map<string, { approved: number; actual: number }>();
      for (const line of lines) {
        const dept = line.department_id ? (line.department_id as [number, string])[1] : 'أخرى';
        const existing = map.get(dept) ?? { approved: 0, actual: 0 };
        map.set(dept, { approved: existing.approved + (line.approved ?? 0), actual: existing.actual + (line.actual ?? 0) });
      }
      return Array.from(map.entries()).slice(0, 6).map(([name, v]) => ({ name, ...v }));
    },
    staleTime: 120_000,
  });

  const { data: productionTypes } = useQuery({
    queryKey: ['production-types-chart'],
    queryFn: async () => {
      const prods = await odoo.searchRead<{ production_type: string }>(
        'media.production', [], ['production_type'], { limit: 100 }
      );
      const map: Record<string, number> = {};
      for (const p of prods) {
        const t = p.production_type ?? 'other';
        map[t] = (map[t] ?? 0) + 1;
      }
      const labels: Record<string, string> = { film: 'فيلم', series: 'مسلسل', documentary: 'وثائقي', commercial: 'إعلان', short: 'قصير', other: 'أخرى' };
      return Object.entries(map).map(([key, value]) => ({ name: labels[key] ?? key, value }));
    },
    staleTime: 120_000,
  });

  const hasBudget = (budgetData?.length ?? 0) > 0;
  const hasTypes = (productionTypes?.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      {/* Budget Bar Chart */}
      <Card>
        <CardHeader icon="💰" title="الميزانية حسب القسم" subtitle="معتمد مقابل فعلي" />
        <CardBody>
          {!hasBudget ? (
            <div className="flex items-center justify-center h-40 text-text-muted text-sm">
              لا توجد بيانات ميزانية بعد
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={budgetData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e8" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8d969e' }} />
                <YAxis tick={{ fontSize: 11, fill: '#8d969e' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e8', fontSize: 12 }}
                  cursor={{ fill: 'rgba(73,79,223,0.04)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <Bar dataKey="approved" name="معتمد" fill="#191c1f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="فعلي" fill="#494fdf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardBody>
      </Card>

      {/* Production Types Donut */}
      <Card>
        <CardHeader icon="🎬" title="توزيع أنواع الإنتاج" />
        <CardBody>
          {!hasTypes ? (
            <div className="flex items-center justify-center h-40 text-text-muted text-sm">
              لا توجد مشاريع بعد
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie
                    data={productionTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {productionTypes?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e8', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {productionTypes?.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-text-secondary">{item.name}</span>
                    <span className="text-xs font-semibold text-text-primary mr-auto">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
