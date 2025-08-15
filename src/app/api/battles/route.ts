import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createBattleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  battleType: z.enum(['ONE_VS_ONE', 'TOURNAMENT', 'QUICK_MATCH', 'CUSTOM']).default('QUICK_MATCH'),
  questionCount: z.number().min(5).max(50).default(10),
  timeLimit: z.number().min(60).max(1800).default(300),
  topics: z.array(z.string()).min(1),
  difficulty: z.enum(['EASY', 'INTERMEDIATE', 'HARD']).default('INTERMEDIATE'),
  maxParticipants: z.number().min(2).max(10).default(4),
  entryFee: z.number().min(0).default(0),
  prizeXP: z.number().min(0).default(100),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'WAITING'
    const cfaLevel = searchParams.get('cfaLevel')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    if (status) where.status = status
    if (cfaLevel) where.cfaLevel = cfaLevel

    const battles = await prisma.quizBattle.findMany({
      where,
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                level: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // Add participant count to each battle
    const battlesWithCounts = battles.map(battle => ({
      ...battle,
      participantCount: battle.participants.length,
      canJoin: battle.participants.length < battle.maxParticipants && 
               battle.status === 'WAITING' &&
               !battle.participants.some(p => p.userId === session.user.id)
    }))

    return NextResponse.json({ battles: battlesWithCounts })

  } catch (error) {
    console.error('Error fetching battles:', error)
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
    const validatedData = createBattleSchema.parse(body)

    // Get questions for the battle
    const availableQuestions = await prisma.question.findMany({
      where: {
        cfaLevel: validatedData.cfaLevel,
        topicArea: { in: validatedData.topics },
        difficulty: validatedData.difficulty,
        approvalStatus: 'APPROVED',
        isActive: true,
      },
      select: { id: true },
      orderBy: { timesAttempted: 'asc' },
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

    // Create battle
    const battle = await prisma.quizBattle.create({
      data: {
        ...validatedData,
        questionIds: selectedQuestions,
        status: 'WAITING',
        participants: {
          create: {
            userId: session.user.id,
            isReady: true,
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                level: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(battle, { status: 201 })

  } catch (error) {
    console.error('Error creating battle:', error)

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