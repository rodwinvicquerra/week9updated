# Advanced Security Features

This document describes the advanced security features implemented in this portfolio application.

## 🛡️ Features Overview

### 1. Intrusion Detection System (IDS)

Real-time monitoring and alerting on suspicious security patterns.

**Features:**
- Failed login tracking (blocks after 5 attempts)
- Rate limiting (50 requests per minute per IP)
- Suspicious pattern detection
- Threat scoring system (0-100)
- Automatic IP blocking for high-threat actors

**How it works:**
- Monitors all incoming requests
- Tracks failed authentication attempts
- Calculates threat scores based on multiple factors
- Automatically blocks IPs with threat score >= 80
- Logs all security events for analysis

**API Endpoints:**
- `GET /api/security/dashboard` - View IDS data (admin only)

**Threat Levels:**
- **Low (0-39)**: Monitor only
- **Medium (40-69)**: Send alerts
- **High (70-79)**: Alert and enhanced monitoring
- **Critical (80-100)**: Automatic blocking

### 2. Content Security Policy (CSP) Violation Reporter

Tracks and reports CSP violations to detect XSS attempts and policy misconfigurations.

**Features:**
- Automatic CSP violation logging
- XSS attempt detection
- Real-time violation tracking
- Integration with IDS for threat correlation

**How it works:**
- Browser sends CSP violations to `/api/security/csp-report`
- System analyzes violations for XSS patterns
- High-severity violations trigger IDS alerts
- Dashboard shows violation trends and top offenders

**Monitored Directives:**
- `script-src` - Script source violations (XSS attempts)
- `style-src` - Style violations
- `img-src` - Image source violations
- `connect-src` - API/WebSocket violations
- `frame-src` - Iframe violations

### 3. Security Notifications System

Automated email alerts for security events and suspicious activity.

**Alert Types:**
- **Security Events**: Critical/high severity IDS events
- **New Device Logins**: Notifications when users log in from new devices
- **Suspicious Activity**: Alerts for unusual account behavior
- **Daily Summary**: Comprehensive security report (sent at midnight)

**Configuration:**
```typescript
import { securityNotifications } from '@/lib/security/notifications'

securityNotifications.configure({
  adminEmail: 'admin@example.com',
  sendEmailAlerts: true,
  alertThreshold: 'high', // Only send high/critical alerts
})
```

**TODO:** Integrate with email service (Resend, SendGrid, etc.)

### 4. Passwordless Authentication

Magic link authentication via Clerk for enhanced security.

**Setup in Clerk Dashboard:**
1. Go to Clerk Dashboard → User & Authentication → Email, Phone, Username
2. Enable "Email verification link" strategy
3. Configure email templates
4. Users can now sign in via magic links sent to their email

**Benefits:**
- No passwords to remember or steal
- Eliminates password reuse attacks
- Reduces phishing vulnerability
- One-click authentication

**How users authenticate:**
1. Enter email address
2. Receive magic link via email
3. Click link to authenticate instantly
4. Session created securely

## 🎯 Security Dashboard

Access the security operations center at `/admin/security` (admin only).

**Dashboard Features:**
- Real-time security event monitoring
- Threat IP tracking and scoring
- CSP violation analysis
- Event statistics and trends
- Suspicious activity patterns

**Tabs:**
1. **Security Events**: Recent IDS events with severity levels
2. **Threat IPs**: Suspicious IP addresses with threat scores
3. **CSP Violations**: Content Security Policy violation tracking
4. **Statistics**: Overall security metrics and event breakdown

## 📊 Integration Points

### Middleware Integration

The IDS is integrated into the Next.js middleware for automatic request monitoring:

```typescript
// middleware.ts
import { ids } from '@/lib/security/ids'

// Check if IP is blocked
if (ids.isBlocked(ipAddress)) {
  return NextResponse.json({ error: 'Access denied' }, { status: 403 })
}

// Track request for rate limiting
const { allowed, threatScore } = ids.trackRequest(ipAddress)
if (!allowed) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

### CSP Integration

CSP violations are automatically reported via HTTP headers:

```javascript
// next.config.mjs
headers: [
  {
    key: 'Content-Security-Policy',
    value: '...; report-uri /api/security/csp-report'
  }
]
```

### Notification Integration

Security events trigger notifications automatically:

```typescript
import { securityNotifications } from '@/lib/security/notifications'

// Send security alert
await securityNotifications.sendSecurityAlert(event)

// Notify user of new device login
await securityNotifications.notifyNewDeviceLogin(
  userEmail,
  userName,
  deviceInfo
)
```

## 🔧 Configuration

### Environment Variables

No additional environment variables required. All features work out of the box.

**Optional (for email notifications):**
```env
RESEND_API_KEY=re_xxxxx  # For email notifications (optional)
ADMIN_EMAIL=admin@example.com  # Alert destination (optional)
```

### Customization

Adjust thresholds in `/lib/security/ids.ts`:

```typescript
// In IntrusionDetectionSystem class
private readonly FAILED_LOGIN_THRESHOLD = 5  // Block after N failed logins
private readonly RATE_LIMIT_WINDOW_MS = 60000  // Time window (1 minute)
private readonly MAX_REQUESTS_PER_WINDOW = 50  // Max requests per window
private readonly SUSPICIOUS_SCORE_THRESHOLD = 70  // Alert threshold
```

## 📈 Monitoring Best Practices

1. **Check dashboard daily** for unusual patterns
2. **Review threat IPs** and block persistent attackers
3. **Analyze CSP violations** to refine security policies
4. **Enable email notifications** for critical events
5. **Review daily summaries** to track trends over time

## 🚀 Next Steps

### To Enable Email Notifications:

1. Sign up for [Resend](https://resend.com) or similar email service
2. Add `RESEND_API_KEY` to environment variables
3. Update `/lib/security/notifications.ts` to send actual emails:

```typescript
import { Resend } from 'resend'

private async sendEmail(to: string, subject: string, body: string) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'security@yourdomain.com',
    to,
    subject,
    text: body,
  })
}
```

### To Enable Passwordless Auth:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **User & Authentication → Email, Phone, Username**
4. Enable "Email verification link" authentication strategy
5. Customize email templates under **Emails**
6. Users can now authenticate via magic links!

## 🔒 Security Considerations

- **Rate Limiting**: Prevents brute force and DDoS attacks
- **IP Blocking**: Automatically blocks high-threat actors
- **CSP Monitoring**: Detects XSS attempts in real-time
- **Event Logging**: Maintains audit trail for security analysis
- **Threat Scoring**: Multi-factor threat assessment for accurate detection
- **Passwordless Auth**: Eliminates password-based attack vectors

## 📚 API Reference

### IDS Methods

```typescript
import { ids } from '@/lib/security/ids'

// Track failed login
ids.trackFailedLogin(ipAddress, email, userAgent)

// Check if IP is blocked
ids.isBlocked(ipAddress)

// Track request (rate limiting)
ids.trackRequest(ipAddress)

// Get statistics
ids.getStats()

// Get recent events
ids.getRecentEvents(limit)

// Manually block IP
ids.blockIP(ipAddress)
```

### CSP Reporter Methods

```typescript
import { cspReporter } from '@/lib/security/csp-reporter'

// Log violation
cspReporter.logViolation(report, userAgent, ipAddress)

// Get statistics
cspReporter.getStats()

// Detect XSS attempt
cspReporter.detectXSSAttempt(ipAddress)

// Get recent violations
cspReporter.getRecentViolations(limit)
```

## 🎓 Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy Reference](https://content-security-policy.com/)
- [Clerk Passwordless Auth Docs](https://clerk.com/docs/authentication/email-passwordless)
- [Web Application Security Best Practices](https://cheatsheetseries.owasp.org/)
