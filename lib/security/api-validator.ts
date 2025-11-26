/**
 * API Security Utilities
 * Origin verification, request validation, and API protection
 */

import { NextRequest } from 'next/server';
import { logUnauthorizedAccess, logSuspiciousInput } from './logger';

/**
 * Validate request origin
 */
export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  if (!origin) {
    // Allow requests without origin (same-origin, curl, etc.)
    return true;
  }
  
  // In production, validate against allowed origins
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://localhost:3000',
    'http://localhost:3000',
  ].filter(Boolean);
  
  // Extract hostname from origin
  try {
    const originUrl = new URL(origin);
    const isAllowed = allowedOrigins.some(allowed => {
      if (!allowed) return false;
      const allowedUrl = new URL(allowed);
      return originUrl.hostname === allowedUrl.hostname;
    });
    
    if (!isAllowed && host) {
      // Check if origin matches host
      return originUrl.hostname === host.split(':')[0];
    }
    
    return isAllowed;
  } catch {
    return false;
  }
}

/**
 * Verify request method
 */
export function validateMethod(
  request: NextRequest,
  allowedMethods: string[]
): boolean {
  return allowedMethods.includes(request.method);
}

/**
 * Get client IP from request
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

/**
 * Validate content type
 */
export function validateContentType(
  request: NextRequest,
  expectedType = 'application/json'
): boolean {
  const contentType = request.headers.get('content-type');
  return contentType?.includes(expectedType) ?? false;
}

/**
 * Check for suspicious patterns in input
 */
export function detectSuspiciousPatterns(input: string): {
  isSuspicious: boolean;
  reason?: string;
} {
  // SQL injection patterns
  const sqlPatterns = [
    /(\bOR\b|\bAND\b)\s+[\d\w]+\s*=\s*[\d\w]+/i,
    /UNION\s+SELECT/i,
    /DROP\s+TABLE/i,
    /INSERT\s+INTO/i,
    /DELETE\s+FROM/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
  ];
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      return {
        isSuspicious: true,
        reason: 'Potential injection attack detected',
      };
    }
  }
  
  // Check for excessive length
  if (input.length > 10000) {
    return {
      isSuspicious: true,
      reason: 'Input exceeds maximum length',
    };
  }
  
  // Check for null bytes
  if (input.includes('\0')) {
    return {
      isSuspicious: true,
      reason: 'Null byte detected',
    };
  }
  
  return { isSuspicious: false };
}

/**
 * Validate API request
 */
export async function validateApiRequest(
  request: NextRequest,
  options: {
    allowedMethods?: string[];
    requireAuth?: boolean;
    validateOrigin?: boolean;
    requireContentType?: boolean;
  } = {}
): Promise<{ valid: boolean; error?: string }> {
  const {
    allowedMethods = ['POST', 'GET'],
    validateOrigin: shouldValidateOrigin = true,
    requireContentType = true,
  } = options;
  
  const ip = getClientIp(request);
  const endpoint = request.nextUrl.pathname;
  
  // Validate method
  if (!validateMethod(request, allowedMethods)) {
    logUnauthorizedAccess(ip, endpoint);
    return {
      valid: false,
      error: `Method ${request.method} not allowed`,
    };
  }
  
  // Validate origin
  if (shouldValidateOrigin && !validateOrigin(request)) {
    logUnauthorizedAccess(ip, endpoint);
    return {
      valid: false,
      error: 'Invalid origin',
    };
  }
  
  // Validate content type for POST/PUT/PATCH
  if (
    requireContentType &&
    ['POST', 'PUT', 'PATCH'].includes(request.method) &&
    !validateContentType(request)
  ) {
    logSuspiciousInput(ip, endpoint, 'Invalid content type');
    return {
      valid: false,
      error: 'Content-Type must be application/json',
    };
  }
  
  return { valid: true };
}

/**
 * Environment variable validation
 */
export function validateEnvironment(): {
  valid: boolean;
  missing: string[];
} {
  const required = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'DATABASE_URL',
    'GROQ_API_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return { valid: false, missing };
  }
  
  console.log('✅ All required environment variables are set');
  return { valid: true, missing: [] };
}

/**
 * Secure header configuration with CSP reporting
 */
export function getSecureHeaders(): Record<string, string> {
  const reportUri = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/security/csp-report`
    : '/api/security/csp-report';

  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Report-To': JSON.stringify({
      group: 'csp-endpoint',
      max_age: 10886400,
      endpoints: [{ url: reportUri }],
    }),
  };
}
