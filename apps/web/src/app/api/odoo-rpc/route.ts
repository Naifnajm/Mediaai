// ═══════════════════════════════════════════════════════
//  API Route: odoo-rpc — proxies all Odoo JSON-RPC calls
//  Runs server-side → no CORS, forwards session cookies
// ═══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { odooUrl, params } = (await req.json()) as {
      odooUrl: string;
      params: unknown;
    };

    if (!odooUrl) {
      return NextResponse.json({ error: 'odooUrl مطلوب' }, { status: 400 });
    }

    const body = JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: Date.now(),
      params,
    });

    const res = await fetch(odooUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward the browser's session cookie to Odoo
        ...(req.headers.get('cookie') ? { Cookie: req.headers.get('cookie')! } : {}),
      },
      body,
      signal: AbortSignal.timeout(30000),
    });

    const data = await res.json();
    const response = NextResponse.json(data);

    // Forward Odoo session cookies back to the browser
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'خطأ في الاتصال بـ Odoo';
    return NextResponse.json(
      { jsonrpc: '2.0', id: 0, error: { code: 503, message, data: { message } } },
      { status: 503 }
    );
  }
}
