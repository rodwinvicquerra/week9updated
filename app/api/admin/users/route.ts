import { NextRequest, NextResponse } from "next/server";
import { getSecureHeaders } from '@/lib/security';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin features disabled' },
    { status: 404, headers: getSecureHeaders() }
  );
}

export async function PATCH(request: NextRequest) {
  return NextResponse.json(
    { error: 'Admin features disabled' },
    { status: 404, headers: getSecureHeaders() }
  );
}