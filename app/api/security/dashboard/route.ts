import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { ids } from "@/lib/security/ids"
import { cspReporter } from "@/lib/security/csp-reporter"
import { getSecureHeaders } from "@/lib/security"

export const dynamic = 'force-dynamic'

/**
 * GET /api/security/dashboard
 * Get security dashboard data (admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      )
    }

    // Check admin role
    const publicMetadata = user.publicMetadata as { role?: string } | undefined
    const role = (publicMetadata?.role || 'viewer').toLowerCase()
    
    if (role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403, headers: getSecureHeaders() }
      )
    }

    // Get IDS stats and events
    const idsStats = ids.getStats()
    const recentSecurityEvents = ids.getRecentEvents(20)
    const suspiciousIPs = ids.getSuspiciousIPs()

    // Get CSP stats
    const cspStats = cspReporter.getStats()

    return NextResponse.json(
      {
        ids: {
          stats: idsStats,
          recentEvents: recentSecurityEvents,
          suspiciousIPs,
        },
        csp: cspStats,
      },
      { headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Error fetching security dashboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    )
  }
}
