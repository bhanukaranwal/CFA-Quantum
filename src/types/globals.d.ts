import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
  
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string
      DIRECT_URL: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      GOOGLE_CLIENT_ID?: string
      GOOGLE_CLIENT_SECRET?: string
      GITHUB_CLIENT_ID?: string
      GITHUB_CLIENT_SECRET?: string
      JWT_SECRET: string
      ENCRYPTION_KEY: string
      NODE_ENV: 'development' | 'test' | 'production'
      NEXT_PUBLIC_APP_URL: string
      NEXT_PUBLIC_APP_NAME: string
      NEXT_PUBLIC_ENABLE_ANALYTICS?: string
      NEXT_PUBLIC_ENABLE_BATTLES?: string
      NEXT_PUBLIC_ENABLE_COMMUNITY?: string
      NEXT_PUBLIC_ENABLE_AI_FEATURES?: string
    }
  }
}

// Window extensions
declare interface Window {
  gtag: (...args: any[]) => void
  dataLayer: any[]
}

export {}