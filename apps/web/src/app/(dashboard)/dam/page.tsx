'use client';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { odoo } from '@/lib/odoo/client';
import { useUiStore } from '@/store/ui.store';
import { PageSpinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';
import type { MediaDamFolder, MediaDamAsset } from '@mediaos/types';

const typeFilters = [
  { key: 'all', label: 'الكل' },
  { key: 'image', label: '🖼️ صور' },
  { key: 'video', label: '🎬 فيديو' },
  { key: 'audio', label: '🎵 صوت' },
  { key: 'document', label: '📄 مستندات' },
  { key: 'archive', label: '🗜️ مضغوط' },
];

function assetIcon(type: string): string {
  const icons: Record<string, string> = { image: '🖼️', video: '🎬', audio: '🎵', document: '📄', archive: '🗜️', other: '📎' };
  return icons[type] ?? '📎';
}

function formatSize(bytes: number): string {
  if (!bytes) return '—';
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

export default function DamPage() {
  const [activeFolder, setActiveFolder] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const addToast = useUiStore((s) => s.addToast);
  const qc = useQueryClient();

  const { data: folders } = useQuery({
    queryKey: ['dam-folders'],
    queryFn: () => odoo.searchRead<MediaDamFolder>('media.dam.folder', [], ['id', 'name', 'parent_id', 'asset_count'], { order: 'name asc' }),
  });

  const domain: unknown[] = [];
  if (activeFolder !== null) domain.push(['folder_id', '=', activeFolder]);
  if (typeFilter !== 'all') domain.push(['asset_type', '=', typeFilter]);
  if (search) domain.push(['name', 'ilike', search]);

  const { data: assets, isLoading } = useQuery({
    queryKey: ['dam-assets', activeFolder, typeFilter, search],
    queryFn: () =>
      odoo.searchRead<MediaDamAsset>(
        'media.dam.asset',
        domain,
        ['id', 'name', 'asset_type', 'file_size', 'mimetype', 'create_date'],
        { limit: 60, order: 'create_date desc' }
      ),
  });

  const onDrop = useCallback(
    async (files: File[]) => {
      if (uploading) return;
      setUploading(true);
      try {
        for (const file of files) {
          // Create DAM asset record first
          const assetId = await odoo.create('media.dam.asset', {
            name: file.name,
            asset_type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'document',
            folder_id: activeFolder ?? false,
            mimetype: file.type,
            file_size: file.size,
          });
          await odoo.uploadAttachment(file, 'media.dam.asset', assetId);
        }
        await qc.invalidateQueries({ queryKey: ['dam-assets'] });
        addToast({ type: 'success', message: `تم رفع ${files.length} ملف` });
      } catch (err) {
        addToast({ type: 'error', message: err instanceof Error ? err.message : 'فشل الرفع' });
      } finally {
        setUploading(false);
      }
    },
    [activeFolder, uploading, qc, addToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    disabled: uploading,
  });

  const rootFolders = folders?.filter((f) => !f.parent_id) ?? [];

  return (
    <div className="flex gap-4 h-[calc(100vh-140px)] animate-fade-in">
      {/* Sidebar — Folder Tree */}
      <aside className="w-52 flex-shrink-0">
        <div className="bg-white rounded-lg border border-border p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">المجلدات</h3>
            <button className="w-5 h-5 flex items-center justify-center text-text-muted hover:text-accent text-sm">+</button>
          </div>

          <button
            onClick={() => setActiveFolder(null)}
            className={clsx('w-full text-right px-2 py-1.5 rounded text-[13px] mb-1 transition-colors', activeFolder === null ? 'bg-dark text-white' : 'text-text-secondary hover:bg-surface')}
          >
            📁 كل الملفات
          </button>

          {rootFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={clsx('w-full text-right px-2 py-1.5 rounded text-[13px] mb-0.5 flex items-center justify-between transition-colors', activeFolder === folder.id ? 'bg-dark text-white' : 'text-text-secondary hover:bg-surface')}
            >
              <span className="truncate">📁 {folder.name}</span>
              {folder.asset_count ? <span className="text-[10px] opacity-60">{folder.asset_count}</span> : null}
            </button>
          ))}
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث في الملفات..."
              className="w-full bg-white border border-border rounded-md pr-9 pl-4 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          {/* Type filters */}
          <div className="flex gap-1 bg-surface rounded-md p-1 flex-wrap">
            {typeFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key)}
                className={clsx('px-2.5 py-1.5 rounded text-xs font-medium transition-all whitespace-nowrap', typeFilter === f.key ? 'bg-white text-text-primary' : 'text-text-muted hover:text-text-primary')}
              >
                {f.label}
              </button>
            ))}
          </div>

          <label className="cursor-pointer">
            <Button icon={<span>↑</span>} size="sm" loading={uploading}>
              {uploading ? 'جاري الرفع...' : 'رفع ملفات'}
            </Button>
            <input {...getInputProps()} className="hidden" />
          </label>
        </div>

        {/* Drop Zone + Grid */}
        <div
          {...getRootProps()}
          className={clsx('flex-1 overflow-y-auto rounded-lg border-2 border-dashed transition-all p-4', isDragActive ? 'border-accent bg-accent/4' : 'border-transparent')}
        >
          {isDragActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg z-10">
              <div className="text-center">
                <p className="text-4xl mb-2">📥</p>
                <p className="text-lg font-semibold text-accent">أفلت الملفات هنا</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <PageSpinner />
          ) : (assets?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-3">📭</span>
              <p className="text-text-primary font-medium">لا توجد ملفات</p>
              <p className="text-text-muted text-sm mt-1">اسحب الملفات هنا أو انقر على رفع ملفات</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {assets?.map((asset, i) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-white border border-border rounded-md p-3 cursor-pointer hover:border-accent/30 transition-colors text-center group"
                >
                  <div className="text-3xl mb-2">{assetIcon(asset.asset_type)}</div>
                  <p className="text-[11px] font-medium text-text-primary truncate">{asset.name}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{formatSize(asset.file_size ?? 0)}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
