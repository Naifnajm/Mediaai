'use client';
import { useQuery } from '@tanstack/react-query';
import { odoo } from '@/lib/odoo/client';
import type { SearchReadOptions } from '@mediaos/types';

export function useOdooList<T>(
  model: string,
  domain: unknown[] = [],
  fields: string[] = [],
  opts: SearchReadOptions = {}
) {
  return useQuery({
    queryKey: ['odoo', model, JSON.stringify(domain), JSON.stringify(fields), opts],
    queryFn: () => odoo.searchRead<T>(model, domain, fields, opts),
    staleTime: 30_000,
  });
}
