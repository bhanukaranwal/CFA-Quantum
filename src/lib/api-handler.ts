import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export interface ApiError extends Error {
  statusCode: number
  code?: string
}

export class ApiResponseError extends Error implements ApiError {
  statusCode: number
  code?: string

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message)
    this.name = 'ApiResponseError'
    this.statusCode = statusCode
    this.code = code
  }
}

// Standard API response format
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: { field: string; message: string }[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  meta?: Record<string, any>
}

export function createSuccessResponse<T>(
  data?: T,
  message?: string,
  meta?: Record<string, any>
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    meta,
  }
}

export function createErrorResponse(
  error: string,
  errors?: { field: string; message: string }[]
): ApiResponse {
  return {
    success: false,
    error,
    errors,
  }
}

export function createPaginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  },
  message?: string
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    pagination,
    message,
  }
}

// API handler wrapper with error handling
export function withApiHandler(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error('API Error:', error)

      // Handle different types of errors
      if (error instanceof ApiResponseError) {
        return NextResponse.json(
          createErrorResponse(error.message),
          { status: error.statusCode }
        )
      }

      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return NextResponse.json(
          createErrorResponse('Validation failed', errors),
          { status: 400 }
        )
      }

      if (error instanceof PrismaClientKnownRequestError) {
        return handlePrismaError(error)
      }

      // Generic error
      return NextResponse.json(
        createErrorResponse(
          process.env.NODE_ENV === 'development' 
            ? error instanceof Error ? error.message : 'Unknown error'
            : 'Internal server error'
        ),
        { status: 500 }
      )
    }
  }
}

// Authentication middleware
export function withAuth(requiredRole?: string[]) {
  return function (
    handler: (req: NextRequest, session: any, context?: any) => Promise<NextResponse>
  ) {
    return withApiHandler(async (req: NextRequest, context?: any) => {
      const session = await getServerSession(authOptions)

      if (!session) {
        throw new ApiResponseError('Authentication required', 401)
      }

      if (requiredRole && !requiredRole.includes(session.user.role)) {
        throw new ApiResponseError('Insufficient permissions', 403)
      }

      return handler(req, session, context)
    })
  }
}

// Request validation middleware
export function withValidation<T>(schema: z.ZodSchema<T>) {
  return function (
    handler: (req: NextRequest, validatedData: T, context?: any) => Promise<NextResponse>
  ) {
    return withApiHandler(async (req: NextRequest, context?: any) => {
      let data: any

      try {
        data = await req.json()
      } catch (error) {
        throw new ApiResponseError('Invalid JSON in request body', 400)
      }

      const validatedData = schema.parse(data)
      return handler(req, validatedData, context)
    })
  }
}

// Combined auth and validation middleware
export function withAuthAndValidation<T>(
  schema: z.ZodSchema<T>,
  requiredRole?: string[]
) {
  return function (
    handler: (req: NextRequest, session: any, validatedData: T, context?: any) => Promise<NextResponse>
  ) {
    return withAuth(requiredRole)(async (req, session, context) => {
      let data: any

      try {
        data = await req.json()
      } catch (error) {
        throw new ApiResponseError('Invalid JSON in request body', 400)
      }

      const validatedData = schema.parse(data)
      return handler(req, session, validatedData, context)
    })
  }
}

// Prisma error handler
function handlePrismaError(error: PrismaClientKnownRequestError): NextResponse {
  switch (error.code) {
    case 'P2002':
      return NextResponse.json(
        createErrorResponse('A record with this data already exists'),
        { status: 409 }
      )
    case 'P2025':
      return NextResponse.json(
        createErrorResponse('Record not found'),
        { status: 404 }
      )
    case 'P2003':
      return NextResponse.json(
        createErrorResponse('Foreign key constraint failed'),
        { status: 400 }
      )
    case 'P2014':
      return NextResponse.json(
        createErrorResponse('Invalid ID provided'),
        { status: 400 }
      )
    default:
      console.error('Unhandled Prisma error:', error)
      return NextResponse.json(
        createErrorResponse('Database error occurred'),
        { status: 500 }
      )
  }
}

// Rate limiting helper
export function withRateLimit(
  windowMs: number = 60000, // 1 minute
  maxRequests: number = 100
) {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return function (
    handler: (req: NextRequest, context?: any) => Promise<NextResponse>
  ) {
    return withApiHandler(async (req: NextRequest, context?: any) => {
      const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      const now = Date.now()
      const windowStart = now - windowMs

      // Clean up old entries
      for (const [key, value] of requests.entries()) {
        if (value.resetTime < windowStart) {
          requests.delete(key)
        }
      }

      const current = requests.get(ip) || { count: 0, resetTime: now + windowMs }

      if (current.count >= maxRequests && current.resetTime > now) {
        throw new ApiResponseError('Too many requests', 429)
      }

      current.count++
      requests.set(ip, current)

      return handler(req, context)
    })
  }
}

// CORS helper
export function withCors(
  allowedOrigins: string[] = ['http://localhost:3000'],
  allowedMethods: string[] = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
) {
  return function (
    handler: (req: NextRequest, context?: any) => Promise<NextResponse>
  ) {
    return withApiHandler(async (req: NextRequest, context?: any) => {
      const origin = req.headers.get('origin')
      
      if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
            'Access-Control-Allow-Methods': allowedMethods.join(', '),
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
          },
        })
      }

      const response = await handler(req, context)
      
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
      }

      return response
    })
  }
}

// Logging helper
export function withLogging(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>
) {
  return withApiHandler(async (req: NextRequest, context?: any) => {
    const start = Date.now()
    const { method, url } = req

    console.log(`[${new Date().toISOString()}] ${method} ${url} - START`)

    try {
      const response = await handler(req, context)
      const duration = Date.now() - start
      
      console.log(`[${new Date().toISOString()}] ${method} ${url} - ${response.status} (${duration}ms)`)
      
      return response
    } catch (error) {
      const duration = Date.now() - start
      
      console.error(`[${new Date().toISOString()}] ${method} ${url} - ERROR (${duration}ms):`, error)
      
      throw error
    }
  })
}

// Combined middleware for common use cases
export const createApiHandler = {
  // Public endpoint with validation
  public: <T>(schema: z.ZodSchema<T>) => 
    withValidation(schema),

  // Protected endpoint with auth
  protected: (requiredRole?: string[]) => 
    withAuth(requiredRole),

  // Protected endpoint with auth and validation
  protectedWithValidation: <T>(schema: z.ZodSchema<T>, requiredRole?: string[]) =>
    withAuthAndValidation(schema, requiredRole),

  // Rate limited endpoint
  rateLimited: (windowMs?: number, maxRequests?: number) =>
    withRateLimit(windowMs, maxRequests),

  // CORS enabled endpoint
  cors: (allowedOrigins?: string[], allowedMethods?: string[]) =>
    withCors(allowedOrigins, allowedMethods),

  // Full featured endpoint
  complete: <T>(
    schema: z.ZodSchema<T>,
    requiredRole?: string[],
    enableRateLimit = true,
    enableCors = true,
    enableLogging = true
  ) => {
    let middleware = withAuthAndValidation(schema, requiredRole)

    if (enableRateLimit) {
      middleware = withRateLimit()(middleware)
    }

    if (enableCors) {
      middleware = withCors()(middleware)
    }

    if (enableLogging) {
      middleware = withLogging(middleware)
    }

    return middleware
  },
}

export default createApiHandler