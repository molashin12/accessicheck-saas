"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ExternalLink,
  FileText,
  BarChart3,
  Shield,
  Eye,
  Code,
  Lightbulb
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { cn, getSeverityColor } from "@/lib/utils"

interface ScanIssue {
  id: string
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  element: string
  description: string
  recommendation: string
  wcagReference: string
  xpath: string | null
  selector: string | null
}

interface ScanDetails {
  id: string
  url: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  wcagLevel: 'A' | 'AA' | 'AAA'
  score: number | null
  progress: number
  createdAt: string
  completedAt: string | null
  aiInsights: string | null
  issues: ScanIssue[]
  metadata: {
    pageTitle?: string
    totalElements?: number
    scanDuration?: number
    userAgent?: string
  }
}

export default function ScanDetailsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [scan, setScan] = useState<ScanDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const scanId = params.id as string

  useEffect(() => {
    if (session && scanId) {
      fetchScanDetails()
    }
  }, [session, scanId])

  const fetchScanDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/scan?scanId=${scanId}`)
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Scan Not Found",
            description: "The requested scan could not be found.",
            variant: "destructive"
          })
          router.push('/dashboard/scans')
          return
        }
        throw new Error('Failed to fetch scan details')
      }

      const data = await response.json()
      setScan(data.scan)
    } catch (error) {
      console.error('Error fetching scan details:', error)
      toast({
        title: "Error",
        description: "Failed to load scan details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!scan) return
    
    try {
      const response = await fetch(`/api/scans/${scan.id}/export`)
      if (!response.ok) throw new Error('Failed to export scan')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `accessibility-report-${scan.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Export Successful",
        description: "Report has been downloaded.",
        variant: "success"
      })
    } catch (error) {
      console.error('Error exporting scan:', error)
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-success" />
      case 'RUNNING':
        return <Loader2 className="h-5 w-5 text-info animate-spin" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-warning" />
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      COMPLETED: 'success' as const,
      RUNNING: 'default' as const,
      PENDING: 'secondary' as const,
      FAILED: 'destructive' as const
    }
    return variants[status as keyof typeof variants] || 'secondary'
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground'
    if (score >= 90) return 'text-success'
    if (score >= 70) return 'text-warning'
    return 'text-destructive'
  }

  const getIssuesByType = () => {
    if (!scan) return {}
    return scan.issues.reduce((acc, issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const getIssuesBySeverity = () => {
    if (!scan) return { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
    return scan.issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1
      return acc
    }, { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!scan) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium mb-2">Scan not found</h3>
        <p className="text-muted-foreground mb-4">
          The requested scan could not be found.
        </p>
        <Button asChild>
          <Link href="/dashboard/scans">Back to Scans</Link>
        </Button>
      </div>
    )
  }

  const issuesBySeverity = getIssuesBySeverity()
  const issuesByType = getIssuesByType()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/scans" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Scans
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scan Details</h1>
            <p className="text-muted-foreground">
              {new URL(scan.url).hostname}
            </p>
          </div>
        </div>
        {scan.status === 'COMPLETED' && (
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        )}
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getStatusIcon(scan.status)}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{scan.metadata.pageTitle || 'Untitled Page'}</h3>
                  <Badge variant={getStatusBadge(scan.status)}>
                    {scan.status.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span className="truncate max-w-[400px]">{scan.url}</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={scan.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {scan.score !== null ? (
                  <span className={getScoreColor(scan.score)}>{scan.score}%</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">Accessibility Score</div>
            </div>
          </div>

          {scan.status === 'RUNNING' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Scanning progress</span>
                <span>{scan.progress}%</span>
              </div>
              <Progress value={scan.progress} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div>
              <div className="text-sm text-muted-foreground">WCAG Level</div>
              <Badge variant="outline" className="mt-1">{scan.wcagLevel}</Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Issues</div>
              <div className="text-lg font-semibold mt-1">{scan.issues.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Scanned</div>
              <div className="text-sm mt-1">
                {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="text-sm mt-1">
                {scan.metadata.scanDuration ? `${scan.metadata.scanDuration}s` : '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Issues ({scan.issues.length})
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Technical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Issues by Severity */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {issuesBySeverity.CRITICAL}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High</CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {issuesBySeverity.HIGH}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medium</CardTitle>
                <AlertTriangle className="h-4 w-4 text-info" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-info">
                  {issuesBySeverity.MEDIUM}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">
                  {issuesBySeverity.LOW}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Issues by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Issues by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(issuesByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {type.replace(/_/g, ' ')}
                    </span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {scan.issues.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
                <p className="text-muted-foreground">
                  Great! This page appears to be accessible according to WCAG {scan.wcagLevel} guidelines.
                </p>
              </CardContent>
            </Card>
          ) : (
            scan.issues.map((issue) => (
              <Card key={issue.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={issue.severity === 'CRITICAL' ? 'destructive' : 
                                  issue.severity === 'HIGH' ? 'warning' : 
                                  issue.severity === 'MEDIUM' ? 'default' : 'secondary'}
                        >
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline">{issue.type.replace(/_/g, ' ')}</Badge>
                      </div>
                      <CardTitle className="text-lg">{issue.element}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recommendation</h4>
                    <p className="text-sm">{issue.recommendation}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      WCAG Reference: {issue.wcagReference}
                    </div>
                    {issue.selector && (
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {issue.selector}
                      </code>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scan.aiInsights ? (
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{scan.aiInsights}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No AI Insights Available</h3>
                  <p className="text-muted-foreground">
                    AI insights are generated for completed scans with issues.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Scan Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scan ID:</span>
                      <code className="text-xs">{scan.id}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">WCAG Level:</span>
                      <span>{scan.wcagLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Elements:</span>
                      <span>{scan.metadata.totalElements || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User Agent:</span>
                      <span className="text-xs truncate max-w-[200px]">
                        {scan.metadata.userAgent || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timestamps</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(scan.createdAt).toLocaleString()}</span>
                    </div>
                    {scan.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{new Date(scan.completedAt).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{scan.metadata.scanDuration ? `${scan.metadata.scanDuration}s` : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}