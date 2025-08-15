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
    const includeProgress = searchParams.get('includeProgress') === 'true'
    const category = searchParams.get('category')
    const unlocked = searchParams.get('unlocked')

    // Get all achievements
    const achievements = await prisma.achievement.findMany({
      where: {
        isActive: true,
        ...(category && { category }),
      },
      include: {
        userAchievements: {
          where: { userId: session.user.id },
        },
      },
      orderBy: [
        { difficulty: 'asc' },
        { xpReward: 'asc' },
      ],
    })

    // Get user stats for progress calculation
    let userStats = null
    if (includeProgress) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          examSessions: {
            where: { status: 'COMPLETED' },
            include: {
              answers: true,
            },
          },
          forumPosts: true,
          battleParticipants: {
            include: {
              battle: true,
            },
          },
        },
      })

      if (user) {
        const totalQuestions = user.examSessions.reduce(
          (sum, session) => sum + session.answers.length, 0
        )
        const correctAnswers = user.examSessions.reduce(
          (sum, session) => sum + session.answers.filter(a => a.isCorrect).length, 0
        )
        const battlesWon = user.battleParticipants.filter(
          p => p.battle.winnerId === user.id
        ).length

        userStats = {
          questionsAnswered: totalQuestions,
          correctAnswers,
          studyStreak: user.currentStreak,
          forumPosts: user.forumPosts.length,
          battlesWon,
          studyTime: user.examSessions.reduce(
            (sum, session) => sum + session.timeSpent, 0
          ) / 3600, // Convert to hours
        }
      }
    }

    // Process achievements with unlock status and progress
    const processedAchievements = achievements.map(achievement => {
      const isUnlocked = achievement.userAchievements.length > 0
      const unlockedAt = isUnlocked ? achievement.userAchievements[0].unlockedAt : null

      let progress = 0
      if (!isUnlocked && includeProgress && userStats) {
        progress = calculateAchievementProgress(achievement, userStats)
      }

      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        difficulty: achievement.difficulty,
        xpReward: achievement.xpReward,
        requirements: achievement.requirements,
        isUnlocked,
        unlockedAt,
        progress: isUnlocked ? 100 : progress,
      }
    })

    // Filter by unlocked status if requested
    let filteredAchievements = processedAchievements
    if (unlocked === 'true') {
      filteredAchievements = processedAchievements.filter(a => a.isUnlocked)
    } else if (unlocked === 'false') {
      filteredAchievements = processedAchievements.filter(a => !a.isUnlocked)
    }

    // Group by category
    const groupedAchievements = filteredAchievements.reduce((groups, achievement) => {
      const category = achievement.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(achievement)
      return groups
    }, {} as Record<string, typeof filteredAchievements>)

    // Calculate summary stats
    const summary = {
      total: processedAchievements.length,
      unlocked: processedAchievements.filter(a => a.isUnlocked).length,
      totalXPEarned: processedAchievements
        .filter(a => a.isUnlocked)
        .reduce((sum, a) => sum + a.xpReward, 0),
      categories: Object.keys(groupedAchievements).map(category => ({
        name: category,
        total: groupedAchievements[category].length,
        unlocked: groupedAchievements[category].filter(a => a.isUnlocked).length,
      })),
    }

    return NextResponse.json({
      achievements: filteredAchievements,
      grouped: groupedAchievements,
      summary,
      userStats: includeProgress ? userStats : undefined,
    })

  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function calculateAchievementProgress(achievement: any, userStats: any): number {
  const requirements = achievement.requirements as any

  switch (achievement.category) {
    case 'QUESTIONS_ANSWERED':
      if (requirements.questionsAnswered) {
        return Math.min(100, (userStats.questionsAnswered / requirements.questionsAnswered) * 100)
      }
      if (requirements.correctAnswers) {
        return Math.min(100, (userStats.correctAnswers / requirements.correctAnswers) * 100)
      }
      break

    case 'STREAK':
      if (requirements.studyStreak) {
        return Math.min(100, (userStats.studyStreak / requirements.studyStreak) * 100)
      }
      break

    case 'SOCIAL':
      if (requirements.forumPosts) {
        return Math.min(100, (userStats.forumPosts / requirements.forumPosts) * 100)
      }
      if (requirements.battlesWon) {
        return Math.min(100, (userStats.battlesWon / requirements.battlesWon) * 100)
      }
      break

    case 'STUDY_TIME':
      if (requirements.studyHours) {
        return Math.min(100, (userStats.studyTime / requirements.studyHours) * 100)
      }
      break

    case 'ACCURACY':
      if (requirements.perfectScore && userStats.questionsAnswered >= requirements.perfectScore) {
        // This would need more complex logic to check for perfect scores
        return 0
      }
      break

    case 'SPEED':
      // This would need session-level timing data
      return 0

    default:
      return 0
  }

  return 0
}