/**
 * Intrusion Detection System (IDS)
 * Monitors and alerts on suspicious security patterns
 */

export interface SecurityEvent {
  id: string
  type: 'failed_login' | 'rate_limit_exceeded' | 'suspicious_pattern' | 'unauthorized_access' | 'unusual_location'
  severity: 'low' | 'medium' | 'high' | 'critical'
  ipAddress: string
  userAgent: string
  userId?: string
  email?: string
  details: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface ThreatScore {
  score: number // 0-100, higher = more suspicious
  factors: string[]
  recommendedAction: 'monitor' | 'alert' | 'block'
}

class IntrusionDetectionSystem {
  private events: SecurityEvent[] = []
  private failedAttempts = new Map<string, number>() // IP -> count
  private suspiciousIPs = new Set<string>()
  private requestTimestamps = new Map<string, number[]>() // IP -> timestamps

  // Thresholds
  private readonly FAILED_LOGIN_THRESHOLD = 5
  private readonly RATE_LIMIT_WINDOW_MS = 60000 // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 50
  private readonly SUSPICIOUS_SCORE_THRESHOLD = 70

  /**
   * Log a security event
   */
  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }

    this.events.push(securityEvent)

    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    // Auto-alert on high/critical severity
    if (event.severity === 'high' || event.severity === 'critical') {
      this.sendAlert(securityEvent)
    }
  }

  /**
   * Track failed login attempt
   */
  trackFailedLogin(ipAddress: string, email?: string, userAgent?: string): ThreatScore {
    const current = this.failedAttempts.get(ipAddress) || 0
    const newCount = current + 1
    this.failedAttempts.set(ipAddress, newCount)

    // Log the event
    const severity = newCount >= this.FAILED_LOGIN_THRESHOLD ? 'high' : 'medium'
    this.logEvent({
      type: 'failed_login',
      severity,
      ipAddress,
      userAgent: userAgent || 'unknown',
      email,
      details: `Failed login attempt ${newCount} from IP ${ipAddress}`,
      metadata: { attemptCount: newCount },
    })

    // Mark IP as suspicious after threshold
    if (newCount >= this.FAILED_LOGIN_THRESHOLD) {
      this.suspiciousIPs.add(ipAddress)
    }

    return this.calculateThreatScore(ipAddress)
  }

  /**
   * Track request for rate limiting
   */
  trackRequest(ipAddress: string): { allowed: boolean; threatScore: ThreatScore } {
    const now = Date.now()
    const timestamps = this.requestTimestamps.get(ipAddress) || []
    
    // Remove timestamps outside window
    const recentTimestamps = timestamps.filter(t => now - t < this.RATE_LIMIT_WINDOW_MS)
    recentTimestamps.push(now)
    this.requestTimestamps.set(ipAddress, recentTimestamps)

    const requestCount = recentTimestamps.length
    const allowed = requestCount <= this.MAX_REQUESTS_PER_WINDOW

    if (!allowed) {
      this.logEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        ipAddress,
        userAgent: 'unknown',
        details: `Rate limit exceeded: ${requestCount} requests in ${this.RATE_LIMIT_WINDOW_MS}ms`,
        metadata: { requestCount, window: this.RATE_LIMIT_WINDOW_MS },
      })
    }

    return {
      allowed,
      threatScore: this.calculateThreatScore(ipAddress),
    }
  }

  /**
   * Check for suspicious patterns
   */
  detectSuspiciousPattern(
    ipAddress: string,
    userId?: string,
    patterns?: {
      unusualLocation?: boolean
      unusualTime?: boolean
      newDevice?: boolean
      rapidRequests?: boolean
    }
  ): ThreatScore {
    const suspiciousFactors: string[] = []

    if (patterns?.unusualLocation) {
      suspiciousFactors.push('Access from unusual geographic location')
    }
    if (patterns?.unusualTime) {
      suspiciousFactors.push('Access at unusual time')
    }
    if (patterns?.newDevice) {
      suspiciousFactors.push('Access from new device')
    }
    if (patterns?.rapidRequests) {
      suspiciousFactors.push('Rapid succession of requests')
    }

    if (suspiciousFactors.length > 0) {
      const severity = suspiciousFactors.length >= 3 ? 'high' : 'medium'
      this.logEvent({
        type: 'suspicious_pattern',
        severity,
        ipAddress,
        userAgent: 'unknown',
        userId,
        details: `Suspicious pattern detected: ${suspiciousFactors.join(', ')}`,
        metadata: { patterns: suspiciousFactors },
      })
    }

    return this.calculateThreatScore(ipAddress)
  }

  /**
   * Calculate threat score for an IP
   */
  calculateThreatScore(ipAddress: string): ThreatScore {
    let score = 0
    const factors: string[] = []

    // Failed login attempts
    const failedCount = this.failedAttempts.get(ipAddress) || 0
    if (failedCount > 0) {
      const failedScore = Math.min(failedCount * 15, 50)
      score += failedScore
      factors.push(`${failedCount} failed login(s)`)
    }

    // Suspicious IP
    if (this.suspiciousIPs.has(ipAddress)) {
      score += 30
      factors.push('Marked as suspicious')
    }

    // Rate limiting
    const timestamps = this.requestTimestamps.get(ipAddress) || []
    const recentRequests = timestamps.filter(t => Date.now() - t < this.RATE_LIMIT_WINDOW_MS).length
    if (recentRequests > this.MAX_REQUESTS_PER_WINDOW) {
      score += 20
      factors.push(`${recentRequests} requests in 1 minute`)
    }

    // Recent security events from this IP
    const recentEvents = this.events.filter(
      e => e.ipAddress === ipAddress && 
      Date.now() - e.timestamp.getTime() < 3600000 // Last hour
    )
    if (recentEvents.length > 5) {
      score += 15
      factors.push(`${recentEvents.length} security events in last hour`)
    }

    score = Math.min(score, 100)

    let recommendedAction: ThreatScore['recommendedAction'] = 'monitor'
    if (score >= 80) recommendedAction = 'block'
    else if (score >= this.SUSPICIOUS_SCORE_THRESHOLD) recommendedAction = 'alert'

    return { score, factors, recommendedAction }
  }

  /**
   * Get recent security events
   */
  getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(-limit).reverse()
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.events.filter(e => e.severity === severity)
  }

  /**
   * Get suspicious IPs
   */
  getSuspiciousIPs(): Array<{ ip: string; threatScore: ThreatScore }> {
    return Array.from(this.suspiciousIPs).map(ip => ({
      ip,
      threatScore: this.calculateThreatScore(ip),
    }))
  }

  /**
   * Check if IP is blocked
   */
  isBlocked(ipAddress: string): boolean {
    const threatScore = this.calculateThreatScore(ipAddress)
    return threatScore.recommendedAction === 'block'
  }

  /**
   * Manually block an IP
   */
  blockIP(ipAddress: string): void {
    this.suspiciousIPs.add(ipAddress)
    this.logEvent({
      type: 'unauthorized_access',
      severity: 'critical',
      ipAddress,
      userAgent: 'unknown',
      details: `IP ${ipAddress} manually blocked`,
    })
  }

  /**
   * Unblock an IP
   */
  unblockIP(ipAddress: string): void {
    this.suspiciousIPs.delete(ipAddress)
    this.failedAttempts.delete(ipAddress)
    this.requestTimestamps.delete(ipAddress)
  }

  /**
   * Clear old data (cleanup)
   */
  cleanup(): void {
    const oneDayAgo = Date.now() - 86400000
    
    // Clear old failed attempts
    for (const [ip, count] of this.failedAttempts.entries()) {
      const lastEvent = this.events
        .filter(e => e.ipAddress === ip && e.type === 'failed_login')
        .pop()
      
      if (!lastEvent || lastEvent.timestamp.getTime() < oneDayAgo) {
        this.failedAttempts.delete(ip)
      }
    }

    // Clear old request timestamps
    for (const [ip, timestamps] of this.requestTimestamps.entries()) {
      const recent = timestamps.filter(t => Date.now() - t < this.RATE_LIMIT_WINDOW_MS)
      if (recent.length === 0) {
        this.requestTimestamps.delete(ip)
      } else {
        this.requestTimestamps.set(ip, recent)
      }
    }

    console.log('[IDS] Cleanup completed')
  }

  /**
   * Send alert (to be implemented with email notifications)
   */
  private sendAlert(event: SecurityEvent): void {
    console.warn('🚨 [IDS ALERT]', {
      type: event.type,
      severity: event.severity,
      ip: event.ipAddress,
      details: event.details,
      timestamp: event.timestamp.toISOString(),
    })
    // TODO: Integrate with email notification system
  }

  /**
   * Get statistics
   */
  getStats() {
    const last24h = this.events.filter(
      e => Date.now() - e.timestamp.getTime() < 86400000
    )

    return {
      totalEvents: this.events.length,
      eventsLast24h: last24h.length,
      criticalEvents: this.events.filter(e => e.severity === 'critical').length,
      highSeverityEvents: this.events.filter(e => e.severity === 'high').length,
      suspiciousIPs: this.suspiciousIPs.size,
      blockedIPs: this.getSuspiciousIPs().filter(
        ip => ip.threatScore.recommendedAction === 'block'
      ).length,
      eventsByType: {
        failed_login: this.events.filter(e => e.type === 'failed_login').length,
        rate_limit_exceeded: this.events.filter(e => e.type === 'rate_limit_exceeded').length,
        suspicious_pattern: this.events.filter(e => e.type === 'suspicious_pattern').length,
        unauthorized_access: this.events.filter(e => e.type === 'unauthorized_access').length,
      },
    }
  }
}

// Singleton instance
export const ids = new IntrusionDetectionSystem()

// Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => ids.cleanup(), 3600000)
}
