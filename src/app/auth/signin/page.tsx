"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Chrome, ArrowLeft, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const error = searchParams.get('error')

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push(callbackUrl)
      }
      setIsCheckingSession(false)
    })
  }, [])

  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: getErrorMessage(error),
        variant: "destructive"
      })
    }
  }, [error, toast])

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
        return 'Error in constructing an authorization URL'
      case 'OAuthCallback':
        return 'Error in handling the response from an OAuth provider'
      case 'OAuthCreateAccount':
        return 'Could not create OAuth account'
      case 'EmailCreateAccount':
        return 'Could not create email account'
      case 'Callback':
        return 'Error in the OAuth callback handler route'
      case 'OAuthAccountNotLinked':
        return 'Email already exists with a different provider'
      case 'EmailSignin':
        return 'Check your email for the sign in link'
      case 'CredentialsSignin':
        return 'Invalid credentials'
      case 'SessionRequired':
        return 'Please sign in to access this page'
      default:
        return 'An error occurred during authentication'
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Sign in error:', error)
      toast({
        title: "Sign In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <div className="flex items-center justify-center">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Sign In Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="p-3 rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Welcome to AccessiCheck
            </CardTitle>
            <p className="text-muted-foreground">
              Sign in to start scanning your websites for accessibility issues
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 text-base"
              variant="outline"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3" />
              ) : (
                <Chrome className="h-5 w-5 mr-3" />
              )}
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Why sign in?
                </span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1 rounded-full bg-success/10">
                  <Zap className="h-4 w-4 text-success" />
                </div>
                <span>Get 3 free website scans per month</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1 rounded-full bg-info/10">
                  <Shield className="h-4 w-4 text-info" />
                </div>
                <span>Save and track your scan history</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="p-1 rounded-full bg-warning/10">
                  <Users className="h-4 w-4 text-warning" />
                </div>
                <span>Access detailed accessibility reports</span>
              </div>
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground text-center">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="font-medium text-sm">New to AccessiCheck?</h3>
              <p className="text-xs text-muted-foreground">
                Start with our free plan and upgrade when you need more scans.
                No credit card required.
              </p>
              <Button variant="link" size="sm" asChild>
                <Link href="/pricing">
                  View Pricing Plans
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}