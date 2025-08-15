import { NextResponse } from 'next/server'
import { checkDatabaseConnection, getDatabaseHealth } from '@/lib/db'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Check database connection
    const dbHealth = await getDatabaseHealth()
    
    // Basic system checks
    const systemHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        percentage: Math.round(
          (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100
        ),
      },
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      responseTime: Date.now() - startTime,
    }

    // Overall health status
    const isHealthy = dbHealth.status === 'healthy'
    const overallStatus = isHealthy ? 'healthy' : 'unhealthy'

    return NextResponse.json(
      {
        status: overallStatus,
        version: '1.0.0',
        services: {
          database: dbHealth,
          system: systemHealth,
        },
        checks: {
          database: dbHealth.status === 'healthy',
          memory: systemHealth.memory.percentage < 90,
          uptime: systemHealth.uptime > 0,
        },
        timestamp: new Date().toISOString(),
      },
      { 
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    )
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}

// Support for HEAD requests (common for health checks)
export async function HEAD() {
  try {
    await checkDatabaseConnection()
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}