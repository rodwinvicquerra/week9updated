"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, Activity, Ban, TrendingUp, RefreshCw, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface SecurityDashboardData {
  ids: {
    stats: any
    recentEvents: any[]
    suspiciousIPs: any[]
  }
  csp: any
}

export default function SecurityDashboard() {
  const [data, setData] = useState<SecurityDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/security/dashboard')
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        toast.error('Failed to load security data')
      }
    } catch (err) {
      toast.error('Error loading security dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">Loading security dashboard...</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12 text-red-500">Failed to load security data</div>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'failed_login': return <Ban className="h-4 w-4" />
      case 'rate_limit_exceeded': return <TrendingUp className="h-4 w-4" />
      case 'suspicious_pattern': return <AlertTriangle className="h-4 w-4" />
      case 'unauthorized_access': return <AlertCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              Security Operations Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor intrusion detection, CSP violations, and threat activity
            </p>
          </div>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events (24h)</p>
                <p className="text-3xl font-bold">{data.ids.stats.eventsLast24h}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Events</p>
                <p className="text-3xl font-bold text-red-500">{data.ids.stats.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspicious IPs</p>
                <p className="text-3xl font-bold text-orange-500">{data.ids.stats.suspiciousIPs}</p>
              </div>
              <Ban className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CSP Violations (24h)</p>
                <p className="text-3xl font-bold text-purple-500">{data.csp.violationsLast24h}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="events" className="space-y-4">
          <TabsList>
            <TabsTrigger value="events">Security Events</TabsTrigger>
            <TabsTrigger value="threats">Threat IPs</TabsTrigger>
            <TabsTrigger value="csp">CSP Violations</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Security Events</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.ids.recentEvents.map((event: any) => (
                    <TableRow key={event.id}>
                      <TableCell className="text-sm">
                        {new Date(event.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.type)}
                          <span className="text-sm">{event.type.replace(/_/g, ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(event.severity) as any}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{event.ipAddress}</TableCell>
                      <TableCell className="text-sm max-w-md truncate">{event.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Suspicious IP Addresses</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Threat Score</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Factors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.ids.suspiciousIPs.map((item: any) => (
                    <TableRow key={item.ip}>
                      <TableCell className="font-mono">{item.ip}</TableCell>
                      <TableCell>
                        <Badge variant={item.threatScore.score >= 80 ? 'destructive' : 'default'}>
                          {item.threatScore.score}/100
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.threatScore.recommendedAction === 'block' ? 'destructive' : 'secondary'}>
                          {item.threatScore.recommendedAction}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.threatScore.factors.join(', ')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="csp" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">CSP Violations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Top Violated Directives</h3>
                  <div className="space-y-2">
                    {data.csp.topViolatedDirectives.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm">{item.directive}</span>
                        <Badge>{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Top Blocked URIs</h3>
                  <div className="space-y-2">
                    {data.csp.topBlockedUris.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm truncate max-w-[200px]">{item.uri}</span>
                        <Badge>{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-2">Recent Violations</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Directive</TableHead>
                    <TableHead>Blocked URI</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.csp.recentViolations.map((violation: any) => (
                    <TableRow key={violation.id}>
                      <TableCell className="text-sm">
                        {new Date(violation.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">{violation.effectiveDirective}</TableCell>
                      <TableCell className="text-sm font-mono truncate max-w-xs">
                        {violation.blockedUri}
                      </TableCell>
                      <TableCell className="text-sm font-mono">{violation.ipAddress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">IDS Event Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Failed Logins</span>
                    <Badge variant="destructive">{data.ids.stats.eventsByType.failed_login}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Rate Limit Exceeded</span>
                    <Badge variant="secondary">{data.ids.stats.eventsByType.rate_limit_exceeded}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Suspicious Patterns</span>
                    <Badge variant="default">{data.ids.stats.eventsByType.suspicious_pattern}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Unauthorized Access</span>
                    <Badge variant="destructive">{data.ids.stats.eventsByType.unauthorized_access}</Badge>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Overall Statistics</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Total Events</span>
                    <span className="font-bold">{data.ids.stats.totalEvents}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Events (24h)</span>
                    <span className="font-bold">{data.ids.stats.eventsLast24h}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Blocked IPs</span>
                    <span className="font-bold text-red-500">{data.ids.stats.blockedIPs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CSP Violations (Total)</span>
                    <span className="font-bold">{data.csp.totalViolations}</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
