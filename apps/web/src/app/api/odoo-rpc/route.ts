// ═══════════════════════════════════════════════════════
//  API Route: odoo-rpc — proxies all Odoo JSON-RPC calls
//  Always returns HTTP 200; errors go inside json.error
// ═══════════════════════════════════════════════════════
import { NextRequest, NextResponse } from 'next/server';

function errorResponse(message: string, code = 503) {
  return NextResponse.json({
    jsonrpc: '2.0',
    id: 0,
    error: { code, message, data: { message } },
  });
}

export async function POST(req: NextRequest) {
  let odooUrl = '';
  try {
    const body = (await req.json()) as { odooUrl?: string; params?: unknown };
    odooUrl = body.odooUrl ?? '';

    if (!odooUrl) return errorResponse('odooUrl مطلوب', 400);

    const rpcBody = JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      id: Date.now(),
      params: body.params ?? {},
    });

    const res = await fetch(odooUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(req.headers.get('cookie') ? { Cookie: req.headers.get('cookie')! } : {}),
      },
      body: rpcBody,
      signal: AbortSignal.timeout(30000),
    });

    // Read raw text first so we can diagnose non-JSON responses
    const text = await res.text();

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // Odoo returned HTML or non-JSON (maintenance page, WAF block, etc.)
      return errorResponse(`الخادم أعاد استجابة غير متوقعة (HTTP ${res.status})`);
    }

    const response = NextResponse.json(data); // always HTTP 200 from proxy

    // Forward Odoo session cookie to the browser
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) response.headers.set('set-cookie', setCookie);

    return response;
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message.includes('fetch')
          ? `تعذّر الوصول إلى الخادم: ${odooUrl}`
          : err.message
        : 'خطأ في الاتصال';
    return errorResponse(message);
  }
}
