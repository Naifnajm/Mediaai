'use client';
import { useQuery } from '@tanstack/react-query';
import { odoo } from '@/lib/odoo/client';

export function useOdooRecord<T>(model: string, id: number | null, fields: string[]) {
  return useQuery({
    queryKey: ['odoo', model, id, fields],
    queryFn: () => odoo.readOne<T>(model, id!, fields),
    enabled: id !== null && id > 0,
    staleTime: 30_000,
  });
}
