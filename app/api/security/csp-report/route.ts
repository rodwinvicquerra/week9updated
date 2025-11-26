import { NextRequest, NextResponse } from "next/server"
import { cspReporter } from "@/lib/security/csp-reporter"
import { ids } from "@/lib/security/ids"
import { getSecureHeaders } from "@/lib/security"

export const dynamic = 'force-dynamic'

/**
 * POST /api/security/csp-report
 * Endpoint to receive CSP violation reports
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    
    let report: any
    if (contentType.includes('application/csp-report')) {
      const body = await req.json()
      report = body['csp-report'] || body
    } else {
      report = await req.json()
    }

    const ipAddress = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Log the violation
    cspReporter.logViolation(report, userAgent, ipAddress)

    // Check if this looks like an XSS attempt
    const xssCheck = cspReporter.detectXSSAttempt(ipAddress)
    if (xssCheck.isAttempt) {
      // Log to IDS
      ids.logEvent({
        type: 'suspicious_pattern',
        severity: xssCheck.severity === 'high' ? 'high' : 'medium',
        ipAddress,
        userAgent,
        details: `Potential XSS attempt detected: ${xssCheck.details.join(', ')}`,
        metadata: { cspViolation: true, xssDetails: xssCheck.details },
      })

      // If high severity, track as failed attempt
      if (xssCheck.severity === 'high') {
        ids.trackFailedLogin(ipAddress, undefined, userAgent)
      }
    }

    return NextResponse.json(
      { success: true },
      { status: 204, headers: getSecureHeaders() }
    )
  } catch (error) {
    console.error('Error processing CSP report:', error)
    return NextResponse.json(
      { error: 'Invalid CSP report' },
      { status: 400, headers: getSecureHeaders() }
    )
  }
}
