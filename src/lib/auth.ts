import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing credentials")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { 
              email: credentials.email,
              isActive: true
            }
          })

          if (!user || !user.password) {
            console.error("User not found or no password set")
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.error("Invalid password")
            return null
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            cfaLevel: user.cfaLevel,
            level: user.level,
            totalXP: user.totalXP,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.cfaLevel = user.cfaLevel
        token.level = user.level
        token.totalXP = user.totalXP
      }

      // Update session
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }

      // Refresh user data periodically
      if (token.sub && Date.now() - (token.iat || 0) * 1000 > 24 * 60 * 60 * 1000) {
        try {
          const refreshedUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              role: true,
              cfaLevel: true,
              level: true,
              totalXP: true,
              isActive: true,
            }
          })

          if (refreshedUser && refreshedUser.isActive) {
            token.role = refreshedUser.role
            token.cfaLevel = refreshedUser.cfaLevel
            token.level = refreshedUser.level
            token.totalXP = refreshedUser.totalXP
          }
        } catch (error) {
          console.error("Error refreshing user data:", error)
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.cfaLevel = token.cfaLevel as string
        session.user.level = token.level as number
        session.user.totalXP = token.totalXP as number
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Handle OAuth sign in
        if (account?.provider !== "credentials" && user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          // If user doesn't exist, create with default values
          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || '',
                image: user.image,
                role: 'USER',
                cfaLevel: 'LEVEL_1',
                experienceLevel: 'BEGINNER',
                studyHoursPerWeek: 15,
                level: 1,
                totalXP: 0,
                currentStreak: 0,
                longestStreak: 0,
                isActive: true,
                lastLoginAt: new Date(),
              }
            })
          } else {
            // Update last login for existing user
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { lastLoginAt: new Date() }
            })
          }
        }

        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`)
    },
    async signOut({ token, session }) {
      console.log(`User signed out`)
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
    },
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(`NextAuth Error [${code}]:`, metadata)
    },
    warn(code) {
      console.warn(`NextAuth Warning [${code}]`)
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log(`NextAuth Debug [${code}]:`, metadata)
      }
    }
  }
}