import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Connection health check with enhanced error handling
export async function checkDatabaseConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect()
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ Database connected successfully')
      return true
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error)
      
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed')
        return false
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, i), 10000)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  return false
}

// Enhanced graceful shutdown
export async function disconnectDatabase(timeout = 5000): Promise<void> {
  const disconnectPromise = prisma.$disconnect()
  const timeoutPromise = new Promise<void>((_, reject) => 
    setTimeout(() => reject(new Error('Database disconnect timeout')), timeout)
  )

  try {
    await Promise.race([disconnectPromise, timeoutPromise])
    console.log('✅ Database disconnected successfully')
  } catch (error) {
    console.error('❌ Database disconnection failed:', error)
    // Force disconnect
    try {
      await prisma.$disconnect()
    } catch (forceError) {
      console.error('❌ Force disconnect failed:', forceError)
    }
  }
}

// Enhanced transaction wrapper
export async function executeInTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>,
  timeout = 10000
): Promise<T> {
  try {
    return await prisma.$transaction(callback, {
      maxWait: 5000,
      timeout: timeout,
      isolationLevel: 'ReadCommitted'
    })
  } catch (error) {
    console.error('Transaction failed:', error)
    throw new Error(`Database transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Enhanced health check with detailed metrics
export async function getDatabaseHealth() {
  try {
    const start = Date.now()
    
    // Test basic connection
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    
    // Test query performance with actual data
    const [userCount, questionCount, examSessionCount] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.question.count().catch(() => 0),
      prisma.examSession.count().catch(() => 0),
    ])
    
    const end = Date.now()
    const responseTime = end - start
    
    // Connection pool stats (if available)
    const poolStats = {
      // These would be available with Prisma metrics (premium feature)
      activeConnections: 'N/A',
      idleConnections: 'N/A',
      maxConnections: 'N/A',
    }
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      metrics: {
        userCount,
        questionCount,
        examSessionCount,
        connectionTime: responseTime,
        poolStats,
      },
      database: {
        name: 'PostgreSQL',
        version: 'Unknown', // Would need specific query to get version
        url: process.env.DATABASE_URL ? '***configured***' : 'not configured',
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Database health check failed:', error)
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorCode: error instanceof Error && 'code' in error ? error.code : undefined,
      timestamp: new Date().toISOString(),
    }
  }
}

// Connection monitoring
export function getDatabaseStats() {
  return {
    url: process.env.DATABASE_URL ? '***configured***' : 'not configured',
    environment: process.env.NODE_ENV,
    prismaVersion: '5.9.1',
    nodeVersion: process.version,
    platform: process.platform,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }
}

// Enhanced process cleanup handlers
const cleanup = async (signal: string) => {
  console.log(`Received ${signal}, cleaning up...`)
  await disconnectDatabase()
  process.exit(0)
}

process.on('SIGINT', () => cleanup('SIGINT'))
process.on('SIGTERM', () => cleanup('SIGTERM'))
process.on('beforeExit', async () => {
  await disconnectDatabase()
})

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error)
  await disconnectDatabase()
  process.exit(1)
})

process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  await disconnectDatabase()
  process.exit(1)
})

// Export Prisma types for type safety
export type { PrismaClient } from '@prisma/client'
export * from '@prisma/client'