"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import Image from "next/image"

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
  companyLogo?: string
}

export function TestimonialSection() {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah Chen",
      role: "Head of Engineering",
      company: "TechFlow Inc",
      content: "AccessiCheck saved us months of manual testing. We went from 60% to 95% WCAG compliance in just two weeks. The AI insights are incredibly accurate.",
      rating: 5,
      avatar: "/avatars/sarah.jpg"
    },
    {
      name: "Marcus Rodriguez",
      role: "UX Director",
      company: "DesignCorp",
      content: "The detailed reports and code examples made it easy for our team to implement fixes. We avoided a potential lawsuit and improved our user experience significantly.",
      rating: 5,
      avatar: "/avatars/marcus.jpg"
    },
    {
      name: "Emily Watson",
      role: "Product Manager",
      company: "StartupXYZ",
      content: "As a startup, we couldn't afford expensive accessibility audits. AccessiCheck gave us enterprise-level insights at a fraction of the cost.",
      rating: 5,
      avatar: "/avatars/emily.jpg"
    },
    {
      name: "David Kim",
      role: "CTO",
      company: "E-commerce Plus",
      content: "The continuous monitoring feature catches issues before they become problems. Our accessibility score has consistently improved since using AccessiCheck.",
      rating: 5,
      avatar: "/avatars/david.jpg"
    },
    {
      name: "Lisa Thompson",
      role: "Accessibility Lead",
      company: "Global Corp",
      content: "Finally, a tool that understands the nuances of accessibility. The AI recommendations are spot-on and have helped us create truly inclusive experiences.",
      rating: 5,
      avatar: "/avatars/lisa.jpg"
    },
    {
      name: "Alex Johnson",
      role: "Frontend Developer",
      company: "WebStudio",
      content: "The code examples and fix suggestions are incredibly helpful. I've learned so much about accessibility best practices just by using this tool.",
      rating: 5,
      avatar: "/avatars/alex.jpg"
    }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-4 h-4 mr-2 text-yellow-400 fill-current" />
            Customer Stories
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Loved by Developers & Designers
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            See how teams around the world are using AccessiCheck to build more inclusive web experiences.
          </p>
        </div>
        
        {/* Stats */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-sm text-muted-foreground">Websites Scanned</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">99%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative">
              <CardContent className="pt-6">
                {/* Quote icon */}
                <Quote className="h-8 w-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                {/* Content */}
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-4">
            Join thousands of satisfied customers making the web more accessible.
          </p>
        </div>
      </div>
    </section>
  )
}