import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';

// Rate limiters for different endpoints
const chatLimiter = new RateLimiterMemory({
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds (1 minute)
  blockDuration: 120, // Block for 2 minutes if exceeded
});

const contactLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 300, // Per 5 minutes
  blockDuration: 600, // Block for 10 minutes if exceeded
});

const apiLimiter = new RateLimiterMemory({
  points: 30, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 1 minute if exceeded
});

// Admin endpoints have stricter limits
const adminLimiter = new RateLimiterMemory({
  points: 20,
  duration: 60,
  blockDuration: 300, // Block for 5 minutes
});

/**
 * Get client IP from request
 */
function getClientIp(request: NextRequest): string {
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
 * Rate limit middleware factory
 */
export function createRateLimiter(limiterType: 'chat' | 'contact' | 'api' | 'admin') {
  const limiter = 
    limiterType === 'chat' ? chatLimiter :
    limiterType === 'contact' ? contactLimiter :
    limiterType === 'admin' ? adminLimiter :
    apiLimiter;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = getClientIp(request);
    
    try {
      await limiter.consume(ip);
      return null; // Allow request to proceed
    } catch (error) {
      // Rate limit exceeded
      const resetTime = error && typeof error === 'object' && 'msBeforeNext' in error 
        ? Math.ceil((error.msBeforeNext as number) / 1000) 
        : 60;

      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Please try again in ${resetTime} seconds.`,
          retryAfter: resetTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetTime.toString(),
            'X-RateLimit-Limit': limiter.points.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + resetTime * 1000).toISOString(),
          },
        }
      );
    }
  };
}

/**
 * Reset rate limit for a specific IP (admin use)
 */
export async function resetRateLimit(ip: string, limiterType: 'chat' | 'contact' | 'api' | 'admin') {
  const limiter = 
    limiterType === 'chat' ? chatLimiter :
    limiterType === 'contact' ? contactLimiter :
    limiterType === 'admin' ? adminLimiter :
    apiLimiter;

  await limiter.delete(ip);
}
