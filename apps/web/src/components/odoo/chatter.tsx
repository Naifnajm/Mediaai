'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { odoo } from '@/lib/odoo/client';
import { useAuthStore } from '@/store/auth.store';
import { PageSpinner } from '@/components/ui/spinner';
import type { OdooMessage } from '@mediaos/types';

interface ChatterProps {
  model: string;
  recordId: number;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return `قبل ${Math.floor(diff / 60)} دقيقة`;
  if (diff < 86400) return `قبل ${Math.floor(diff / 3600)} ساعة`;
  return date.toLocaleDateString('ar-SA');
}

export function Chatter({ model, recordId }: ChatterProps) {
  const [message, setMessage] = useState('');
  const session = useAuthStore((s) => s.session);
  const qc = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['chatter', model, recordId],
    queryFn: () => odoo.getMessages(model, recordId),
    enabled: recordId > 0,
  });

  const postMutation = useMutation({
    mutationFn: (body: string) => odoo.postMessage(model, recordId, body),
    onSuccess: () => {
      setMessage('');
      void qc.invalidateQueries({ queryKey: ['chatter', model, recordId] });
    },
  });

  const handlePost = () => {
    if (!message.trim()) return;
    postMutation.mutate(message.trim());
  };

  return (
    <div className="border-t border-border mt-6 pt-6">
      <h4 className="text-sm font-semibold text-text-secondary mb-4 uppercase tracking-wide">المحادثة والتعليقات</h4>

      {/* Compose */}
      <div className="flex gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {session?.name?.charAt(0) ?? 'U'}
        </div>
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب تعليقاً..."
            rows={3}
            className="w-full bg-surface border border-transparent rounded-md px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-white outline-none resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost();
            }}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handlePost}
              disabled={!message.trim() || postMutation.isPending}
              className="px-4 py-2 bg-dark text-white text-xs font-semibold rounded-pill disabled:opacity-50 hover:opacity-85"
            >
              {postMutation.isPending ? 'جاري الإرسال...' : 'إرسال'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      {isLoading ? (
        <PageSpinner />
      ) : (messages?.length ?? 0) === 0 ? (
        <p className="text-text-muted text-sm text-center py-4">لا توجد تعليقات بعد</p>
      ) : (
        <div className="space-y-4">
          {messages?.map((msg: OdooMessage) => (
            <div key={msg.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-text-muted text-xs font-bold flex-shrink-0">
                {Array.isArray(msg.author_id) ? (msg.author_id[1] as string).charAt(0) : '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[13px] font-semibold text-text-primary">
                    {Array.isArray(msg.author_id) ? (msg.author_id[1] as string) : 'مجهول'}
                  </span>
                  <span className="text-[11px] text-text-muted">{timeAgo(msg.date)}</span>
                </div>
                <div
                  className="text-[13px] text-text-secondary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: msg.body }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
