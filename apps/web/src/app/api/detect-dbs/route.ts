// ═══════════════════════════════════════════════════════
//  API Route: detect-dbs — proxies /web/database/list
//  Runs server-side → no CORS issues
// ═══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { serverUrl } = (await req.json()) as { serverUrl: string };

    if (!serverUrl) {
      return NextResponse.json({ error: 'serverUrl مطلوب' }, { status: 400 });
    }

    const clean = serverUrl.replace(/\/$/, '');

    const res = await fetch(`${clean}/web/database/list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'call', id: 1, params: {} }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `الخادم أعاد: ${res.status} ${res.statusText}` },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { result?: string[]; error?: { data?: { message?: string } } };

    if (data.error) {
      const msg = data.error.data?.message ?? 'خطأ من الخادم';
      return NextResponse.json({ error: msg }, { status: 502 });
    }

    return NextResponse.json({ databases: data.result ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'تعذر الاتصال بالخادم';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
