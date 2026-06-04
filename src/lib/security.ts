export function validateCSRF(req: Request): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  if (!origin && !referer) {
    return false;
  }

  const expectedHost = process.env.NEXTAUTH_URL
    ? new URL(process.env.NEXTAUTH_URL).host
    : req.headers.get("host");

  if (!expectedHost) return false;

  try {
    if (origin) {
      const originHost = new URL(origin).host;
      if (originHost !== expectedHost) return false;
    }

    if (referer) {
      const refererHost = new URL(referer).host;
      if (refererHost !== expectedHost) return false;
    }
  } catch (e) {
    return false;
  }

  return true;
}

export function sanitizeInput(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    if (typeof obj === "string") {
      return obj.length > 50000 ? obj.substring(0, 50000) : obj;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeInput(item));
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    sanitized[key] = sanitizeInput(value);
  }

  return sanitized;
}

class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number, windowMs: number) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return true;
    }

    if (now - record.firstAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }
}

export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);
