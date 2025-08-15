import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createSessionSchema = z.object({
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  sessionType: z.enum(['PRACTICE', 'MOCK_EXAM', 'QUICK_QUIZ', 'CUSTOM']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  timeLimit: z.number().min(60).max(7200), // 1 minute to 2 hours
  questionCount: z.number().min(1).max(100),
  topics: z.array(z.string()).min(1, 'At least one topic is required'),
  difficulty: z.enum(['EASY', 'INTERMEDIATE', 'HARD']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      userId: session.user.id
    }

    if (status) where.status = status

    const [sessions, total] = await Promise.all([
      prisma.examSession.findMany({
        where,
        include: {
          answers: {
            select: {
              id: true,
              isCorrect: true,
              timeSpent: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.examSession.count({ where })
    ])

    return NextResponse.json({
      sessions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching exam sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createSessionSchema.parse(body)

    // Get questions for the session
    const questionsQuery: any = {
      cfaLevel: validatedData.cfaLevel,
      topicArea: { in: validatedData.topics },
      approvalStatus: 'APPROVED',
      isActive: true,
    }

    if (validatedData.difficulty) {
      questionsQuery.difficulty = validatedData.difficulty
    }

    const availableQuestions = await prisma.question.findMany({
      where: questionsQuery,
      select: { id: true },
      orderBy: { timesAttempted: 'asc' }, // Prefer less used questions
    })

    if (availableQuestions.length < validatedData.questionCount) {
      return NextResponse.json(
        { 
          error: 'Not enough questions available',
          available: availableQuestions.length,
          requested: validatedData.questionCount
        },
        { status: 400 }
      )
    }

    // Randomly select questions
    const selectedQuestions = availableQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, validatedData.questionCount)
      .map(q => q.id)

    // Create exam session
    const examSession = await prisma.examSession.create({
      data: {
        userId: session.user.id,
        cfaLevel: validatedData.cfaLevel,
        sessionType: validatedData.sessionType,
        title: validatedData.title,
        description: validatedData.description,
        timeLimit: validatedData.timeLimit,
        questionCount: validatedData.questionCount,
        questionIds: selectedQuestions,
        topics: validatedData.topics,
        difficulty: validatedData.difficulty,
        status: 'SCHEDULED',
        timeSpent: 0,
      }
    })

    return NextResponse.json(examSession, { status: 201 })

  } catch (error) {
    console.error('Error creating exam session:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}