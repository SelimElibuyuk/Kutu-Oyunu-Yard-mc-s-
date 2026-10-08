import { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory token bucket rate limiter for serverless instance lifecycle
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if a client IP has exceeded the rate limit.
 * @param req NextRequest
 * @param limit Maximum allowed requests in the window
 * @param windowMs Time window in milliseconds (default 60 seconds)
 * @returns { success: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  req: NextRequest,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetInSeconds: number } {
  // Extract client IP from standard proxy headers
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const clientIp = forwardedFor?.split(',')[0].trim() || realIp || '127.0.0.1';

  const now = Date.now();
  const record = rateLimitMap.get(clientIp);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(clientIp, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    const resetInSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return {
      success: false,
      remaining: 0,
      resetInSeconds,
    };
  }

  record.count += 1;
  const remaining = limit - record.count;
  const resetInSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

  return {
    success: true,
    remaining,
    resetInSeconds,
  };
}
