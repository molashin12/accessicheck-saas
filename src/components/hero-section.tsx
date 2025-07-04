'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Shield, Zap, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

export function HeroSection() {
  const [demoUrl, setDemoUrl] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const handleDemoScan = async () => {
    if (!demoUrl) return
    
    setIsScanning(true)
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false)
      // Redirect to demo results or show modal
    }, 3000)
  }

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container relative px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="w-fit">
              <Shield className="w-4 h-4 mr-2" />
              ADA Compliance Made Simple
            </Badge>
            
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Make Your Website
                <span className="text-primary block">
                  Accessible to All
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px]">
                AI-powered accessibility scanner that identifies WCAG violations, 
                prevents costly lawsuits, and opens your business to 1+ billion people with disabilities.
              </p>
            </div>
            
            {/* Key benefits */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Scan in minutes, not weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Prevent $50K+ lawsuits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">WCAG 2.1 AA compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">Actionable fix recommendations</span>
              </div>
            </div>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/signup">
                  Start Free Scan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Trusted by 1,000+ websites
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  4.9/5 from 200+ reviews
                </span>
              </div>
            </div>
          </div>
          
          {/* Right column - Demo scanner */}
          <div className="lg:pl-8">
            <Card className="p-6 shadow-2xl border-0 bg-card/50 backdrop-blur">
              <CardContent className="p-0 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    Try Free Accessibility Scan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enter any website URL to see accessibility issues instantly
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="demo-url" className="text-sm font-medium">
                      Website URL
                    </label>
                    <Input
                      id="demo-url"
                      type="url"
                      placeholder="https://example.com"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      className="text-lg h-12"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleDemoScan}
                    disabled={!demoUrl || isScanning}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    {isScanning ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Scan for Free
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center text-xs text-muted-foreground">
                  No signup required • Results in 30 seconds
                </div>
                
                {/* Demo results preview */}
                {isScanning && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scanning pages...</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '45%' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-error rounded-full" />
                        <span>12 Critical</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-warning rounded-full" />
                        <span>8 Warnings</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Trust indicators */}
            <div className="mt-6 text-center space-y-2">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>WCAG 2.1 AA</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>ADA Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>AI-Powered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}