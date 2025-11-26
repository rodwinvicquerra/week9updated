/**
 * Security Notification System
 * Sends email alerts for suspicious activity and security events
 */

import { ids, type SecurityEvent } from './ids'
import { cspReporter } from './csp-reporter'

export interface NotificationConfig {
  adminEmail?: string
  sendEmailAlerts: boolean
  alertThreshold: 'low' | 'medium' | 'high' | 'critical'
}

class SecurityNotificationSystem {
  private config: NotificationConfig = {
    sendEmailAlerts: true,
    alertThreshold: 'high',
  }

  /**
   * Configure notification settings
   */
  configure(config: Partial<NotificationConfig>): void {
    this.config = { ...this.config, ...config }
  }

  /**
   * Send security alert
   */
  async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    if (!this.shouldSendAlert(event)) {
      return
    }

    const message = this.formatAlertMessage(event)
    
    // Log to console (can be extended to email service)
    console.warn('🚨 SECURITY ALERT:', message)

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // Example:
    // await this.sendEmail(this.config.adminEmail, 'Security Alert', message)
  }

  /**
   * Send new device login notification
   */
  async notifyNewDeviceLogin(
    userEmail: string,
    userName: string,
    deviceInfo: {
      ipAddress: string
      userAgent: string
      location?: string
    }
  ): Promise<void> {
    const message = `
🔐 New Device Login Detected

User: ${userName} (${userEmail})
IP Address: ${deviceInfo.ipAddress}
Location: ${deviceInfo.location || 'Unknown'}
Device: ${deviceInfo.userAgent}
Time: ${new Date().toISOString()}

If this wasn't you, please secure your account immediately.
    `.trim()

    console.log('📧 New device notification:', message)
    
    // TODO: Send email to user
    // await this.sendEmail(userEmail, 'New Device Login', message)
  }

  /**
   * Send suspicious activity alert
   */
  async notifySuspiciousActivity(
    userEmail: string,
    activityDetails: string
  ): Promise<void> {
    const message = `
⚠️ Suspicious Activity Detected

Account: ${userEmail}
Activity: ${activityDetails}
Time: ${new Date().toISOString()}

We've detected unusual activity on your account. If this wasn't you, 
please change your password immediately and enable two-factor authentication.
    `.trim()

    console.warn('📧 Suspicious activity notification:', message)
    
    // TODO: Send email to user
    // await this.sendEmail(userEmail, 'Suspicious Activity Alert', message)
  }

  /**
   * Daily security summary for admins
   */
  async sendDailySummary(): Promise<void> {
    const idsStats = ids.getStats()
    const cspStats = cspReporter.getStats()
    const suspiciousIPs = ids.getSuspiciousIPs()

    const message = `
📊 Daily Security Summary - ${new Date().toLocaleDateString()}

=== Intrusion Detection System ===
Total Events (24h): ${idsStats.eventsLast24h}
Critical Events: ${idsStats.criticalEvents}
High Severity: ${idsStats.highSeverityEvents}
Suspicious IPs: ${idsStats.suspiciousIPs}
Blocked IPs: ${idsStats.blockedIPs}

Event Breakdown:
- Failed Logins: ${idsStats.eventsByType.failed_login}
- Rate Limit Exceeded: ${idsStats.eventsByType.rate_limit_exceeded}
- Suspicious Patterns: ${idsStats.eventsByType.suspicious_pattern}
- Unauthorized Access: ${idsStats.eventsByType.unauthorized_access}

=== CSP Violations ===
Total Violations (24h): ${cspStats.violationsLast24h}
Total All-Time: ${cspStats.totalViolations}

Top Violated Directives:
${cspStats.topViolatedDirectives.slice(0, 5).map(d => `- ${d.directive}: ${d.count}`).join('\n')}

=== Threat Assessment ===
${suspiciousIPs.length > 0 ? 'High-Risk IPs:\n' + suspiciousIPs.slice(0, 5).map(ip => 
  `- ${ip.ip} (Score: ${ip.threatScore.score}, Action: ${ip.threatScore.recommendedAction})`
).join('\n') : 'No high-risk IPs detected'}
    `.trim()

    console.log('📊 Daily security summary:', message)
    
    // TODO: Send email to admin
    // if (this.config.adminEmail) {
    //   await this.sendEmail(this.config.adminEmail, 'Daily Security Summary', message)
    // }
  }

  /**
   * Check if alert should be sent based on severity threshold
   */
  private shouldSendAlert(event: SecurityEvent): boolean {
    if (!this.config.sendEmailAlerts) return false

    const severityLevels = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    }

    const eventLevel = severityLevels[event.severity]
    const thresholdLevel = severityLevels[this.config.alertThreshold]

    return eventLevel >= thresholdLevel
  }

  /**
   * Format alert message for email
   */
  private formatAlertMessage(event: SecurityEvent): string {
    return `
🚨 Security Alert - ${event.severity.toUpperCase()}

Event Type: ${event.type}
Severity: ${event.severity}
Time: ${event.timestamp.toISOString()}

Details:
${event.details}

IP Address: ${event.ipAddress}
User Agent: ${event.userAgent}
${event.email ? `User Email: ${event.email}` : ''}
${event.userId ? `User ID: ${event.userId}` : ''}

${event.metadata ? `Additional Info:\n${JSON.stringify(event.metadata, null, 2)}` : ''}
    `.trim()
  }

  /**
   * Placeholder for email sending
   * Integrate with Resend, SendGrid, or other email service
   */
  private async sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<void> {
    // TODO: Implement actual email sending
    // Example with Resend:
    // const { Resend } = await import('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'security@yourdomain.com',
    //   to,
    //   subject,
    //   text: body,
    // })
    
    console.log('📧 Email would be sent to:', to, 'Subject:', subject)
  }
}

// Singleton instance
export const securityNotifications = new SecurityNotificationSystem()

// Schedule daily summary (if in Node.js environment)
if (typeof setInterval !== 'undefined') {
  // Send summary every 24 hours at midnight
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const msUntilMidnight = midnight.getTime() - now.getTime()

  setTimeout(() => {
    securityNotifications.sendDailySummary()
    // Then every 24 hours
    setInterval(() => {
      securityNotifications.sendDailySummary()
    }, 86400000)
  }, msUntilMidnight)
}
