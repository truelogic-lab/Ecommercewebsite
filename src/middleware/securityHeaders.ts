// Security headers middleware for the application

export const securityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Control browser features
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=()',
  
  // Cross-origin security
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Content Security Policy
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

// Security: Validate and sanitize headers
export const validateHeaders = (headers: Headers): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Check for required security headers
  const requiredHeaders = [
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
  ];
  
  for (const header of requiredHeaders) {
    if (!headers.has(header)) {
      issues.push(`Missing security header: ${header}`);
    }
  }
  
  // Validate specific header values
  if (headers.get('X-Frame-Options') !== 'DENY') {
    issues.push('X-Frame-Options should be set to DENY');
  }
  
  if (headers.get('X-Content-Type-Options') !== 'nosniff') {
    issues.push('X-Content-Type-Options should be set to nosniff');
  }
  
  return { valid: issues.length === 0, issues };
};

// Security: Apply security headers to fetch requests
export const applySecurityHeaders = (): HeadersInit => {
  return {
    ...securityHeaders,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  };
};

// Security: Validate origin for API requests
export const validateOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  
  try {
    const url = new URL(origin);
    const allowedOrigins = [
      window.location.origin,
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    
    // In production, add your production domain
    if (process.env.NODE_ENV === 'production') {
      allowedOrigins.push('https://yourdomain.com');
    }
    
    return allowedOrigins.includes(url.origin);
  } catch {
    return false;
  }
};

// Security: Sanitize URL parameters
export const sanitizeURLParams = (params: URLSearchParams): URLSearchParams => {
  const sanitized = new URLSearchParams();
  
  for (const [key, value] of params) {
    // Remove potentially dangerous characters
    const sanitizedKey = key.replace(/[<>'"]/g, '');
    const sanitizedValue = value.replace(/[<>'"]/g, '');
    sanitized.set(sanitizedKey, sanitizedValue);
  }
  
  return sanitized;
};

// Security: Check for common attack patterns in URL
export const detectAttackPatterns = (url: string): boolean => {
  const patterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /eval\(/i,
    /alert\(/i,
    /document\./i,
    /window\./i,
    /--/i,
    /' OR '1'='1/i,
    /' OR 1=1/i,
    /; DROP/i,
    /; DELETE/i,
    /; INSERT/i,
    /; UPDATE/i,
    /%3Cscript/i,
    /%3E/i,
    /\\/i,
  ];
  
  const decodedUrl = decodeURIComponent(url);
  return patterns.some(pattern => pattern.test(decodedUrl));
};
