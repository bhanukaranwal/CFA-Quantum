import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']).optional(),
  targetExamDate: z.string().optional(),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  studyHoursPerWeek: z.number().min(1).max(100).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        cfaLevel: true,
        targetExamDate: true,
        experienceLevel: true,
        studyHoursPerWeek: true,
        level: true,
        totalXP: true,
        currentStreak: true,
        longestStreak: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validatedData,
        ...(validatedData.targetExamDate && {
          targetExamDate: new Date(validatedData.targetExamDate)
        })
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        cfaLevel: true,
        targetExamDate: true,
        experienceLevel: true,
        studyHoursPerWeek: true,
        level: true,
        totalXP: true,
        currentStreak: true,
        longestStreak: true,
        updatedAt: true,
      }
    })

    return NextResponse.json({ user: updatedUser })

  } catch (error) {
    console.error('Error updating user:', error)

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