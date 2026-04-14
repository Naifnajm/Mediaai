'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { odoo } from '@/lib/odoo/client';
import { useUiStore } from '@/store/ui.store';

export function useOdooCreate(model: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: (values: Record<string, unknown>) => odoo.create(model, values),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['odoo', model] });
      addToast({ type: 'success', message: 'تم الحفظ بنجاح' });
    },
    onError: (err: Error) => {
      addToast({ type: 'error', message: err.message });
    },
  });
}

export function useOdooWrite(model: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ ids, values }: { ids: number[]; values: Record<string, unknown> }) =>
      odoo.write(model, ids, values),
    onSuccess: (_data, vars) => {
      void qc.invalidateQueries({ queryKey: ['odoo', model] });
      for (const id of vars.ids) {
        void qc.invalidateQueries({ queryKey: ['odoo', model, id] });
      }
      addToast({ type: 'success', message: 'تم التعديل بنجاح' });
    },
    onError: (err: Error) => {
      addToast({ type: 'error', message: err.message });
    },
  });
}

export function useOdooDelete(model: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: (ids: number[]) => odoo.unlink(model, ids),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['odoo', model] });
      addToast({ type: 'success', message: 'تم الحذف' });
    },
    onError: (err: Error) => {
      addToast({ type: 'error', message: err.message });
    },
  });
}

export function useOdooAction(model: string, method: string) {
  const qc = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: ({ ids, kwargs }: { ids: number[]; kwargs?: Record<string, unknown> }) =>
      odoo.callButton(model, method, ids, kwargs),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['odoo', model] });
    },
    onError: (err: Error) => {
      addToast({ type: 'error', message: err.message });
    },
  });
}
