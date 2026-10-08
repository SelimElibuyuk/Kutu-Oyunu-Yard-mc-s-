import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates request origin and builds security & CORS headers.
 */
export function getCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowedOriginEnv = process.env.ALLOWED_ORIGIN;

  let allowedOrigin = '*';

  if (allowedOriginEnv) {
    const allowedList = allowedOriginEnv.split(',').map((o) => o.trim());
    if (allowedList.includes(origin)) {
      allowedOrigin = origin;
    } else {
      // In production, restrict to allowed origin only
      allowedOrigin = allowedList[0] || '';
    }
  } else if (origin) {
    // Default to request origin in development/local
    allowedOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-gemini-api-key',
    'Access-Control-Max-Age': '86400',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}

export function handleOptionsCors(req: NextRequest): NextResponse {
  const headers = getCorsHeaders(req);
  return new NextResponse(null, { status: 204, headers });
}
