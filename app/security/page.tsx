import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Activity, CheckCircle2, AlertTriangle, Download, ExternalLink, TrendingUp, Users, Zap, FileText, ArrowLeft, Home, MessageSquare } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { currentUser, clerkClient } from "@clerk/nextjs/server"
import { AccessDenied } from "@/components/common"

export const metadata: Metadata = {
  title: "Security Portfolio - Rodwin Vicquerra",
  description: "Comprehensive security implementation showcasing OAuth authentication, MCP integration, threat protection, and incident response capabilities.",
  openGraph: {
    title: "Security Portfolio - Rodwin Vicquerra",
    description: "Professional security implementation with OAuth authentication, MCP integration, and comprehensive threat protection",
  },
}

export default async function SecurityPage() {
  // Get current user with metadata
  const user = await currentUser()
  
  if (!user) {
    return <AccessDenied />
  }

  // Check for admin role in publicMetadata (case-insensitive)
  const publicMetadata = user.publicMetadata as { role?: string } | undefined
  const role = (publicMetadata?.role || 'viewer').toLowerCase()
  
  if (role !== 'admin') {
    return <AccessDenied />
  }

  // Fetch real user count from Clerk
  const { data: users } = await clerkClient.users.getUserList()
  const userCount = users.length

  return (
    <div className="min-h-screen bg-background py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild className="text-sm hover:bg-muted">
            <Link href="/portfolio">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Portfolio
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-3">
            <Shield className="h-3 w-3" />
            Security Portfolio
          </div>
          <h1 className="text-2xl font-bold mb-3">Professional Security Implementation</h1>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            Comprehensive security architecture showcasing OAuth authentication, threat protection, 
            and incident response capabilities
          </p>
        </div>

        {/* Implemented Security Features */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Security Features Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: "OAuth 2.0 Authentication", status: "Active", icon: Lock },
              { name: "Content Security Policy (CSP)", status: "Active", icon: Shield },
              { name: "Strict Transport Security (HSTS)", status: "Active", icon: Lock },
              { name: "XSS Protection Headers", status: "Active", icon: Shield },
              { name: "Clickjacking Prevention", status: "Active", icon: Shield },
              { name: "Rate Limiting on All API Endpoints", status: "Active", icon: Activity },
              { name: "Input Sanitization for User Content", status: "Active", icon: CheckCircle2 },
              { name: "SQL Injection Prevention", status: "Active", icon: Shield },
              { name: "Origin Validation", status: "Active", icon: CheckCircle2 },
              { name: "Security Event Logging", status: "Active", icon: Activity },
              { name: "Suspicious Pattern Detection", status: "Active", icon: Activity },
              { name: "Intrusion Detection System (IDS)", status: "Active", icon: Shield },
              { name: "CSP Violation Reporter", status: "Active", icon: Activity },
              { name: "Security Notifications", status: "Active", icon: CheckCircle2 },
              { name: "Passwordless Authentication", status: "Active", icon: Lock },
              { name: "Rate Limiting Strategy", status: "Documented", icon: Zap },
              { name: "Bot Detection", status: "Documented", icon: Users },
              { name: "DDoS Mitigation", status: "Documented", icon: TrendingUp },
              { name: "Incident Response Plan", status: "Documented", icon: AlertTriangle },
              { name: "Security Audit Procedures", status: "Documented", icon: FileText },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2">
                  <feature.icon className="h-3.5 w-3.5 text-foreground/70" />
                  <span className="text-xs font-medium">{feature.name}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    feature.status === "Active" 
                      ? "border-green-500 bg-green-500/10" 
                      : "border-blue-500 bg-blue-500/10"
                  }`}
                >
                  {feature.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Security Headers */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Security Headers Configuration</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { header: "Content-Security-Policy", value: "Strict CSP with Clerk whitelist", severity: "high" },
              { header: "Strict-Transport-Security", value: "HSTS enabled (2 years)", severity: "high" },
              { header: "X-Content-Type-Options", value: "nosniff", severity: "medium" },
              { header: "X-XSS-Protection", value: "1; mode=block", severity: "medium" },
              { header: "Referrer-Policy", value: "strict-origin-when-cross-origin", severity: "medium" },
              { header: "Permissions-Policy", value: "Restrictive permissions", severity: "low" },
            ].map((header, idx) => (
              <div key={idx} className="border border-border rounded-lg p-3 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-1">
                  <span className="font-semibold text-xs">{header.header}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      header.severity === "high" 
                        ? "border-red-500 bg-red-500/10" 
                        : header.severity === "medium"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-border"
                    }`}
                  >
                    {header.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{header.value}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Security Metrics */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Security Metrics & Performance</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <TrendingUp className="h-6 w-6 text-foreground/70 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">8</div>
              <div className="text-xs text-muted-foreground">Protected Routes</div>
            </div>
            <div className="border border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <Users className="h-6 w-6 text-foreground/70 mx-auto mb-2" />
              <div className="text-2xl font-bold mb-1">{userCount}</div>
              <div className="text-xs text-muted-foreground">Authenticated Users</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-bold mb-3">MCP Integration</h3>
            <p className="text-xs text-muted-foreground mb-3">
              View OAuth-protected MCP server implementation and demo
            </p>
            <Button asChild className="w-full gap-1 text-xs" size="sm">
              <Link href="/mcp-integration">
                View Demo
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-bold mb-3">Technical Documentation</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Complete security architecture and implementation details
            </p>
            <Button asChild variant="outline" className="w-full gap-1 text-xs" size="sm">
              <Link href="/mcp-security">
                Read Docs
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </Card>

          <Card className="p-4 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-bold mb-3">Incident Response</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Emergency procedures and security runbook
            </p>
            <Button asChild variant="outline" className="w-full gap-1 text-xs" size="sm">
              <a href="https://github.com/rodwinvicquerra/week8-echa-full-security-rodwinviquerra/blob/main/INCIDENT_RESPONSE.md" target="_blank" rel="noopener noreferrer">
                View Runbook
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </Card>
        </div>

        {/* Future Recommendations */}
        <Card className="p-6 mt-6 bg-muted/30">
          <h2 className="text-lg font-bold mb-3">Recommended Enhancements (Pro Tier)</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-foreground/70 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold mb-1">Upgrade to Vercel Pro</h4>
                <p className="text-xs text-muted-foreground">Enable Arcjet middleware for advanced rate limiting and bot protection</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-foreground/70 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold mb-1">Enable 2FA for All Users</h4>
                <p className="text-xs text-muted-foreground">Require two-factor authentication through Clerk settings</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-foreground/70 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold mb-1">Quarterly Security Audits</h4>
                <p className="text-xs text-muted-foreground">Schedule regular penetration testing and vulnerability assessments</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-foreground/70 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold mb-1">Real-time Monitoring</h4>
                <p className="text-xs text-muted-foreground">Implement Datadog or Sentry for live security event tracking</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Last Security Review: November 11, 2025</p>
          <p className="mt-2">Week 8 & 9 Deliverable - Security Implementation & Showcase</p>
        </div>
      </div>
    </div>
  )
}