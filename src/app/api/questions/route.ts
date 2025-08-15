import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const questionQuerySchema = z.object({
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']).optional(),
  topicArea: z.string().optional(),
  difficulty: z.enum(['EASY', 'INTERMEDIATE', 'HARD']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  sessionType: z.enum(['PRACTICE', 'MOCK_EXAM', 'QUICK_QUIZ']).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = questionQuerySchema.parse({
      cfaLevel: searchParams.get('cfaLevel'),
      topicArea: searchParams.get('topicArea'),
      difficulty: searchParams.get('difficulty'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      sessionType: searchParams.get('sessionType'),
    })

    // Build where clause
    const where: any = {
      approvalStatus: 'APPROVED',
      isActive: true,
    }

    if (query.cfaLevel) where.cfaLevel = query.cfaLevel
    if (query.topicArea) where.topicArea = query.topicArea
    if (query.difficulty) where.difficulty = query.difficulty

    // Get user's answered questions to avoid duplicates in practice mode
    const answeredQuestions = await prisma.answer.findMany({
      where: {
        session: {
          userId: session.user.id,
          status: 'COMPLETED'
        }
      },
      select: { questionId: true },
      distinct: ['questionId']
    })

    const answeredQuestionIds = answeredQuestions.map(a => a.questionId)

    // For practice mode, exclude answered questions
    if (query.sessionType === 'PRACTICE' && answeredQuestionIds.length > 0) {
      where.id = {
        notIn: answeredQuestionIds
      }
    }

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        select: {
          id: true,
          questionText: true,
          questionType: true,
          cfaLevel: true,
          topicArea: true,
          difficulty: true,
          options: true,
          correctAnswer: true,
          explanation: true,
          timeToComplete: true,
          tags: true,
          timesAttempted: true,
          correctAttempts: true,
        },
        orderBy: {
          // Prioritize less attempted questions
          timesAttempted: 'asc'
        },
        take: query.limit,
        skip: query.offset,
      }),
      prisma.question.count({ where })
    ])

    // Shuffle questions for variety
    const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

    return NextResponse.json({
      questions: shuffledQuestions,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + query.limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching questions:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid query parameters', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTRUCTOR', 'ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const questionSchema = z.object({
      questionText: z.string().min(10, 'Question text must be at least 10 characters'),
      questionType: z.enum(['MULTIPLE_CHOICE', 'ITEM_SET', 'CONSTRUCTED_RESPONSE']),
      cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
      topicArea: z.string().min(1, 'Topic area is required'),
      difficulty: z.enum(['EASY', 'INTERMEDIATE', 'HARD']),
      options: z.record(z.string()).refine(
        (options) => Object.keys(options).length >= 2,
        'At least 2 options are required'
      ),
      correctAnswer: z.string().min(1, 'Correct answer is required'),
      explanation: z.string().min(10, 'Explanation must be at least 10 characters'),
      timeToComplete: z.number().min(30).max(600),
      tags: z.array(z.string()).default([]),
    })

    const validatedData = questionSchema.parse(body)

    // Validate that correctAnswer exists in options
    if (!validatedData.options[validatedData.correctAnswer]) {
      return NextResponse.json(
        { message: 'Correct answer must be one of the provided options' },
        { status: 400 }
      )
    }

    const question = await prisma.question.create({
      data: {
        ...validatedData,
        createdBy: session.user.id,
        approvalStatus: session.user.role === 'SUPER_ADMIN' ? 'APPROVED' : 'PENDING_REVIEW',
        isActive: true,
        timesAttempted: 0,
        correctAttempts: 0,
        averageTimeSpent: 0,
      }
    })

    return NextResponse.json(question, { status: 201 })

  } catch (error) {
    console.error('Error creating question:', error)

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