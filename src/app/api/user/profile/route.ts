import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updateProfileSchema } from '@/lib/validations'
import { z } from 'zod'

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
        experienceLevel: true,
        studyHoursPerWeek: true,
        targetExamDate: true,
        level: true,
        totalXP: true,
        currentStreak: true,
        longestStreak: true,
        role: true,
        lastLoginAt: true,
        createdAt: true,
        _count: {
          select: {
            examSessions: true,
            forumPosts: true,
            userAchievements: true,
          }
        }
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate some additional stats
    const recentSessions = await prisma.examSession.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    })

    const averageScore = await prisma.examSession.aggregate({
      where: {
        userId: session.user.id,
        status: 'COMPLETED',
        score: { not: null }
      },
      _avg: {
        score: true
      }
    })

    const profile = {
      ...user,
      stats: {
        totalSessions: user._count.examSessions,
        recentSessions,
        forumPosts: user._count.forumPosts,
        achievements: user._count.userAchievements,
        averageScore: averageScore._avg.score || 0,
      }
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Error fetching user profile:', error)
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
    const validatedData = updateProfileSchema.parse(body)

    // Check if email is being changed and if it's already taken
    if (validatedData.email && validatedData.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        cfaLevel: true,
        experienceLevel: true,
        studyHoursPerWeek: true,
        targetExamDate: true,
        level: true,
        totalXP: true,
        currentStreak: true,
        longestStreak: true,
        role: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    })

  } catch (error) {
    console.error('Error updating user profile:', error)

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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Soft delete - deactivate the account
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        isActive: false,
        email: `deleted_${Date.now()}_${session.user.email}`,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      message: 'Account deactivated successfully' 
    })

  } catch (error) {
    console.error('Error deleting user account:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}