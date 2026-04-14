'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { odoo } from '@/lib/odoo/client';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge, getStateVariant } from '@/components/ui/badge';
import { PageSpinner } from '@/components/ui/spinner';
import { format, startOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface ScheduleLine {
  id: number;
  name?: string;
  date: string;
  call_time?: string;
  wrap_time?: string;
  location_id?: [number, string] | false;
  int_ext?: string;
  day_night?: string;
  state?: string;
  pages?: number;
}

const stateColors: Record<string, string> = {
  draft: 'border-border',
  confirmed: 'border-success/30 bg-success/4',
  shot: 'border-dark/20 bg-dark/4',
  postponed: 'border-warning/30 bg-warning/4',
};

const stateLabels: Record<string, string> = {
  draft: 'مسودة', confirmed: 'مؤكد', shot: 'تم التصوير', postponed: 'مؤجل',
};

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 0 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const { data: lines, isLoading } = useQuery({
    queryKey: ['schedule', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () =>
      odoo.searchRead<ScheduleLine>(
        'media.schedule.line',
        [
          ['date', '>=', format(weekStart, 'yyyy-MM-dd')],
          ['date', '<=', format(addDays(weekStart, 6), 'yyyy-MM-dd')],
        ],
        ['id', 'name', 'date', 'call_time', 'wrap_time', 'location_id', 'int_ext', 'day_night', 'state', 'pages'],
        { order: 'date asc, call_time asc', limit: 200 }
      ),
  });

  const byDate = weekDays.reduce<Record<string, ScheduleLine[]>>((acc, day) => {
    const key = format(day, 'yyyy-MM-dd');
    acc[key] = (lines ?? []).filter((l) => l.date === key);
    return acc;
  }, {});

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display tracking-tight">🎬 Strip Board</h1>
          <p className="text-text-muted text-sm mt-0.5">جدول التصوير الأسبوعي</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(subWeeks(weekStart, 1))}
            className="px-3 py-2 bg-white border border-border rounded-md text-sm hover:bg-surface"
          >
            ← السابق
          </button>
          <span className="px-4 py-2 text-sm font-medium text-text-primary bg-white border border-border rounded-md">
            {format(weekStart, "d MMMM", { locale: arSA })} — {format(addDays(weekStart, 6), "d MMMM yyyy", { locale: arSA })}
          </span>
          <button
            onClick={() => setWeekStart(addWeeks(weekStart, 1))}
            className="px-3 py-2 bg-white border border-border rounded-md text-sm hover:bg-surface"
          >
            التالي →
          </button>
        </div>
      </div>

      {/* Strip Board Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const dayLines = byDate[key] ?? [];
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <div key={key} className="min-w-0">
              {/* Day Header */}
              <div className={`text-center mb-2 py-2 rounded-md ${isToday ? 'bg-dark text-white' : 'bg-surface text-text-secondary'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wide">
                  {format(day, 'EEE', { locale: arSA })}
                </p>
                <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-text-primary'}`}>
                  {format(day, 'd')}
                </p>
              </div>

              {/* Scene Cards */}
              <div className="space-y-1.5 min-h-[120px]">
                {dayLines.length === 0 ? (
                  <div className="border-2 border-dashed border-border rounded-md p-2 text-center text-text-muted text-[10px]">
                    يوم راحة
                  </div>
                ) : (
                  dayLines.map((line) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-md p-2 text-[11px] ${stateColors[line.state ?? 'draft'] ?? 'border-border'}`}
                    >
                      {line.call_time && (
                        <p className="font-bold text-accent mb-0.5">{line.call_time.slice(0, 5)}</p>
                      )}
                      <p className="font-semibold text-text-primary leading-tight truncate">
                        {line.name ?? `مشهد ${line.id}`}
                      </p>
                      {line.location_id && typeof line.location_id !== 'boolean' && (
                        <p className="text-text-muted truncate">{line.location_id[1]}</p>
                      )}
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {line.int_ext && (
                          <span className="bg-dark/8 text-text-secondary px-1 rounded text-[9px]">{line.int_ext}</span>
                        )}
                        {line.day_night && (
                          <span className="bg-dark/8 text-text-secondary px-1 rounded text-[9px]">{line.day_night === 'DAY' ? '☀' : '🌙'}</span>
                        )}
                        {line.state && (
                          <Badge variant={getStateVariant(line.state)} className="text-[9px] px-1 py-0">
                            {stateLabels[line.state] ?? line.state}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Day total */}
              {dayLines.length > 0 && (
                <p className="text-center text-[10px] text-text-muted mt-1">
                  {dayLines.length} مشهد
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
