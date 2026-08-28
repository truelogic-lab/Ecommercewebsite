// Security middleware for the application

// Security: CSRF Protection
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Security: Validate CSRF Token
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) return false;
  if (token.length !== storedToken.length) return false;
  
  // Constant time comparison to prevent timing attacks
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ storedToken.charCodeAt(i);
  }
  return result === 0;
};

// Security: Rate Limiting
export class RateLimiter {
  private attempts: Map<string, { count: number; timestamp: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (now - record.timestamp > this.windowMs) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    this.attempts.set(key, record);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Security: Input Sanitization
export const sanitizeHTML = (input: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (s) => map[s] || s);
};

// Security: Escape SQL-like characters
export const escapeSQL = (input: string): string => {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\0/g, '\\0')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\x1a/g, '\\Z');
};

// Security: Validate email format (strict)
export const isValidEmail = (email: string): boolean => {
  // Strict email validation
  const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Security: Validate URL
export const isValidURL = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname.length > 0;
  } catch {
    return false;
  }
};

// Security: Generate secure random ID
export const generateSecureId = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Security: Content Security Policy headers
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://images.unsplash.com",
    "font-src 'self' data:",
    "connect-src 'self' https://api.bigdatacloud.net https://nominatim.openstreetmap.org",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join('; '),
};

// Security: XSS Prevention
export const preventXSS = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#96;');
};

// Security: Session timeout check
export const isSessionValid = (session: any): boolean => {
  if (!session) return false;
  
  // Check if session has all required fields
  const requiredFields = ['id', 'email', 'role'];
  for (const field of requiredFields) {
    if (!session[field]) return false;
  }
  
  // Check if session has expired
  if (session.expires && Date.now() > session.expires) {
    return false;
  }
  
  return true;
};

// Security: Secure cookie options
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// Security: Validate request headers
export const validateRequest = (headers: Headers): boolean => {
  // Check for X-Requested-With header (AJAX request)
  const requestedWith = headers.get('X-Requested-With');
  if (requestedWith && requestedWith !== 'XMLHttpRequest') {
    return false;
  }

  // Check for Origin header
  const origin = headers.get('Origin');
  if (origin) {
    try {
      const url = new URL(origin);
      // Only allow same-origin requests
      if (url.origin !== window.location.origin) {
        return false;
      }
    } catch {
      return false;
    }
  }

  return true;
};

// Security: Sanitize object recursively
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeHTML(value);
    } else if (value && typeof value === 'object') {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
};
