import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Get user profile
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      )
    }

    // Get scan statistics
    const [totalScans, completedScans, criticalIssuesCount] = await Promise.all([
      prisma.scan.count({
        where: { userId: session.user.id },
      }),
      prisma.scan.findMany({
        where: {
          userId: session.user.id,
          status: 'COMPLETED',
          score: { not: null },
        },
        select: { score: true },
      }),
      prisma.scanIssue.count({
        where: {
          scan: {
            userId: session.user.id,
          },
          severity: 'CRITICAL',
        },
      }),
    ])

    // Calculate average score
    const avgScore = completedScans.length > 0
      ? Math.round(
          completedScans.reduce((sum: number, scan: { score: number | null }) => sum + (scan.score || 0), 0) / completedScans.length
        )
      : 0

    const stats = {
      totalScans,
      avgScore,
      criticalIssues: criticalIssuesCount,
      scanCredits: userProfile.scanCredits,
      plan: userProfile.plan,
      subscriptionStatus: userProfile.subscriptionStatus,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Get user stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}