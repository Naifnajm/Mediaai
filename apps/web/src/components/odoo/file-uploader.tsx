'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { odoo } from '@/lib/odoo/client';
import { useUiStore } from '@/store/ui.store';
import type { OdooAttachment } from '@mediaos/types';

interface FileUploaderProps {
  model: string;
  recordId: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

function fileIcon(mimetype: string): string {
  if (mimetype.startsWith('image/')) return '🖼️';
  if (mimetype.startsWith('video/')) return '🎬';
  if (mimetype.startsWith('audio/')) return '🎵';
  if (mimetype === 'application/pdf') return '📄';
  if (mimetype.includes('zip') || mimetype.includes('archive')) return '🗜️';
  return '📎';
}

export function FileUploader({ model, recordId }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const addToast = useUiStore((s) => s.addToast);
  const qc = useQueryClient();

  const { data: attachments, isLoading } = useQuery({
    queryKey: ['attachments', model, recordId],
    queryFn: () => odoo.getAttachments(model, recordId),
    enabled: recordId > 0,
  });

  const onDrop = useCallback(
    async (files: File[]) => {
      setUploading(true);
      try {
        for (const file of files) {
          await odoo.uploadAttachment(file, model, recordId);
        }
        await qc.invalidateQueries({ queryKey: ['attachments', model, recordId] });
        addToast({ type: 'success', message: `تم رفع ${files.length} ملف بنجاح` });
      } catch (err) {
        addToast({ type: 'error', message: err instanceof Error ? err.message : 'فشل الرفع' });
      } finally {
        setUploading(false);
      }
    },
    [model, recordId, qc, addToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'video/*': [],
      'audio/*': [],
      'application/zip': [],
      'application/x-zip-compressed': [],
    },
    maxSize: 500 * 1024 * 1024, // 500MB
    disabled: uploading,
  });

  const handleDelete = async (id: number) => {
    try {
      await odoo.deleteAttachment(id);
      await qc.invalidateQueries({ queryKey: ['attachments', model, recordId] });
      addToast({ type: 'success', message: 'تم حذف الملف' });
    } catch (err) {
      addToast({ type: 'error', message: err instanceof Error ? err.message : 'فشل الحذف' });
    }
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wide">المرفقات</h4>

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-all
          ${isDragActive ? 'border-accent bg-accent/4' : 'border-border bg-surface hover:border-accent/40 hover:bg-white'}
          ${uploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-3xl mb-2">{uploading ? '⏳' : '📤'}</div>
        <p className="text-sm text-text-primary font-medium">
          {uploading ? 'جاري الرفع...' : isDragActive ? 'أفلت الملفات هنا' : 'اسحب الملفات هنا أو انقر للاختيار'}
        </p>
        <p className="text-xs text-text-muted mt-1">صور، فيديو، PDF، ZIP — حتى 500MB</p>
      </div>

      {/* Attached Files */}
      {isLoading ? null : (attachments?.length ?? 0) > 0 && (
        <div className="mt-4 space-y-2">
          {attachments?.map((att: OdooAttachment) => (
            <div key={att.id} className="flex items-center gap-3 p-3 bg-white border border-border rounded-md">
              <span className="text-xl">{fileIcon(att.mimetype)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-primary truncate">{att.name}</p>
                <p className="text-xs text-text-muted">{formatSize(att.file_size)}</p>
              </div>
              <button
                onClick={() => handleDelete(att.id)}
                className="text-text-muted hover:text-danger text-xs"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
