import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const test = searchParams.get('test') || 'all'

    const tests = {
      database: async () => {
        const isConnected = await checkDatabaseConnection()
        return {
          name: 'Database Connection',
          status: isConnected ? 'pass' : 'fail',
          message: isConnected ? 'Database connected successfully' : 'Database connection failed',
          timestamp: new Date().toISOString(),
        }
      },
      
      environment: async () => {
        const requiredEnvVars = [
          'DATABASE_URL',
          'NEXTAUTH_SECRET',
          'NEXTAUTH_URL',
        ]
        
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
        
        return {
          name: 'Environment Variables',
          status: missingVars.length === 0 ? 'pass' : 'fail',
          message: missingVars.length === 0 
            ? 'All required environment variables are set'
            : `Missing environment variables: ${missingVars.join(', ')}`,
          details: {
            required: requiredEnvVars,
            missing: missingVars,
            present: requiredEnvVars.filter(varName => process.env[varName]),
          },
          timestamp: new Date().toISOString(),
        }
      },
      
      api: async () => {
        return {
          name: 'API Endpoints',
          status: 'pass',
          message: 'API is responding correctly',
          details: {
            method: 'GET',
            endpoint: '/api/test',
            responseTime: Date.now(),
          },
          timestamp: new Date().toISOString(),
        }
      },
      
      system: async () => {
        return {
          name: 'System Health',
          status: 'pass',
          message: 'System is healthy',
          details: {
            nodeVersion: process.version,
            platform: process.platform,
            uptime: process.uptime(),
            memory: {
              used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
              total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            },
          },
          timestamp: new Date().toISOString(),
        }
      },
    }

    let results = []

    if (test === 'all') {
      results = await Promise.all(
        Object.entries(tests).map(async ([key, testFn]) => {
          try {
            return await testFn()
          } catch (error) {
            return {
              name: key,
              status: 'fail',
              message: error instanceof Error ? error.message : 'Test failed',
              error: error instanceof Error ? error.stack : String(error),
              timestamp: new Date().toISOString(),
            }
          }
        })
      )
    } else if (tests[test as keyof typeof tests]) {
      try {
        results = [await tests[test as keyof typeof tests]()]
      } catch (error) {
        results = [{
          name: test,
          status: 'fail',
          message: error instanceof Error ? error.message : 'Test failed',
          error: error instanceof Error ? error.stack : String(error),
          timestamp: new Date().toISOString(),
        }]
      }
    } else {
      return NextResponse.json(
        { 
          error: 'Invalid test type',
          available: Object.keys(tests),
          usage: '/api/test?test=all or /api/test?test=database'
        },
        { status: 400 }
      )
    }

    const allPassed = results.every(result => result.status === 'pass')
    const summary = {
      overall: allPassed ? 'pass' : 'fail',
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      summary,
      results,
      meta: {
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        testType: test,
      }
    }, { 
      status: allPassed ? 200 : 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

  } catch (error) {
    console.error('Test API error:', error)
    
    return NextResponse.json(
      {
        summary: {
          overall: 'fail',
          total: 0,
          passed: 0,
          failed: 1,
          timestamp: new Date().toISOString(),
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: 'POST method not supported on test endpoint' },
    { status: 405 }
  )
}