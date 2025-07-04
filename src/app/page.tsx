import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Shield, Zap, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import { HeroSection } from '@/components/hero-section'
import { PricingSection } from '@/components/pricing-section'
import { TestimonialSection } from '@/components/testimonial-section'
import { FeatureSection } from '@/components/feature-section'
import { StatsSection } from '@/components/stats-section'
import { CTASection } from '@/components/cta-section'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Stats Section */}
        <StatsSection />
        
        {/* Problem Section */}
        <section className="py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge variant="destructive" className="mb-4">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Critical Problem
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                98% of Websites Fail Accessibility Tests
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                This puts businesses at risk of expensive lawsuits and excludes 1+ billion people with disabilities from accessing their content.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Legal Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive mb-2">$50K+</div>
                  <p className="text-sm text-muted-foreground">
                    Average cost of ADA lawsuit settlements. 3,500+ lawsuits filed in 2023 alone.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-warning/20">
                <CardHeader>
                  <CardTitle className="text-warning">Lost Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning mb-2">15%</div>
                  <p className="text-sm text-muted-foreground">
                    Of global population has disabilities. Inaccessible sites lose this entire market segment.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-info/20">
                <CardHeader>
                  <CardTitle className="text-info">Manual Audits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-info mb-2">6-12 weeks</div>
                  <p className="text-sm text-muted-foreground">
                    Traditional accessibility audits are slow, expensive ($5K-50K), and quickly outdated.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <FeatureSection />
        
        {/* How It Works Section */}
        <section className="py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                Get Compliant in 3 Simple Steps
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our AI-powered scanner makes accessibility compliance fast, affordable, and actionable.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Enter Your Website URL</h3>
                <p className="text-muted-foreground">
                  Simply paste your website URL and let our AI scanner analyze every page for accessibility issues.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis & Insights</h3>
                <p className="text-muted-foreground">
                  Our AI identifies WCAG violations, prioritizes fixes, and provides code examples for each issue.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Get Actionable Report</h3>
                <p className="text-muted-foreground">
                  Receive detailed compliance reports with step-by-step fixes and estimated implementation time.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <TestimonialSection />
        
        {/* Pricing */}
        <PricingSection />
        
        {/* CTA Section */}
        <CTASection />
        
        {/* Trust Indicators */}
        <section className="py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Trusted by Forward-Thinking Companies</h2>
              <p className="text-muted-foreground">
                Join thousands of businesses making the web more accessible
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              {/* Placeholder for company logos */}
              <div className="h-12 bg-muted rounded flex items-center justify-center">
                <span className="text-sm font-medium">Company Logo</span>
              </div>
              <div className="h-12 bg-muted rounded flex items-center justify-center">
                <span className="text-sm font-medium">Company Logo</span>
              </div>
              <div className="h-12 bg-muted rounded flex items-center justify-center">
                <span className="text-sm font-medium">Company Logo</span>
              </div>
              <div className="h-12 bg-muted rounded flex items-center justify-center">
                <span className="text-sm font-medium">Company Logo</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}