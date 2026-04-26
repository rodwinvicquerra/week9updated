import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/user
 * Get current user info and role (admin only)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin features disabled' },
    { status: 404 }
  )
}

