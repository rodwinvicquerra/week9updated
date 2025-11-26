/**
 * Security Event Logger
 * Tracks and logs security-related events for monitoring and incident response
 */

export type SecurityEventType =
  | 'rate_limit_exceeded'
  | 'unauthorized_access'
  | 'suspicious_input'
  | 'api_abuse'
  | 'failed_auth'
  | 'invalid_token'
  | 'csrf_detected'
  | 'xss_attempt'
  | 'sql_injection_attempt';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip?: string;
  userId?: string;
  endpoint?: string;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events in memory

  /**
   * Log a security event
   */
  log(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
    };

    // Add to in-memory store
    this.events.push(fullEvent);
    
    // Trim old events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Console log for development/Vercel logs
    const logLevel = this.getSeverityLogLevel(event.severity);
    console[logLevel]('[SECURITY]', {
      type: event.type,
      severity: event.severity,
      message: event.message,
      ip: event.ip,
      endpoint: event.endpoint,
      timestamp: fullEvent.timestamp,
    });

    // Alert on critical events
    if (event.severity === 'critical') {
      this.alertCritical(fullEvent);
    }
  }

  /**
   * Get log level based on severity
   */
  private getSeverityLogLevel(severity: string): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warn';
      default:
        return 'log';
    }
  }

  /**
   * Alert on critical security events
   */
  private alertCritical(event: SecurityEvent): void {
    console.error('🚨 CRITICAL SECURITY EVENT:', {
      type: event.type,
      message: event.message,
      ip: event.ip,
      endpoint: event.endpoint,
      timestamp: event.timestamp,
    });
    
    // In production, you would:
    // - Send to monitoring service (e.g., Sentry, DataDog)
    // - Send email/SMS alerts
    // - Trigger incident response workflow
  }

  /**
   * Get recent events (for admin dashboard)
   */
  getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(-limit).reverse();
  }

  /**
   * Get events by type
   */
  getEventsByType(type: SecurityEventType, limit = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.type === type)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get events by IP
   */
  getEventsByIp(ip: string, limit = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.ip === ip)
      .slice(-limit)
      .reverse();
  }

  /**
   * Get high-priority events
   */
  getHighPriorityEvents(limit = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.severity === 'high' || event.severity === 'critical')
      .slice(-limit)
      .reverse();
  }

  /**
   * Clear old events (maintenance)
   */
  clearOldEvents(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => 
      new Date(event.timestamp) > oneDayAgo
    );
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    recentIps: string[];
  } {
    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};
    const ips = new Set<string>();

    this.events.forEach(event => {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      
      // Count by severity
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
      
      // Collect IPs
      if (event.ip) {
        ips.add(event.ip);
      }
    });

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      recentIps: Array.from(ips).slice(-50),
    };
  }
}

// Singleton instance
export const securityLogger = new SecurityLogger();

// Convenience functions
export function logRateLimitExceeded(ip: string, endpoint: string): void {
  securityLogger.log({
    type: 'rate_limit_exceeded',
    severity: 'medium',
    ip,
    endpoint,
    message: `Rate limit exceeded for ${endpoint}`,
  });
}

export function logUnauthorizedAccess(ip: string, endpoint: string, userId?: string): void {
  securityLogger.log({
    type: 'unauthorized_access',
    severity: 'high',
    ip,
    endpoint,
    userId,
    message: `Unauthorized access attempt to ${endpoint}`,
  });
}

export function logSuspiciousInput(ip: string, endpoint: string, reason: string): void {
  securityLogger.log({
    type: 'suspicious_input',
    severity: 'medium',
    ip,
    endpoint,
    message: `Suspicious input detected: ${reason}`,
  });
}

export function logApiAbuse(ip: string, endpoint: string, details: string): void {
  securityLogger.log({
    type: 'api_abuse',
    severity: 'high',
    ip,
    endpoint,
    message: `API abuse detected: ${details}`,
  });
}

export function logFailedAuth(ip: string, reason: string): void {
  securityLogger.log({
    type: 'failed_auth',
    severity: 'medium',
    ip,
    message: `Authentication failed: ${reason}`,
  });
}
