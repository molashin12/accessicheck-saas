import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string | number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-US").format(number)
}

export function formatPercentage(number: number, decimals = 1) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number / 100)
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateId(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function absoluteUrl(path: string) {
  return `${getBaseUrl()}${path}`
}

// Accessibility helpers
export function getContrastRatio(color1: string, color2: string) {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd convert colors to RGB and calculate luminance
  return 4.5 // Placeholder
}

export function isAccessibleContrast(ratio: number, level: 'AA' | 'AAA' = 'AA') {
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}

export function getSeverityColor(severity: 'CRITICAL' | 'WARNING' | 'INFO') {
  switch (severity) {
    case 'CRITICAL':
      return 'text-error bg-error-light border-error'
    case 'WARNING':
      return 'text-warning bg-warning-light border-warning'
    case 'INFO':
      return 'text-info bg-info-light border-info'
    default:
      return 'text-muted-foreground bg-muted border-border'
  }
}

export function getComplianceScore(issues: { severity: string }[]) {
  const total = issues.length
  if (total === 0) return 100
  
  const weights = { CRITICAL: 3, WARNING: 2, INFO: 1 }
  const weightedIssues = issues.reduce((sum, issue) => {
    return sum + (weights[issue.severity as keyof typeof weights] || 1)
  }, 0)
  
  // Calculate score (0-100)
  const maxPossibleScore = total * 3
  const score = Math.max(0, 100 - (weightedIssues / maxPossibleScore) * 100)
  return Math.round(score)
}