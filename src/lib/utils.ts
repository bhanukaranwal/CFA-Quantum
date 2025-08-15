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
    hour12: true,
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string | number) {
  const now = new Date()
  const inputDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`
  }

  return formatDate(date)
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

export function formatScore(score: number, total?: number) {
  if (total) {
    const percentage = Math.round((score / total) * 100)
    return `${score}/${total} (${percentage}%)`
  }
  return `${Math.round(score)}%`
}

export function formatXP(xp: number) {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M XP`
  } else if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K XP`
  }
  return `${xp} XP`
}

export function calculateLevel(xp: number) {
  const LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7250, 9250,
    11500, 14000, 16750, 19750, 23000, 26500, 30250, 34250, 38500,
    43000, 47750, 52750, 58000, 63500, 69250, 75250, 81500, 88000,
    94750, 101750, 109000, 116500, 124250, 132250, 140500, 149000,
    157750, 166750, 176000, 185500, 195250, 205250, 215500, 226000,
    236750, 247750, 259000, 270500, 282250, 294250, 306500, 319000,
    331750, 344750, 358000, 371500, 385250, 399250, 413500, 428000,
    442750, 457750, 473000, 488500, 504250, 520250, 536500, 553000,
    569750, 586750, 604000, 621500, 639250, 657250, 675500, 694000,
    712750, 731750, 751000, 770500, 790250, 810250, 830500, 851000,
    871750, 892750, 914000, 935500, 957250, 979250, 1001500, 1024000,
    1046750, 1069750, 1093000, 1116500, 1140250, 1164250, 1188500, 1213000,
  ]

  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
    } else {
      break
    }
  }
  return level
}

export function calculateProgress(current: number, target: number) {
  return Math.min(Math.round((current / target) * 100), 100)
}

export function generateInitials(name: string) {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }
  
  // Fallback for older browsers
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
  return Promise.resolve()
}

export function downloadFile(data: any, filename: string, type: string = 'application/json') {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getContrastColor(hexColor: string) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export function parseSearchParams(searchParams: URLSearchParams) {
  const params: Record<string, string | string[]> = {}
  
  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value)
      } else {
        params[key] = [params[key] as string, value]
      }
    } else {
      params[key] = value
    }
  }
  
  return params
}

export function buildSearchParams(params: Record<string, any>) {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)))
      } else {
        searchParams.set(key, String(value))
      }
    }
  })
  
  return searchParams
}

export const COLORS = {
  CFA_BLUE: '#0052cc',
  CFA_GOLD: '#f4b942',
  CFA_NAVY: '#003366',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
}

export default {
  cn,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatScore,
  formatXP,
  calculateLevel,
  calculateProgress,
  generateInitials,
  truncateText,
  slugify,
  debounce,
  throttle,
  isValidEmail,
  isValidPassword,
  generateRandomId,
  sleep,
  copyToClipboard,
  downloadFile,
  formatFileSize,
  getContrastColor,
  parseSearchParams,
  buildSearchParams,
  COLORS,
}