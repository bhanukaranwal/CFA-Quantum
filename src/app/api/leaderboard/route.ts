import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'global' // global, weekly, monthly
    const limit = parseInt(searchParams.get('limit') || '50')
    const cfaLevel = searchParams.get('cfaLevel')

    let dateFilter = {}
    const now = new Date()

    switch (type) {
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        dateFilter = { lastLoginAt: { gte: weekAgo } }
        break
      case 'monthly':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        dateFilter = { lastLoginAt: { gte: monthAgo } }
        break
      default:
        // Global - no date filter
        break
    }

    const whereClause = {
      isActive: true,
      ...dateFilter,
      ...(cfaLevel && { cfaLevel }),
    }

    // Get leaderboard data
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        image: true,
        level: true,
        totalXP: true,
        currentStreak: true,
        longestStreak: true,
        cfaLevel: true,
        experienceLevel: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: [
        { totalXP: 'desc' },
        { level: 'desc' },
        { currentStreak: 'desc' },
      ],
      take: limit,
    })

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      ...user,
      rank: index + 1,
      isCurrentUser: user.id === session.user.id,
    }))

    // Find current user's position if not in top results
    let currentUserRank = null
    const currentUserIndex = leaderboard.findIndex(user => user.isCurrentUser)
    
    if (currentUserIndex === -1) {
      // User not in top results, find their actual rank
      const usersAbove = await prisma.user.count({
        where: {
          ...whereClause,
          OR: [
            { totalXP: { gt: session.user.totalXP } },
            { 
              totalXP: session.user.totalXP,
              level: { gt: session.user.level }
            },
            {
              totalXP: session.user.totalXP,
              level: session.user.level,
              currentStreak: { gt: session.user.currentStreak || 0 }
            }
          ]
        }
      })
      
      currentUserRank = usersAbove + 1
    }

    // Get some stats
    const totalUsers = await prisma.user.count({ where: whereClause })
    
    const stats = {
      totalUsers,
      averageXP: Math.round(
        (await prisma.user.aggregate({
          where: whereClause,
          _avg: { totalXP: true }
        }))._avg.totalXP || 0
      ),
      topXP: users[0]?.totalXP || 0,
    }

    return NextResponse.json({
      leaderboard,
      currentUserRank: currentUserIndex !== -1 ? currentUserIndex + 1 : currentUserRank,
      stats,
      meta: {
        type,
        limit,
        cfaLevel,
        timestamp: new Date().toISOString(),
      }
    })

  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}