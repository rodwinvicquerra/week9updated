/**
 * CSP Violation Reporter
 * Tracks Content Security Policy violations to detect XSS attempts
 */

export interface CSPViolation {
  id: string
  documentUri: string
  violatedDirective: string
  effectiveDirective: string
  originalPolicy: string
  blockedUri: string
  sourceFile?: string
  lineNumber?: number
  columnNumber?: number
  statusCode?: number
  timestamp: Date
  userAgent: string
  ipAddress: string
}

export interface CSPStats {
  totalViolations: number
  violationsLast24h: number
  topViolatedDirectives: Array<{ directive: string; count: number }>
  topBlockedUris: Array<{ uri: string; count: number }>
  recentViolations: CSPViolation[]
}

class CSPReporter {
  private violations: CSPViolation[] = []

  /**
   * Log a CSP violation
   */
  logViolation(
    report: any,
    userAgent: string,
    ipAddress: string
  ): void {
    const violation: CSPViolation = {
      id: `csp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentUri: report['document-uri'] || report.documentUri || 'unknown',
      violatedDirective: report['violated-directive'] || report.violatedDirective || 'unknown',
      effectiveDirective: report['effective-directive'] || report.effectiveDirective || 'unknown',
      originalPolicy: report['original-policy'] || report.originalPolicy || '',
      blockedUri: report['blocked-uri'] || report.blockedUri || 'unknown',
      sourceFile: report['source-file'] || report.sourceFile,
      lineNumber: report['line-number'] || report.lineNumber,
      columnNumber: report['column-number'] || report.columnNumber,
      statusCode: report['status-code'] || report.statusCode,
      timestamp: new Date(),
      userAgent,
      ipAddress,
    }

    this.violations.push(violation)

    // Keep only last 500 violations
    if (this.violations.length > 500) {
      this.violations = this.violations.slice(-500)
    }

    // Log to console for monitoring
    console.warn('🛡️ [CSP VIOLATION]', {
      directive: violation.violatedDirective,
      blockedUri: violation.blockedUri,
      sourceFile: violation.sourceFile,
      timestamp: violation.timestamp.toISOString(),
    })
  }

  /**
   * Get recent violations
   */
  getRecentViolations(limit = 50): CSPViolation[] {
    return this.violations.slice(-limit).reverse()
  }

  /**
   * Get violations by directive
   */
  getViolationsByDirective(directive: string): CSPViolation[] {
    return this.violations.filter(v => 
      v.violatedDirective.includes(directive) || 
      v.effectiveDirective.includes(directive)
    )
  }

  /**
   * Get violations from specific IP
   */
  getViolationsByIP(ipAddress: string): CSPViolation[] {
    return this.violations.filter(v => v.ipAddress === ipAddress)
  }

  /**
   * Get statistics
   */
  getStats(): CSPStats {
    const last24h = this.violations.filter(
      v => Date.now() - v.timestamp.getTime() < 86400000
    )

    // Count violations by directive
    const directiveMap = new Map<string, number>()
    this.violations.forEach(v => {
      const directive = v.effectiveDirective || v.violatedDirective
      directiveMap.set(directive, (directiveMap.get(directive) || 0) + 1)
    })

    const topViolatedDirectives = Array.from(directiveMap.entries())
      .map(([directive, count]) => ({ directive, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Count violations by blocked URI
    const uriMap = new Map<string, number>()
    this.violations.forEach(v => {
      const uri = v.blockedUri
      uriMap.set(uri, (uriMap.get(uri) || 0) + 1)
    })

    const topBlockedUris = Array.from(uriMap.entries())
      .map(([uri, count]) => ({ uri, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalViolations: this.violations.length,
      violationsLast24h: last24h.length,
      topViolatedDirectives,
      topBlockedUris,
      recentViolations: this.getRecentViolations(10),
    }
  }

  /**
   * Clear old violations
   */
  cleanup(): void {
    const sevenDaysAgo = Date.now() - 7 * 86400000
    this.violations = this.violations.filter(
      v => v.timestamp.getTime() > sevenDaysAgo
    )
    console.log('[CSP Reporter] Cleanup completed, violations:', this.violations.length)
  }

  /**
   * Check if IP is attempting XSS based on violation patterns
   */
  detectXSSAttempt(ipAddress: string): {
    isAttempt: boolean
    severity: 'low' | 'medium' | 'high'
    details: string[]
  } {
    const violations = this.getViolationsByIP(ipAddress)
    const recentViolations = violations.filter(
      v => Date.now() - v.timestamp.getTime() < 3600000 // Last hour
    )

    const details: string[] = []
    let severity: 'low' | 'medium' | 'high' = 'low'

    // Check for script-src violations (common in XSS)
    const scriptViolations = recentViolations.filter(v => 
      v.effectiveDirective.includes('script-src')
    )
    if (scriptViolations.length > 0) {
      details.push(`${scriptViolations.length} script-src violations`)
      severity = 'medium'
    }

    // Check for inline script attempts
    const inlineViolations = recentViolations.filter(v => 
      v.blockedUri.includes('inline') || v.blockedUri.includes('eval')
    )
    if (inlineViolations.length > 0) {
      details.push(`${inlineViolations.length} inline/eval attempts`)
      severity = 'high'
    }

    // Check for multiple violations in short time
    if (recentViolations.length > 5) {
      details.push(`${recentViolations.length} violations in last hour`)
      severity = 'high'
    }

    return {
      isAttempt: details.length > 0,
      severity,
      details,
    }
  }
}

// Singleton instance
export const cspReporter = new CSPReporter()

// Run cleanup daily
if (typeof setInterval !== 'undefined') {
  setInterval(() => cspReporter.cleanup(), 86400000)
}
