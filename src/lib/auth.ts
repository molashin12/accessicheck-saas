import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        
        // Get user profile with subscription info
        const userProfile = await prisma.userProfile.findUnique({
          where: { userId: user.id },
        })
        
        if (userProfile) {
          session.user.plan = userProfile.plan
          session.user.scanCredits = userProfile.scanCredits
          session.user.subscriptionStatus = userProfile.subscriptionStatus
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user profile exists, create if not
          const existingProfile = await prisma.userProfile.findUnique({
            where: { userId: user.id },
          })
          
          if (!existingProfile) {
            await prisma.userProfile.create({
              data: {
                userId: user.id,
                plan: "FREE",
                scanCredits: 3, // Free tier gets 3 scans
                subscriptionStatus: "ACTIVE",
              },
            })
          }
          
          return true
        } catch (error) {
          console.error("Error creating user profile:", error)
          return false
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan?: "FREE" | "PRO" | "ENTERPRISE"
      scanCredits?: number
      subscriptionStatus?: "ACTIVE" | "CANCELED" | "PAST_DUE"
    }
  }
  
  interface User {
    plan?: "FREE" | "PRO" | "ENTERPRISE"
    scanCredits?: number
    subscriptionStatus?: "ACTIVE" | "CANCELED" | "PAST_DUE"
  }
}