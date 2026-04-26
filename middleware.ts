import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ids } from '@/lib/security/ids';

export default function middleware(req: NextRequest) {
  const ipAddress = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    'unknown';

  // Check if IP is blocked by IDS
  if (ids.isBlocked(ipAddress)) {
    console.warn('🚫 Blocked request from:', ipAddress);
    return NextResponse.json(
      { error: 'Access denied - Suspicious activity detected' },
      { status: 403 }
    );
  }

  // Track request for rate limiting (skip for static assets)
  if (!req.nextUrl.pathname.startsWith('/_next') && 
      !req.nextUrl.pathname.startsWith('/static')) {
    const { allowed, threatScore } = ids.trackRequest(ipAddress);
    
    if (!allowed) {
      console.warn('⚠️ Rate limit exceeded:', ipAddress, 'Score:', threatScore.score);
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico).*)",
    "/api/(.*)"
  ],
};
