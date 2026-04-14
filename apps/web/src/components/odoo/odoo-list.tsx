'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { odoo } from '@/lib/odoo/client';
import { Button } from '@/components/ui/button';
import { Badge, getStateVariant } from '@/components/ui/badge';
import { PageSpinner } from '@/components/ui/spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { clsx } from 'clsx';

export type ViewMode = 'list' | 'kanban';

interface ColumnDef {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'currency' | 'many2one';
  badgeMap?: Record<string, string>;
}

interface OdooListProps {
  model: string;
  title: string;
  icon?: string;
  domain?: unknown[];
  fields: string[];
  columns: ColumnDef[];
  createHref?: string;
  detailHref?: (id: number) => string;
  kanbanGroupBy?: string;
  kanbanColumns?: { key: string; label: string; color: string }[];
}

const PAGE_SIZE = 20;

export function OdooList({
  model, title, icon, domain = [], fields, columns,
  createHref, detailHref, kanbanGroupBy, kanbanColumns,
}: OdooListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const effectiveDomain: unknown[] = search
    ? [...domain, ['display_name', 'ilike', search]]
    : domain;

  const { data: records, isLoading, isFetching } = useQuery({
    queryKey: ['odoo', model, effectiveDomain, page, fields],
    queryFn: () => odoo.searchRead<Record<string, unknown>>(model, effectiveDomain, fields, {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
  });

  const { data: total } = useQuery({
    queryKey: ['odoo', model, 'count', effectiveDomain],
    queryFn: () => odoo.searchCount(model, effectiveDomain),
  });

  const totalPages = Math.ceil((total ?? 0) / PAGE_SIZE);

  const renderCell = (record: Record<string, unknown>, col: ColumnDef) => {
    const raw = record[col.key];
    if (raw === undefined || raw === null || raw === false) return <span className="text-text-muted">—</span>;

    if (col.type === 'badge') {
      const val = String(raw);
      const label = col.badgeMap?.[val] ?? val;
      return <Badge variant={getStateVariant(val)}>{label}</Badge>;
    }
    if (col.type === 'many2one' && Array.isArray(raw)) {
      return <span>{(raw as [number, string])[1]}</span>;
    }
    if (col.type === 'date') {
      return <span className="text-text-secondary">{String(raw).slice(0, 10)}</span>;
    }
    if (col.type === 'currency') {
      return (
        <span className="font-semibold">
          {Number(raw).toLocaleString('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 })}
        </span>
      );
    }
    return <span className="truncate max-w-[200px]">{String(raw)}</span>;
  };

  if (isLoading) return <PageSpinner />;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-display tracking-tight">{title}</h1>
            {total !== undefined && (
              <p className="text-text-muted text-xs mt-0.5">{total.toLocaleString('ar')} سجل</p>
            )}
          </div>
        </div>
        {createHref && (
          <Button onClick={() => router.push(createHref)} icon={<span>+</span>}>
            إضافة جديد
          </Button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="بحث..."
            className="w-full bg-white border border-border rounded-md pr-9 pl-4 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-surface rounded-md p-1 gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={clsx('px-3 py-1.5 rounded text-xs font-medium transition-all', viewMode === 'list' ? 'bg-white text-text-primary' : 'text-text-muted hover:text-text-primary')}
          >
            ☰ قائمة
          </button>
          {kanbanColumns && (
            <button
              onClick={() => setViewMode('kanban')}
              className={clsx('px-3 py-1.5 rounded text-xs font-medium transition-all', viewMode === 'kanban' ? 'bg-white text-text-primary' : 'text-text-muted hover:text-text-primary')}
            >
              ⊞ كانبان
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <>
          {(records?.length ?? 0) === 0 ? (
            <EmptyState icon="📭" title="لا توجد سجلات" description="لم يتم العثور على نتائج" action={createHref ? <Button onClick={() => router.push(createHref)}>إضافة أول سجل</Button> : undefined} />
          ) : (
            <div className="bg-white rounded-lg border border-border overflow-hidden">
              <div className={clsx('transition-opacity', isFetching && 'opacity-60')}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-surface/50">
                      <th className="px-4 py-3 text-right w-10">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selected.size === records?.length && (records?.length ?? 0) > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelected(new Set(records?.map((r) => r['id'] as number)));
                            else setSelected(new Set());
                          }}
                        />
                      </th>
                      {columns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wide whitespace-nowrap">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records?.map((record, i) => (
                      <motion.tr
                        key={record['id'] as number}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => detailHref && router.push(detailHref(record['id'] as number))}
                        className={clsx(
                          'border-b border-border last:border-0 transition-colors',
                          detailHref && 'cursor-pointer hover:bg-surface/50',
                          selected.has(record['id'] as number) && 'bg-accent/5'
                        )}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selected.has(record['id'] as number)}
                            onChange={(e) => {
                              const id = record['id'] as number;
                              const next = new Set(selected);
                              if (e.target.checked) next.add(id); else next.delete(id);
                              setSelected(next);
                            }}
                          />
                        </td>
                        {columns.map((col) => (
                          <td key={col.key} className="px-4 py-3 text-[13.5px] text-text-primary">
                            {renderCell(record, col)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>
                صفحة {page + 1} من {totalPages} · {total} سجل
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                  السابق
                </Button>
                <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
                  التالي
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        // Kanban View
        <KanbanView
          records={records ?? []}
          columns={kanbanColumns ?? []}
          groupBy={kanbanGroupBy ?? 'state'}
          detailHref={detailHref}
        />
      )}
    </div>
  );
}

// ── Kanban View ───────────────────────────────────────
function KanbanView({
  records, columns, groupBy, detailHref,
}: {
  records: Record<string, unknown>[];
  columns: { key: string; label: string; color: string }[];
  groupBy: string;
  detailHref?: (id: number) => string;
}) {
  const router = useRouter();

  const grouped = columns.map((col) => ({
    ...col,
    records: records.filter((r) => r[groupBy] === col.key),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {grouped.map((col) => (
        <div key={col.key} className="flex-shrink-0 w-64">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">{col.label}</span>
            <Badge variant="default">{col.records.length}</Badge>
          </div>
          <div className="space-y-2">
            {col.records.map((record) => (
              <motion.div
                key={record['id'] as number}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => detailHref && router.push(detailHref(record['id'] as number))}
                className={clsx(
                  'bg-white rounded-md border border-border p-4',
                  detailHref && 'cursor-pointer hover:border-accent/30 transition-colors'
                )}
              >
                <p className="text-[13px] font-semibold text-text-primary leading-snug">
                  {record['display_name'] as string ?? record['name'] as string ?? `#${record['id']}`}
                </p>
                {record['state'] && (
                  <div className="mt-2">
                    <Badge variant={getStateVariant(record['state'] as string)}>
                      {record['state'] as string}
                    </Badge>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
