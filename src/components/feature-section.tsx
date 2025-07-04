"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Shield, 
  Brain, 
  FileText, 
  Code, 
  BarChart3, 
  Clock, 
  CheckCircle,
  Eye,
  Lightbulb,
  Download,
  RefreshCw
} from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
}

export function FeatureSection() {
  const features: Feature[] = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms detect accessibility issues that traditional scanners miss, providing comprehensive WCAG compliance analysis.",
      badge: "AI"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Scanning",
      description: "Get detailed accessibility reports in under 30 seconds. No waiting, no delays—just immediate insights into your website's compliance status."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "WCAG 2.1 Compliance",
      description: "Full compliance checking for WCAG 2.1 Level A, AA, and AAA standards. Ensure your website meets all accessibility requirements."
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Code Examples",
      description: "Get specific code snippets and implementation examples for fixing each accessibility issue. No guesswork—just actionable solutions."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Detailed Reports",
      description: "Comprehensive PDF reports with executive summaries, technical details, and prioritized fix recommendations for your development team."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your accessibility improvements over time with detailed analytics and compliance scoring across multiple scans."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Visual Impairment Testing",
      description: "Simulate various visual impairments including color blindness, low vision, and screen reader compatibility testing."
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Smart Recommendations",
      description: "AI-generated suggestions prioritize fixes by impact and effort, helping you achieve maximum accessibility improvement efficiently."
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Continuous Monitoring",
      description: "Set up automated scans to monitor your website's accessibility status and get alerts when new issues are detected.",
      badge: "Pro"
    }
  ]

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <CheckCircle className="w-4 h-4 mr-2" />
            Comprehensive Solution
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Everything You Need for Accessibility
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            From instant AI-powered scans to detailed compliance reports, we provide all the tools you need to make your website accessible.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  {feature.badge && (
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>Setup takes less than 2 minutes</span>
          </div>
        </div>
      </div>
    </section>
  )
}