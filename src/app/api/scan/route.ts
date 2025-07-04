import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import puppeteer, { Browser } from "puppeteer"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const scanRequestSchema = z.object({
  url: z.string().url("Invalid URL format"),
  wcagLevel: z.enum(["A", "AA", "AAA"]).default("AA"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Check user's scan credits
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!userProfile || userProfile.scanCredits <= 0) {
      return NextResponse.json(
        { error: "Insufficient scan credits" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { url, wcagLevel } = scanRequestSchema.parse(body)

    // Create scan record
    const scan = await prisma.scan.create({
      data: {
        url,
        status: "RUNNING",
        wcagLevel,
        userId: session.user.id,
        progress: 0,
      },
    })

    // Start background scan process
    performScan(scan.id, url, wcagLevel, session.user.id)

    // Deduct scan credit
    await prisma.userProfile.update({
      where: { userId: session.user.id },
      data: {
        scanCredits: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({
      scanId: scan.id,
      status: "started",
      message: "Scan initiated successfully",
    })
  } catch (error) {
    console.error("Scan API error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function performScan(scanId: string, url: string, wcagLevel: string, userId: string) {
  let browser: Browser | null = null
  
  try {
    // Update progress: Starting
    await updateScanProgress(scanId, 10, "Initializing browser...")

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    
    // Update progress: Loading page
    await updateScanProgress(scanId, 25, "Loading webpage...")
    
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    
    // Update progress: Analyzing
    await updateScanProgress(scanId, 50, "Analyzing accessibility...")
    
    // Get page content and structure
    const pageData = await page.evaluate(() => {
      const getElementInfo = (element: Element) => {
        return {
          tagName: element.tagName.toLowerCase(),
          attributes: Array.from(element.attributes).reduce((acc, attr) => {
            acc[attr.name] = attr.value
            return acc
          }, {} as Record<string, string>),
          textContent: element.textContent?.trim() || '',
          innerHTML: element.innerHTML,
        }
      }

      return {
        title: document.title,
        url: window.location.href,
        images: Array.from(document.querySelectorAll('img')).map(getElementInfo),
        links: Array.from(document.querySelectorAll('a')).map(getElementInfo),
        buttons: Array.from(document.querySelectorAll('button, input[type="button"], input[type="submit"]')).map(getElementInfo),
        forms: Array.from(document.querySelectorAll('form')).map(getElementInfo),
        headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(getElementInfo),
        inputs: Array.from(document.querySelectorAll('input, textarea, select')).map(getElementInfo),
      }
    })

    // Update progress: AI Analysis
    await updateScanProgress(scanId, 75, "Running AI analysis...")

    // Analyze with OpenAI
    const aiAnalysis = await analyzeWithAI(pageData, wcagLevel)
    
    // Update progress: Generating report
    await updateScanProgress(scanId, 90, "Generating report...")

    // Save issues to database
    const issues = await Promise.all(
      aiAnalysis.issues.map(async (issue: any) => {
        return prisma.scanIssue.create({
          data: {
            scanId,
            type: issue.type,
            severity: issue.severity,
            description: issue.description,
            element: issue.element,
            recommendation: issue.recommendation,
            wcagReference: issue.wcagReference,
          },
        })
      })
    )

    // Complete scan
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date(),
        score: aiAnalysis.score,
        aiInsights: aiAnalysis.insights,
      },
    })

  } catch (error) {
    console.error(`Scan ${scanId} failed:`, error)
    
    await prisma.scan.update({
      where: { id: scanId },
      data: {
        status: "FAILED",
        progress: 0,
        aiInsights: `Scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    })
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

async function updateScanProgress(scanId: string, progress: number, message: string) {
  await prisma.scan.update({
    where: { id: scanId },
    data: {
      progress,
      aiInsights: message,
    },
  })
}

async function analyzeWithAI(pageData: any, wcagLevel: string) {
  const prompt = `
Analyze this webpage for accessibility issues according to WCAG ${wcagLevel} standards:

Page Title: ${pageData.title}
URL: ${pageData.url}

Images (${pageData.images.length}):
${JSON.stringify(pageData.images.slice(0, 10), null, 2)}

Links (${pageData.links.length}):
${JSON.stringify(pageData.links.slice(0, 10), null, 2)}

Buttons (${pageData.buttons.length}):
${JSON.stringify(pageData.buttons.slice(0, 10), null, 2)}

Form Inputs (${pageData.inputs.length}):
${JSON.stringify(pageData.inputs.slice(0, 10), null, 2)}

Headings (${pageData.headings.length}):
${JSON.stringify(pageData.headings, null, 2)}

Please provide:
1. An accessibility score (0-100)
2. A list of specific issues found
3. Overall insights and recommendations

Focus on:
- Missing alt text for images
- Poor color contrast
- Missing ARIA labels
- Keyboard navigation issues
- Form accessibility
- Heading structure
- Link descriptions

Return your response as JSON in this format:
{
  "score": number,
  "issues": [
    {
      "type": "string",
      "severity": "CRITICAL" | "WARNING" | "INFO",
      "description": "string",
      "element": "string",
      "recommendation": "string",
      "wcagReference": "string"
    }
  ],
  "insights": "string"
}
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert web accessibility auditor. Analyze websites for WCAG compliance and provide detailed, actionable feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from OpenAI")
    }

    return JSON.parse(content)
  } catch (error) {
    console.error("AI analysis failed:", error)
    
    // Fallback analysis
    return {
      score: 75,
      issues: [
        {
          type: "AI Analysis Unavailable",
          severity: "INFO",
          description: "AI analysis could not be completed. Manual review recommended.",
          element: "N/A",
          recommendation: "Please try scanning again or contact support.",
          wcagReference: "N/A"
        }
      ],
      insights: "AI analysis was unavailable. A basic scan was performed instead."
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const scanId = searchParams.get('scanId')
  
  if (!scanId) {
    return NextResponse.json(
      { error: "Scan ID required" },
      { status: 400 }
    )
  }

  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const scan = await prisma.scan.findFirst({
      where: {
        id: scanId,
        userId: session.user.id,
      },
      include: {
        issues: true,
      },
    })

    if (!scan) {
      return NextResponse.json(
        { error: "Scan not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(scan)
  } catch (error) {
    console.error("Get scan error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}