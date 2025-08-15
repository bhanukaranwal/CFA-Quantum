import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'CFA Quantum API',
    version: '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      questions: '/api/questions',
      examSessions: '/api/exam-sessions',
      battles: '/api/battles',
      forum: '/api/forum',
      analytics: '/api/analytics',
      user: '/api/user'
    }
  })
}
