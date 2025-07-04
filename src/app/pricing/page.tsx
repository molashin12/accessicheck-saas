"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { Check, Zap, Crown, Building, ArrowRight } from "lucide-react"
import Link from "next/link"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  scanCredits: string
  popular?: boolean
  icon: React.ReactNode
  cta: string
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out our accessibility scanner",
    price: {
      monthly: 0,
      yearly: 0,
    },
    scanCredits: "3 scans/month",
    features: [
      "3 website scans per month",
      "Basic accessibility report",
      "WCAG AA compliance check",
      "Email support",
      "PDF report export",
    ],
    icon: <Zap className="h-6 w-6" />,
    cta: "Get Started Free",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for small businesses and agencies",
    price: {
      monthly: 29,
      yearly: 290,
    },
    scanCredits: "100 scans/month",
    features: [
      "100 website scans per month",
      "Advanced AI-powered analysis",
      "WCAG AA & AAA compliance",
      "Priority email support",
      "Detailed remediation guides",
      "API access",
      "Team collaboration (up to 5 users)",
      "Custom branding on reports",
      "Scheduled scans",
    ],
    popular: true,
    icon: <Crown className="h-6 w-6" />,
    cta: "Start Pro Trial",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    price: {
      monthly: 99,
      yearly: 990,
    },
    scanCredits: "Unlimited scans",
    features: [
      "Unlimited website scans",
      "Advanced AI insights & recommendations",
      "Full WCAG compliance suite",
      "24/7 phone & email support",
      "Dedicated account manager",
      "Advanced API with webhooks",
      "Unlimited team members",
      "White-label solution",
      "Custom integrations",
      "SLA guarantee",
      "On-premise deployment option",
    ],
    icon: <Building className="h-6 w-6" />,
    cta: "Contact Sales",
  },
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const handleSubscribe = async (planId: string) => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive"
      })
      return
    }

    if (planId === "free") {
      toast({
        title: "Already on Free Plan",
        description: "You're already using our free plan. Upgrade to unlock more features!",
        variant: "info"
      })
      return
    }

    if (planId === "enterprise") {
      // Redirect to contact form or calendar booking
      window.open("mailto:sales@accessicheck.com?subject=Enterprise Plan Inquiry", "_blank")
      return
    }

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          isYearly,
        }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      toast({
        title: "Subscription Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive"
      })
    }
  }

  const getPrice = (plan: PricingPlan) => {
    if (plan.price.monthly === 0) return "Free"
    const price = isYearly ? plan.price.yearly : plan.price.monthly
    const period = isYearly ? "year" : "month"
    return `$${price}/${period}`
  }

  const getSavings = (plan: PricingPlan) => {
    if (plan.price.monthly === 0) return null
    const yearlyTotal = plan.price.yearly
    const monthlyTotal = plan.price.monthly * 12
    const savings = monthlyTotal - yearlyTotal
    const percentage = Math.round((savings / monthlyTotal) * 100)
    return { amount: savings, percentage }
  }

  return (
    <div className="container mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Choose the perfect plan for your accessibility testing needs. 
          Start free, upgrade when you're ready.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`text-sm ${!isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isYearly ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isYearly ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {isYearly && (
            <Badge variant="success" className="ml-2">
              Save up to 17%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const savings = getSavings(plan)
          
          return (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
                
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    {getPrice(plan)}
                  </div>
                  {isYearly && savings && (
                    <div className="text-sm text-success mt-1">
                      Save ${savings.amount} ({savings.percentage}%)
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground mt-2">
                    {plan.scanCredits}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQ Section */}
      <div className="mt-24 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What happens when I exceed my scan limit?</h3>
              <p className="text-muted-foreground text-sm">
                You'll be notified when you're close to your limit. You can upgrade your plan or purchase additional scans.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-muted-foreground text-sm">
                We offer a 30-day money-back guarantee for all paid plans. No questions asked.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">What WCAG standards do you support?</h3>
              <p className="text-muted-foreground text-sm">
                We support WCAG 2.1 Level A, AA, and AAA standards. Our AI provides detailed compliance reports.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Is there an API available?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! Pro and Enterprise plans include API access for automated scanning and integration.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Do you offer custom solutions?</h3>
              <p className="text-muted-foreground text-sm">
                Enterprise customers can request custom features, integrations, and on-premise deployments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Make Your Website Accessible?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of businesses ensuring their websites are accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href={session ? "/dashboard" : "/auth/signin"}>
                  Start Free Trial
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}