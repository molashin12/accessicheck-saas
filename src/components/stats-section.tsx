"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Shield, Zap } from "lucide-react"

interface StatItem {
  icon: React.ReactNode
  value: string
  label: string
  description: string
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const stats: StatItem[] = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: "1B+",
      label: "People with Disabilities",
      description: "Worldwide population that benefits from accessible websites"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-success" />,
      value: "98%",
      label: "Websites Fail Tests",
      description: "Of top websites have accessibility issues"
    },
    {
      icon: <Shield className="h-8 w-8 text-warning" />,
      value: "$50K+",
      label: "Average Lawsuit Cost",
      description: "Typical settlement for accessibility violations"
    },
    {
      icon: <Zap className="h-8 w-8 text-info" />,
      value: "30s",
      label: "Scan Time",
      description: "Get comprehensive accessibility reports instantly"
    }
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
            The Accessibility Crisis
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Web accessibility isn't just about compliance—it's about reaching everyone and protecting your business.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className={`text-center transition-all duration-500 hover:shadow-lg ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Don't let your website be part of the 98%. Start scanning today.
          </p>
        </div>
      </div>
    </section>
  )
}