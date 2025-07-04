"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Clock } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="space-y-6">
                {/* Badge */}
                <div className="flex justify-center">
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Your Accessibility Journey Today
                  </Badge>
                </div>
                
                {/* Heading */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Make Your Website
                    <span className="text-primary block">Accessible to Everyone?</span>
                  </h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                    Join thousands of developers and businesses who trust our AI-powered accessibility scanner to create inclusive web experiences.
                  </p>
                </div>
                
                {/* Features */}
                <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <span>Instant Results</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span>WCAG Compliant</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <span>24/7 Monitoring</span>
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <Button size="lg" className="px-8" asChild>
                    <Link href="/auth/signin">
                      Start Free Scan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8" asChild>
                    <Link href="#pricing">
                      View Pricing
                    </Link>
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div className="pt-6 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    Trusted by 10,000+ websites worldwide
                  </p>
                  <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
                    <div className="text-xs font-medium">✓ No Credit Card Required</div>
                    <div className="text-xs font-medium">✓ 5 Free Scans</div>
                    <div className="text-xs font-medium">✓ Instant Setup</div>
                    <div className="text-xs font-medium">✓ Cancel Anytime</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}