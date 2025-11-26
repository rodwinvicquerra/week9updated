/**
 * Security Module - Central Export
 * All security utilities and middleware
 */

// Rate Limiting
export { createRateLimiter, resetRateLimit } from './rate-limiter';

// Input Sanitization
export {
  sanitizeHtml,
  sanitizeText,
  sanitizeChatMessage,
  sanitizeEmail,
  sanitizeContactForm,
  escapeSpecialChars,
  sanitizeJson,
  type ContactFormData,
  // 🔒 Ultra-hardened chat security
  containsLinks,
  isPromptInjection,
  validateMessageSecurity,
  type SecurityValidationResult,
  // 🔒 Advanced security features (#1-15)
  containsEncodingAttack,
  containsMultiLanguageInjection,
  containsNestedInjection,
  isTokenLimitExploitation,
  validateAiResponse,
  containsSteganography,
} from './sanitizer';

// Security Logging
export {
  securityLogger,
  logRateLimitExceeded,
  logUnauthorizedAccess,
  logSuspiciousInput,
  logApiAbuse,
  logFailedAuth,
  type SecurityEvent,
  type SecurityEventType,
} from './logger';

// Intrusion Detection System
export {
  ids,
  type SecurityEvent as IDSSecurityEvent,
  type ThreatScore,
} from './ids';

// CSP Violation Reporter
export {
  cspReporter,
  type CSPViolation,
  type CSPStats,
} from './csp-reporter';

// Security Notifications
export {
  securityNotifications,
  type NotificationConfig,
} from './notifications';

// API Validation
export {
  validateOrigin,
  validateMethod,
  getClientIp,
  validateContentType,
  detectSuspiciousPatterns,
  validateApiRequest,
  validateEnvironment,
  getSecureHeaders,
} from './api-validator';
