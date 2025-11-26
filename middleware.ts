import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ids } from '@/lib/security/ids';

// NOTE: Arcjet removed to reduce middleware size for Vercel Free tier (1MB limit)
// For production deployment with Arcjet, upgrade to Vercel Pro
// Arcjet provides: Rate limiting, Bot detection, SQL injection protection

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)", 
  "/api/public(.*)",
  "/api/security/csp-report", // Allow CSP reports
  "/mcp-security", // Make security docs public
  "/security(.*)", // Security pages check role internally
  "/mcp-integration(.*)", // MCP pages check role internally
  "/admin/logs(.*)", // Temporarily allow - page will check role
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
  "/api/security/dashboard",
]);

export default clerkMiddleware(async (auth, req) => {
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

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect admin routes - check for admin role
  if (isAdminRoute(req)) {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has admin role in publicMetadata (case-insensitive)
    const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
    const role = publicMetadata?.role;
    
    // Log for debugging (check Vercel logs)
    console.log('Admin route check:', { 
      path: req.nextUrl.pathname, 
      role, 
      publicMetadata,
      userId: userId.substring(0, 10) + '...'
    });
    
    if (!role || role.toLowerCase() !== "admin") {
      // Redirect non-admin users to portfolio
      console.log('Access denied - redirecting to portfolio');
      return NextResponse.redirect(new URL("/portfolio", req.url));
    }
  }

  // For other protected routes (like /portfolio), just require authentication
  const { userId } = await auth();
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Protect /portfolio route - require authentication
  if (req.nextUrl.pathname.startsWith("/portfolio")) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|static|favicon.ico).*)",
    "/api/(.*)"
  ],
};
