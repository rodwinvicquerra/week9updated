import type { NextRequest } from "next/server"
import {
  createRateLimiter,
  sanitizeContactForm,
  detectSuspiciousPatterns,
  validateApiRequest,
  logSuspiciousInput,
  getClientIp,
  getSecureHeaders,
} from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    // Validate API request
    const validation = await validateApiRequest(req, {
      allowedMethods: ['POST'],
      requireContentType: true,
    });

    if (!validation.valid) {
      return new Response(
        JSON.stringify({ message: validation.error }),
        { status: 403, headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' } }
      );
    }

    // Apply rate limiting
    const rateLimiter = createRateLimiter('contact');
    const rateLimitResult = await rateLimiter(req);
    if (rateLimitResult) {
      return rateLimitResult; // Returns 429 with proper headers
    }

    const ip = getClientIp(req);
    const { name, email, message, website } = await req.json()

    // Honeypot
    if (typeof website === "string" && website.trim().length > 0) {
      logSuspiciousInput(ip, '/api/contact', 'Honeypot triggered');
      return new Response(JSON.stringify({ ok: true }), { 
        status: 200,
        headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' }
      })
    }

    // Basic validation
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "All fields are required." }),
        { status: 400, headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' } }
      )
    }

    // Check for suspicious patterns
    const nameCheck = detectSuspiciousPatterns(name);
    const messageCheck = detectSuspiciousPatterns(message);
    
    if (nameCheck.isSuspicious || messageCheck.isSuspicious) {
      logSuspiciousInput(ip, '/api/contact', nameCheck.reason || messageCheck.reason || 'Unknown');
      return new Response(
        JSON.stringify({ message: "Invalid input detected." }),
        { status: 400, headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' } }
      )
    }

    // Sanitize inputs
    try {
      const sanitized = sanitizeContactForm({ name, email, message });

      // In a real system, send email or store in DB here.
      console.log("Contact submission:", { ...sanitized, ip })

      return new Response(
        JSON.stringify({ ok: true }),
        { status: 200, headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' } }
      )
    } catch (error: any) {
      logSuspiciousInput(ip, '/api/contact', error.message);
      return new Response(
        JSON.stringify({ message: error.message || "Invalid input." }),
        { status: 400, headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' } }
      )
    }
  } catch (e) {
    console.error('Contact API error:', e);
    return new Response(
      JSON.stringify({ message: "Unexpected error." }),
      { status: 500, headers: { ...getSecureHeaders(), 'Content-Type': 'application/json' } }
    )
  }
}


