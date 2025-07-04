"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  cta: string
  icon: React.ReactNode
}

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false)

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      description: "Perfect for trying out our accessibility scanner",
      price: {
        monthly: 0,
        yearly: 0
      },
      scanCredits: "5 scans/month",
      features: [
        "5 website scans per month",
        "Basic WCAG 2.1 AA compliance",
        "PDF reports",
        "Email support",
        "Basic issue detection"
      ],
      cta: "Start Free",
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: "pro",
      name: "Pro",
      description: "For growing businesses and development teams",
      price: {
        monthly: 49,
        yearly: 490
      },
      scanCredits: "100 scans/month",
      features: [
        "100 website scans per month",
        "Full WCAG 2.1 A/AA/AAA compliance",
        "Advanced AI insights",
        "Code examples & fix suggestions",
        "Priority email support",
        "Continuous monitoring",
        "Team collaboration",
        "API access"
      ],
      popular: true,
      cta: "Start Pro Trial",
      icon: <Crown className="h-5 w-5" />
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: {
        monthly: 199,
        yearly: 1990
      },
      scanCredits: "Unlimited scans",
      features: [
        "Unlimited website scans",
        "Custom WCAG compliance levels",
        "White-label reports",
        "Dedicated account manager",
        "24/7 phone & email support",
        "Custom integrations",
        "SSO & advanced security",
        "Training & onboarding",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      icon: <Building className="h-5 w-5" />
    }
  ]

  const getPrice = (plan: PricingPlan) => {
    if (plan.price.monthly === 0) return "Free"
    const price = isYearly ? plan.price.yearly : plan.price.monthly
    const period = isYearly ? "year" : "month"
    return `$${price}/${period}`
  }

  const getSavings = (plan: PricingPlan) => {
    if (plan.price.monthly === 0) return null
    const yearlyMonthly = plan.price.yearly / 12
    const savings = ((plan.price.monthly - yearlyMonthly) / plan.price.monthly * 100).toFixed(0)
    return `Save ${savings}%`
  }

  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mb-8">
            Choose the plan that fits your needs. All plans include our core accessibility scanning features.
          </p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
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
            <span className={`text-sm ${isYearly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="ml-2">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>
        
        {/* Pricing cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {plans.map((plan) => (
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
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {getPrice(plan)}
                    {plan.price.monthly > 0 && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {isYearly ? '/year' : '/month'}
                      </span>
                    )}
                  </div>
                  
                  {isYearly && getSavings(plan) && (
                    <div className="text-sm text-success font-medium">
                      {getSavings(plan)}
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  
                  <div className="text-sm font-medium text-primary">
                    {plan.scanCredits}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  asChild
                >
                  <Link href={plan.id === 'enterprise' ? '/contact' : '/auth/signin'}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include SSL security, 99.9% uptime, and GDPR compliance.
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom plan? <Link href="/contact" className="text-primary hover:underline">Contact our sales team</Link>
          </p>
        </div>
      </div>
    </section>
  )
}