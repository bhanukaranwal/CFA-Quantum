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

    const userId = session.user.id

    // Get user's exam sessions
    const examSessions = await prisma.examSession.findMany({
      where: {
        userId,
        status: 'COMPLETED'
      },
      include: {
        answers: {
          include: {
            question: {
              select: {
                topicArea: true,
                difficulty: true
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 50
    })

    // Calculate analytics
    const totalQuestions = examSessions.reduce((sum, session) => sum + session.questionCount, 0)
    const totalCorrect = examSessions.reduce((sum, session) => 
      sum + session.answers.filter(answer => answer.isCorrect).length, 0
    )
    const totalTimeSpent = examSessions.reduce((sum, session) => sum + session.timeSpent, 0)

    // Topic analysis
    const topicStats: Record<string, { total: number; correct: number; time: number }> = {}
    
    examSessions.forEach(session => {
      session.answers.forEach(answer => {
        const topic = answer.question.topicArea
        if (!topicStats[topic]) {
          topicStats[topic] = { total: 0, correct: 0, time: 0 }
        }
        topicStats[topic].total++
        if (answer.isCorrect) topicStats[topic].correct++
        topicStats[topic].time += answer.timeSpent
      })
    })

    const topicAnalysis = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      questionsAttempted: stats.total,
      averageTime: stats.total > 0 ? Math.round(stats.time / stats.total) : 0,
      improvement: 0 // Calculate trend over time
    }))

    // Performance trend (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentSessions = examSessions.filter(session => 
      session.completedAt && session.completedAt >= thirtyDaysAgo
    )

    const performanceTrend = recentSessions.map(session => ({
      date: session.completedAt?.toISOString().split('T')[0] || '',
      accuracy: session.accuracy || 0,
      questionsAnswered: session.questionCount,
      studyTime: Math.round(session.timeSpent / 60) // convert to minutes
    }))

    // Weak areas (topics with < 70% accuracy)
    const weakAreas = topicAnalysis
      .filter(topic => topic.accuracy < 70 && topic.questionsAttempted >= 5)
      .map(topic => ({
        topicArea: topic.topic,
        accuracy: topic.accuracy,
        priority: topic.accuracy < 50 ? 'HIGH' as const : 
                 topic.accuracy < 60 ? 'MEDIUM' as const : 'LOW' as const,
        recommendation: `Focus on ${topic.topic} - practice more questions in this area`
      }))
      .sort((a, b) => a.accuracy - b.accuracy)

    const analytics = {
      overview: {
        totalQuestions,
        correctAnswers: totalCorrect,
        accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
        totalTimeSpent: Math.round(totalTimeSpent / 60), // minutes
        averageSessionLength: examSessions.length > 0 ? Math.round(totalTimeSpent / examSessions.length / 60) : 0,
        sessionsCompleted: examSessions.length,
        examReadiness: Math.min(100, Math.max(0, Math.round(
          (totalQuestions / 1000) * 30 + 
          (totalCorrect / totalQuestions) * 70
        )))
      },
      topicAnalysis,
      performanceTrend,
      weakAreas,
      insights: [
        {
          type: 'strength' as const,
          title: 'Top Performance Area',
          description: topicAnalysis.length > 0 
            ? `You excel in ${topicAnalysis.sort((a, b) => b.accuracy - a.accuracy)[0]?.topic}`
            : 'Complete more practice sessions for insights',
          action: 'Continue practicing to maintain your strength',
          icon: '💪',
          color: 'green'
        },
        {
          type: 'weakness' as const,
          title: 'Improvement Opportunity',
          description: weakAreas.length > 0 
            ? `Focus on ${weakAreas[0]?.topicArea} (${weakAreas[0]?.accuracy}% accuracy)`
            : 'No significant weak areas identified',
          action: 'Practice more questions in this topic',
          icon: '📈',
          color: 'red'
        }
      ],
      goals: [
        {
          goal: 'Daily Practice',
          current: recentSessions.filter(s => 
            s.completedAt && s.completedAt >= new Date(Date.now() - 24*60*60*1000)
          ).length,
          target: 1,
          progress: Math.min(100, recentSessions.filter(s => 
            s.completedAt && s.completedAt >= new Date(Date.now() - 24*60*60*1000)
          ).length * 100)
        },
        {
          goal: 'Weekly Questions',
          current: recentSessions.filter(s => 
            s.completedAt && s.completedAt >= new Date(Date.now() - 7*24*60*60*1000)
          ).reduce((sum, s) => sum + s.questionCount, 0),
          target: 100,
          progress: Math.min(100, recentSessions.filter(s => 
            s.completedAt && s.completedAt >= new Date(Date.now() - 7*24*60*60*1000)
          ).reduce((sum, s) => sum + s.questionCount, 0))
        }
      ]
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}