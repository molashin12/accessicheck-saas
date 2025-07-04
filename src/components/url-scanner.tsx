"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Scan, AlertTriangle, CheckCircle, Info, ExternalLink } from "lucide-react"
import { isValidUrl } from "@/lib/utils"

interface ScanResult {
  url: string
  score: number
  issues: {
    severity: 'CRITICAL' | 'WARNING' | 'INFO'
    type: string
    description: string
    element?: string
  }[]
  scanTime: number
}

interface UrlScannerProps {
  onScanComplete?: (result: ScanResult) => void
  className?: string
}

export function UrlScanner({ onScanComplete, className }: UrlScannerProps) {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScanResult | null>(null)
  const { toast } = useToast()

  const simulateScan = async (targetUrl: string) => {
    setIsScanning(true)
    setProgress(0)
    setResult(null)

    // Simulate scanning progress
    const steps = [
      { progress: 20, message: "Loading page..." },
      { progress: 40, message: "Analyzing HTML structure..." },
      { progress: 60, message: "Checking color contrast..." },
      { progress: 80, message: "Validating ARIA attributes..." },
      { progress: 100, message: "Generating report..." }
    ]

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProgress(step.progress)
      
      toast({
        title: "Scanning Progress",
        description: step.message,
        variant: "info"
      })
    }

    // Simulate scan results
    const mockResult: ScanResult = {
      url: targetUrl,
      score: Math.floor(Math.random() * 40) + 60, // 60-100 score
      scanTime: Date.now(),
      issues: [
        {
          severity: 'CRITICAL',
          type: 'Missing Alt Text',
          description: 'Images without alternative text found',
          element: '<img src="hero.jpg">'
        },
        {
          severity: 'WARNING',
          type: 'Low Color Contrast',
          description: 'Text contrast ratio below WCAG AA standards',
          element: '.text-gray-400'
        },
        {
          severity: 'INFO',
          type: 'Missing ARIA Labels',
          description: 'Interactive elements could benefit from ARIA labels',
          element: '<button>Click here</button>'
        }
      ]
    }

    setResult(mockResult)
    setIsScanning(false)
    onScanComplete?.(mockResult)

    toast({
      title: "Scan Complete!",
      description: `Found ${mockResult.issues.length} accessibility issues`,
      variant: mockResult.score > 80 ? "success" : "warning"
    })
  }

  const handleScan = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to scan",
        variant: "destructive"
      })
      return
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL (e.g., https://example.com)",
        variant: "destructive"
      })
      return
    }

    await simulateScan(url)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-error" />
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-warning" />
      case 'INFO':
        return <Info className="h-4 w-4 text-info" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'error' as const
      case 'WARNING':
        return 'warning' as const
      case 'INFO':
        return 'info' as const
      default:
        return 'default' as const
    }
  }

  return (
    <div className={className}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            Website Accessibility Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter website URL (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isScanning}
              onKeyDown={(e) => e.key === 'Enter' && !isScanning && handleScan()}
            />
            <Button 
              onClick={handleScan} 
              disabled={isScanning}
              className="shrink-0"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Scan Now
                </>
              )}
            </Button>
          </div>

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {result && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">Scan Complete</span>
                </div>
                <Badge variant={result.score > 80 ? 'success' : result.score > 60 ? 'warning' : 'error'}>
                  Score: {result.score}/100
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{result.url}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Issues Found ({result.issues.length})</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {result.issues.map((issue, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                      {getSeverityIcon(issue.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{issue.type}</span>
                          <Badge variant={getSeverityVariant(issue.severity)} className="text-xs">
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{issue.description}</p>
                        {issue.element && (
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {issue.element}
                          </code>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">
                  View Full Report
                </Button>
                <Button size="sm">
                  Get Pro Analysis
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}