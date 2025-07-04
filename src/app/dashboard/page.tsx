"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UrlScanner } from "@/components/url-scanner"
import { useToast } from "@/components/ui/use-toast"
import { 
  Scan, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Download,
  Eye
} from "lucide-react"
import { formatDateTime, formatNumber } from "@/lib/utils"
import Link from "next/link"

interface ScanData {
  id: string
  url: string
  status: 'RUNNING' | 'COMPLETED' | 'FAILED'
  progress: number
  score?: number
  createdAt: string
  completedAt?: string
  wcagLevel: string
  issues: {
    id: string
    type: string
    severity: 'CRITICAL' | 'WARNING' | 'INFO'
    description: string
  }[]
}

interface UserStats {
  totalScans: number
  avgScore: number
  criticalIssues: number
  scanCredits: number
  plan: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [scans, setScans] = useState<ScanData[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      const [scansResponse, statsResponse] = await Promise.all([
        fetch('/api/scans'),
        fetch('/api/user/stats')
      ])

      if (scansResponse.ok) {
        const scansData = await scansResponse.json()
        setScans(scansData)
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'RUNNING':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />
      case 'FAILED':
        return <AlertTriangle className="h-4 w-4 text-error" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success' as const
      case 'RUNNING':
        return 'warning' as const
      case 'FAILED':
        return 'error' as const
      default:
        return 'default' as const
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success'
    if (score >= 70) return 'text-warning'
    return 'text-error'
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your dashboard.
            </p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || session?.user?.email}
          </p>
        </div>
        <Button asChild>
          <Link href="/pricing">
            <CreditCard className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <Scan className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalScans)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>
                {stats.avgScore}/100
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-error">
                {formatNumber(stats.criticalIssues)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scan Credits</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scanCredits}</div>
              <p className="text-xs text-muted-foreground">
                {stats.plan} Plan
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Scan */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <UrlScanner onScanComplete={fetchDashboardData} />
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="text-center py-8">
              <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No scans yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by scanning your first website above.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {getStatusIcon(scan.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{scan.url}</span>
                        <Badge variant={getStatusVariant(scan.status)}>
                          {scan.status}
                        </Badge>
                        <Badge variant="outline">
                          WCAG {scan.wcagLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDateTime(scan.createdAt)}</span>
                        {scan.score && (
                          <span className={getScoreColor(scan.score)}>
                            Score: {scan.score}/100
                          </span>
                        )}
                        {scan.issues.length > 0 && (
                          <span>
                            {scan.issues.length} issues found
                          </span>
                        )}
                      </div>
                      {scan.status === 'RUNNING' && (
                        <Progress value={scan.progress} className="mt-2 w-full max-w-xs" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {scan.status === 'COMPLETED' && (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/scan/${scan.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={scan.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}