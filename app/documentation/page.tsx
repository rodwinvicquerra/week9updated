'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common';

// Portfolio Documentation - Clean sidebar navigation
const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'auth', title: 'Authentication' },
  { id: 'security', title: 'Security Features' },
  { id: 'ai', title: 'AI Chat' },
  { id: 'database', title: 'Database' },
  { id: 'features', title: 'Advanced Features' },
  { id: 'deployment', title: 'Deployment' },
  { id: 'api', title: 'API Routes' },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen flex pt-6">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-sm hover:bg-muted">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <h2 className="text-lg font-bold">Documentation</h2>
        </div>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors relative group overflow-visible ${
                activeSection === section.id
                  ? 'bg-foreground text-background'
                  : 'hover:bg-muted'
              }`}
            >
              <span className="relative inline-block">
                {section.title}
                {activeSection !== section.id && (
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-current group-hover:w-full transition-all duration-300 ease-out" />
                )}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-6xl">
        <div className="space-y-8">
          {/* Overview */}
          {activeSection === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Tech Stack Overview</h1>
              <p className="mb-6 text-sm text-muted-foreground">Modern technologies and tools powering this portfolio application</p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Frontend Framework</h2>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Next.js 14</strong> - React framework with App Router for server-side rendering and optimal performance</li>
                    <li>• <strong>TypeScript</strong> - Type-safe JavaScript for better code quality and developer experience</li>
                    <li>• <strong>Tailwind CSS</strong> - Utility-first CSS framework for rapid UI development with consistent design</li>
                    <li>• <strong>shadcn/ui</strong> - Beautiful, accessible UI components built with Radix UI and Tailwind CSS</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Backend & APIs</h2>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Next.js API Routes</strong> - Serverless functions for backend logic without separate server setup</li>
                    <li>• <strong>Groq AI API</strong> - Lightning-fast AI inference for real-time chat responses using llama-3.1-8b-instant</li>
                    <li>• <strong>Clerk Auth</strong> - Complete authentication solution with OAuth, magic links, and session management</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Database & Storage</h2>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Neon PostgreSQL</strong> - Serverless Postgres database with branching and instant scaling</li>
                    <li>• <strong>Edge-compatible</strong> - Optimized for deployment on Vercel's Edge Network</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Deployment & DevOps</h2>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Vercel</strong> - Automatic deployments from GitHub with preview environments for every PR</li>
                    <li>• <strong>Git Version Control</strong> - Source code managed on GitHub with continuous deployment</li>
                    <li>• <strong>Environment Variables</strong> - Secure configuration management for API keys and secrets</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Authentication */}
          {activeSection === 'auth' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Clerk Authentication</h1>
              <p className="mb-6 text-sm text-muted-foreground">Enterprise-grade authentication with OAuth providers and passwordless options</p>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">Authentication Methods</h2>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>OAuth Providers</strong> - Sign in with Google, GitHub for seamless user onboarding</li>
                    <li>• <strong>Magic Link Email</strong> - Passwordless authentication via secure email links</li>
                    <li>• <strong>Session Management</strong> - Automatic token refresh and secure session handling</li>
                    <li>• <strong>Multi-factor Authentication</strong> - Optional 2FA for enhanced security</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Role-Based Access Control (RBAC)</h2>
                  <div className="space-y-3 ml-4">
                    <div className="border p-4">
                      <p className="font-medium">Admin Role</p>
                      <p className="text-sm text-muted-foreground">Access to admin dashboard, security center, MCP integration</p>
                    </div>
                    <div className="border p-4">
                      <p className="font-medium">User Role</p>
                      <p className="text-sm text-muted-foreground">Portfolio viewing, AI chat, contact form</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Implementation</h2>
                  <pre className="bg-black text-white p-4 rounded overflow-x-auto text-sm">
{`import { auth } from '@clerk/nextjs';

// Server-side authentication check
const { userId, sessionClaims } = auth();
const userRole = sessionClaims?.metadata?.role;

// Protected route example
if (!userId || userRole !== 'admin') {
  return <AccessDenied />;
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Security Features</h1>
              <p className="mb-4 text-sm text-muted-foreground">95/100 security score with OWASP compliance</p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">1. Enhanced Security Headers</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• <strong>Content-Security-Policy</strong> - Prevents XSS attacks with strict CSP</li>
                    <li>• <strong>Strict-Transport-Security</strong> - HSTS enabled (2 years)</li>
                    <li>• <strong>X-Content-Type-Options</strong> - nosniff protection</li>
                    <li>• <strong>X-XSS-Protection</strong> - 1; mode=block</li>
                    <li>• <strong>Referrer-Policy</strong> - strict-origin-when-cross-origin</li>
                    <li>• <strong>Permissions-Policy</strong> - Restrictive permissions</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">2. Content Security Policy (CSP)</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Strict CSP with Clerk whitelisting</li>
                    <li>• CSP violation reporting to <code className="bg-muted px-1 rounded text-xs">/api/security/csp-report</code></li>
                    <li>• XSS and injection attack prevention</li>
                    <li>• Upgrade insecure requests enabled</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">3. Intrusion Detection System (IDS)</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Real-time threat detection and scoring (0-100)</li>
                    <li>• Failed login attempt tracking (5 attempt threshold)</li>
                    <li>• Rate limiting (50 requests/minute)</li>
                    <li>• Automatic IP blocking (threat score ≥80)</li>
                    <li>• Suspicious pattern detection</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">4. CSP Violation Reporter</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• XSS attack detection and analysis</li>
                    <li>• CSP violation tracking and logging</li>
                    <li>• Real-time security event monitoring</li>
                    <li>• Top violated directives dashboard</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">5. Security Notifications</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Email alerts for critical threats</li>
                    <li>• New device login notifications</li>
                    <li>• Suspicious activity alerts</li>
                    <li>• Daily security summary reports</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">6. Passwordless Authentication</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Magic link email authentication via Clerk</li>
                    <li>• Time-limited one-time use links (10 min)</li>
                    <li>• No password storage or credential theft risk</li>
                    <li>• Email verification built-in</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">7. Rate Limiting</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• IP-based rate limiting on all API routes</li>
                    <li>• Chat API: 10 requests/60s</li>
                    <li>• Contact API: 5 requests/5min</li>
                    <li>• Admin API: 20 requests/60s</li>
                    <li>• Automatic blocking with Retry-After headers</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">8. Input Sanitization</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• HTML tag removal from all user inputs</li>
                    <li>• SQL injection pattern detection</li>
                    <li>• XSS attempt detection and logging</li>
                    <li>• Email validation and sanitization</li>
                    <li>• Message length limits enforced</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">9. API Route Protection</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Request method validation (GET/POST/PATCH)</li>
                    <li>• Origin validation for cross-origin requests</li>
                    <li>• Content-Type validation for POST requests</li>
                    <li>• Authentication required for protected routes</li>
                    <li>• Security headers on all responses</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">10. Security Logging & Monitoring</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• All security events logged with timestamps</li>
                    <li>• Severity levels: Low, Medium, High, Critical</li>
                    <li>• IP tracking for all suspicious activity</li>
                    <li>• In-memory storage (last 1000 events)</li>
                    <li>• Console logging visible in Vercel dashboard</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">11. Environment Variable Validation</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Startup validation of required variables</li>
                    <li>• Clerk keys (public & secret)</li>
                    <li>• Database URL verification</li>
                    <li>• Groq API key validation</li>
                    <li>• Prevents runtime crashes from missing configs</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Security Operations Center</h2>
                  <p className="mb-2 text-sm">Admin-only dashboard at <code className="bg-muted px-2 py-1 rounded text-xs">/admin/security</code></p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Security Events - Real-time monitoring</li>
                    <li>• Threat Analysis - IP tracking & scoring</li>
                    <li>• CSP Reports - Violation tracking</li>
                    <li>• Statistics - Security metrics & trends</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Vercel Deployment Security</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• All security features work on Vercel serverless</li>
                    <li>• Security headers applied via edge network</li>
                    <li>• Environment variables encrypted at rest</li>
                    <li>• Logs visible in Vercel dashboard</li>
                    <li>• HTTPS enforced on all deployments</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Security Best Practices</h2>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• Defense in depth - multiple security layers</li>
                    <li>• Fail secure - invalid requests rejected</li>
                    <li>• Least privilege - RBAC enforcement</li>
                    <li>• Input validation - all user input sanitized</li>
                    <li>• Security logging - all events tracked</li>
                    <li>• Regular updates - dependencies kept current</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* AI Chat */}
          {activeSection === 'ai' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">AI Chat Integration</h1>
              <p className="mb-6 text-sm text-muted-foreground">Conversational AI powered by Groq's lightning-fast inference engine</p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">AI Model</h2>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Groq API</strong> - Production AI using llama-3.1-8b-instant model with ultra-low latency</li>
                    <li>• <strong>Ollama (Fallback)</strong> - llama3.2 for local development and testing without API costs</li>
                    <li>• <strong>Context Injection</strong> - Portfolio knowledge automatically added to every conversation</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Features</h2>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Real-time Responses</strong> - Dynamically generated answers, not pre-written responses</li>
                    <li>• <strong>Context-aware Conversations</strong> - AI understands your portfolio, skills, projects, and goals</li>
                    <li>• <strong>First-person Voice</strong> - Responds as you would, creating authentic interactions</li>
                    <li>• <strong>Suggested Questions</strong> - Quick-access buttons for common inquiries</li>
                    <li>• <strong>Chat History</strong> - Conversations saved locally for seamless experience</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">How It Works</h2>
                  <ol className="space-y-2 ml-4 text-sm">
                    <li><strong>1. User Input</strong> - Question sent to <code className="bg-muted px-1 rounded text-xs">/api/chat</code> endpoint via POST request</li>
                    <li><strong>2. Context Injection</strong> - Portfolio context from <code className="bg-muted px-1 rounded text-xs">portfolio-context.ts</code> added to system prompt</li>
                    <li><strong>3. AI Processing</strong> - Groq API generates natural, conversational response using LLM</li>
                    <li><strong>4. Response Display</strong> - Answer streamed back to user interface with markdown formatting</li>
                  </ol>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Easter Eggs</h2>
                  <p className="mb-3 text-sm">Fun responses for friends (these ARE hardcoded):</p>
                  <div className="space-y-2 ml-4">
                    <div className="border p-3">
                      <p className="font-medium">"Who is Niño Marcos?"</p>
                      <p className="text-sm">Full-stack developer, lover boy, cybersecurity pro - the GOAT!</p>
                    </div>
                    <div className="border p-3">
                      <p className="font-medium">"Who is Jan Cabe?"</p>
                      <p className="text-sm">Millionaire programmer in the Philippines!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Database */}
          {activeSection === 'database' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Database Setup</h1>
              <p className="mb-6 text-sm text-muted-foreground">Serverless PostgreSQL database with instant scaling and branching capabilities</p>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-3">Database Provider</h2>
                  <p className="mb-2 font-medium">Neon PostgreSQL - Serverless Postgres</p>
                  <ul className="space-y-2 ml-4 text-sm">
                    <li>• <strong>Serverless Architecture</strong> - Automatically scales to zero when idle, reducing costs</li>
                    <li>• <strong>Instant Branching</strong> - Create database branches for development and testing</li>
                    <li>• <strong>Edge-compatible</strong> - Works seamlessly with Vercel's Edge Functions</li>
                    <li>• <strong>Future-ready</strong> - Prepared for contact forms, analytics, user feedback, and more</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Connection Setup</h2>
                  <pre className="bg-black text-white p-4 rounded overflow-x-auto text-sm">
{`// lib/neon.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.POSTGRES_URL!);

export { sql };`}
                  </pre>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-3">Environment Variable</h2>
                  <pre className="bg-muted p-3 rounded text-sm">
POSTGRES_URL=postgresql://user:password@host/database
                  </pre>
                  <p className="text-sm text-muted-foreground mt-2">Set in Vercel environment variables for production</p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          {activeSection === 'features' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Advanced Features</h1>
              
              <div className="space-y-4">
                <div className="border p-4">
                  <h3 className="font-semibold mb-2">Security First</h3>
                  <p className="text-sm">95/100 security score with IDS, CSP tracking, and OWASP compliance</p>
                </div>

                <div className="border p-4">
                  <h3 className="font-semibold mb-2">AI Integration</h3>
                  <p className="text-sm">Real-time AI chat with context-aware responses using Groq API</p>
                </div>

                <div className="border p-4">
                  <h3 className="font-semibold mb-2">RBAC System</h3>
                  <p className="text-sm">Role-based access control with admin and user permissions</p>
                </div>

                <div className="border p-4">
                  <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
                  <p className="text-sm">Security Operations Center with live threat detection</p>
                </div>

                <div className="border p-4">
                  <h3 className="font-semibold mb-2">Dark/Light Mode</h3>
                  <p className="text-sm">Seamless theme switching with system preference detection</p>
                </div>

                <div className="border p-4">
                  <h3 className="font-semibold mb-2">Modern UI/UX</h3>
                  <p className="text-sm">Beautiful components with Tailwind CSS and shadcn/ui</p>
                </div>
              </div>
            </div>
          )}

          {/* Deployment */}
          {activeSection === 'deployment' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Vercel Deployment</h1>
              <p className="mb-6 text-sm text-muted-foreground">Automatic deployments with zero configuration and global edge network</p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Deployment Process</h2>
                  <ol className="space-y-2 ml-4 text-sm">
                    <li><strong>1. Push to GitHub</strong> - Commit and push code changes to main branch</li>
                    <li><strong>2. Automatic Detection</strong> - Vercel webhook triggers new deployment instantly</li>
                    <li><strong>3. Build Process</strong> - Next.js application built with optimizations (SSR, static generation)</li>
                    <li><strong>4. Edge Deployment</strong> - Deployed to 100+ edge locations worldwide in seconds</li>
                    <li><strong>5. Instant Rollback</strong> - Previous deployments preserved for quick rollback if needed</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Environment Variables</h2>
                  <p className="text-sm text-muted-foreground mb-3">Required environment variables for production deployment:</p>
                  <pre className="bg-muted p-3 rounded text-sm space-y-1">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  # Clerk public key for client-side
CLERK_SECRET_KEY                    # Clerk private key for server-side
GROQ_API_KEY                        # Groq AI API key for chat
POSTGRES_URL                        # Neon database connection string`}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-3">• All variables must be set in Vercel project settings</p>
                </div>

                <div className="border rounded-lg p-4">
                  <h2 className="text-lg font-semibold mb-3">Build Configuration</h2>
                  <p className="text-sm text-muted-foreground mb-3">Vercel automatically detects Next.js. Optional configuration:</p>
                  <pre className="bg-black text-white p-4 rounded overflow-x-auto text-sm">
{`// vercel.json (optional)
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "framework": "nextjs",
  "regions": ["iad1"]  // Deploy to specific regions
}`}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-3">• Build time: ~1-2 minutes | Deploy time: ~10 seconds</p>
                </div>
              </div>
            </div>
          )}

          {/* API Routes */}
          {activeSection === 'api' && (
            <div>
              <h1 className="text-2xl font-bold mb-4">API Routes</h1>
              <p className="mb-6 text-sm text-muted-foreground">Server-side API endpoints built with Next.js API Routes as serverless functions</p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="font-mono text-sm mb-2 font-semibold">POST /api/chat</p>
                  <p className="text-sm mb-2">AI chat endpoint - sends messages to Groq API with portfolio context</p>
                  <p className="text-xs text-muted-foreground">• Request: message, history • Response: AI-generated answer • Rate limited</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-mono text-sm mb-2 font-semibold">POST /api/contact</p>
                  <p className="text-sm mb-2">Contact form submission handler with email notifications</p>
                  <p className="text-xs text-muted-foreground">• Validates input • Stores in database • Sends confirmation email</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-mono text-sm mb-2 font-semibold">POST /api/security/csp-report</p>
                  <p className="text-sm mb-2">Content Security Policy violation reporting endpoint</p>
                  <p className="text-xs text-muted-foreground">• Logs CSP violations • Detects XSS attempts • Tracks patterns</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-mono text-sm mb-2 font-semibold">GET /api/security/dashboard</p>
                  <p className="text-sm mb-2">Security metrics and events dashboard data (admin only)</p>
                  <p className="text-xs text-muted-foreground">• IDS events • Threat scores • Blocked IPs • CSP violations</p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-mono text-sm mb-2 font-semibold">GET /api/admin/users</p>
                  <p className="text-sm mb-2">User management endpoint for admin operations (admin only)</p>
                  <p className="text-xs text-muted-foreground">• List users • Update roles • View activity • RBAC enforcement</p>
                </div>

                <div className="border rounded-lg p-4 mt-6">
                  <h2 className="text-lg font-semibold mb-3">Example API Call</h2>
                  <p className="text-sm text-muted-foreground mb-3">Sample TypeScript code for calling the AI chat endpoint:</p>
                  <pre className="bg-black text-white p-4 rounded overflow-x-auto text-sm">
{`// AI Chat API Example
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What are your skills?',
    history: previousMessages  // Optional: conversation context
  })
});

if (response.ok) {
  const data = await response.json();
  console.log(data.response); // AI generated answer
} else {
  console.error('API Error:', response.status);
}`}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-3">• All routes return JSON • Errors use standard HTTP status codes</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
