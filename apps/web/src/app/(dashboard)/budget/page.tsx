'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { odoo } from '@/lib/odoo/client';
import { Card, CardHeader, CardBody } from '@/components/ui/card';
import { PageSpinner } from '@/components/ui/spinner';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { MediaBudgetLine } from '@mediaos/types';

function VarianceCell({ value, pct }: { value: number; pct: number }) {
  const isOver = value < 0;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[11px] font-semibold ${isOver ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
      {isOver ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function fmt(v: number) {
  return v.toLocaleString('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 });
}

export default function BudgetPage() {
  const [selectedBudget, setSelectedBudget] = useState<number | null>(null);

  const { data: budgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => odoo.searchRead<{ id: number; name: string; state: string; total_approved: number; total_actual: number; variance_pct: number }>(
      'media.budget', [], ['id', 'name', 'state', 'total_approved', 'total_actual', 'variance_pct'], { limit: 20 }
    ),
  });

  const { data: lines, isLoading } = useQuery({
    queryKey: ['budget-lines', selectedBudget],
    queryFn: () => odoo.searchRead<MediaBudgetLine>(
      'media.budget.line',
      selectedBudget ? [['budget_id', '=', selectedBudget]] : [],
      ['id', 'name', 'department_id', 'approved', 'actual', 'estimated', 'variance', 'variance_pct'],
      { order: 'variance_pct asc', limit: 100 }
    ),
  });

  const chartData = lines?.slice(0, 8).map((l) => ({ name: l.name?.slice(0, 12) ?? `${l.id}`, معتمد: l.approved, فعلي: l.actual })) ?? [];

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary font-display tracking-tight">💰 الميزانية</h1>
        <p className="text-text-muted text-sm mt-0.5">تحليل الفارق: معتمد مقابل فعلي</p>
      </div>

      {(budgets?.length ?? 0) > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedBudget(null)} className={`px-3 py-1.5 rounded-pill text-xs font-medium border transition-all ${selectedBudget === null ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary hover:border-dark'}`}>الكل</button>
          {budgets?.map((b) => (
            <button key={b.id} onClick={() => setSelectedBudget(b.id)} className={`px-3 py-1.5 rounded-pill text-xs font-medium border transition-all ${selectedBudget === b.id ? 'bg-dark text-white border-dark' : 'border-border text-text-secondary'}`}>{b.name}</button>
          ))}
        </div>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader icon="📊" title="مقارنة بنود الميزانية" />
          <CardBody>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e8" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8d969e' }} />
                <YAxis tick={{ fontSize: 10, fill: '#8d969e' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e4e4e8', fontSize: 12 }} cursor={{ fill: 'rgba(73,79,223,0.04)' }} />
                <Bar dataKey="معتمد" fill="#191c1f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="فعلي" fill="#494fdf" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon="📋" title="تفاصيل البنود" subtitle="مرتبة حسب الفارق" />
        <CardBody className="p-0">
          {isLoading ? <PageSpinner /> : (lines?.length ?? 0) === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">لا توجد بنود ميزانية</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    {['البند', 'القسم', 'المعتمد', 'الفعلي', 'المتوقع', 'الفارق', '%'].map((h) => (
                      <th key={h} className="px-5 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines?.map((line, i) => (
                    <motion.tr key={line.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border last:border-0 hover:bg-surface/30">
                      <td className="px-5 py-3 font-medium text-text-primary">{line.name}</td>
                      <td className="px-5 py-3 text-text-secondary text-xs">{Array.isArray(line.department_id) ? (line.department_id as [number, string])[1] : '—'}</td>
                      <td className="px-5 py-3 text-text-secondary">{fmt(line.approved)}</td>
                      <td className="px-5 py-3 font-semibold text-text-primary">{fmt(line.actual)}</td>
                      <td className="px-5 py-3 text-text-secondary">{fmt(line.estimated)}</td>
                      <td className="px-5 py-3"><span className={line.variance >= 0 ? 'text-success font-semibold' : 'text-danger font-semibold'}>{line.variance >= 0 ? '+' : ''}{fmt(line.variance)}</span></td>
                      <td className="px-5 py-3"><VarianceCell value={line.variance} pct={line.variance_pct} /></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
