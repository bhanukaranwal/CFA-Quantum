import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      cfaLevel?: string
      level: number
      totalXP: number
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: string
    cfaLevel?: string
    level: number
    totalXP: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    cfaLevel?: string
    level: number
    totalXP: number
  }
}