'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatXP, formatRelativeTime } from '@/lib/utils'
import Link from 'next/link'
import {
  BookOpen,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Users,
  Zap,
  Award,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  BarChart3,
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()

  // Mock data - in real app, fetch from API
  const stats = {
    questionsAnswered: 157,
    correctAnswers: 134,
    accuracy: 85,
    studyStreak: 7,
    totalStudyTime: 3420, // minutes
    battlesWon: 3,
    battlesPlayed: 8,
    level: session?.user?.level || 5,
    xp: session?.user?.totalXP || 1250,
    nextLevelXP: 1750,
  }

  const recentActivity = [
    {
      id: 1,
      type: 'practice',
      title: 'Ethics Practice Session',
      score: 92,
      time: '2 hours ago',
      icon: BookOpen,
    },
    {
      id: 2,
      type: 'battle',
      title: 'Quick Battle Victory',
      score: 8,
      time: '1 day ago',
      icon: Zap,
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Streak Master Achievement',
      score: null,
      time: '2 days ago',
      icon: Award,
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Level I Mock Exam',
      date: 'Tomorrow, 2:00 PM',
      type: 'exam',
    },
    {
      id: 2,
      title: 'Study Group Discussion',
      date: 'Friday, 7:00 PM',
      type: 'community',
    },
  ]

  const weeklyGoals = [
    { title: 'Study 20 hours', current: 14, target: 20 },
    { title: 'Answer 200 questions', current: 157, target: 200 },
    { title: 'Win 3 battles', current: 3, target: 3 },
  ]

  const quickActions = [
    {
      title: 'Start Practice',
      description: 'Begin a practice session',
      href: '/dashboard/practice',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Join Battle',
      description: 'Find a quick battle',
      href: '/dashboard/battles',
      icon: Zap,
      color: 'bg-yellow-500',
    },
    {
      title: 'Take Mock Exam',
      description: 'Full practice exam',
      href: '/dashboard/exams',
      icon: Target,
      color: 'bg-green-500',
    },
    {
      title: 'View Analytics',
      description: 'Check your progress',
      href: '/dashboard/analytics',
      icon: BarChart3,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Ready to continue your CFA journey? Let's make today count!
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Badge variant="secondary" className="text-sm">
            {session?.user?.cfaLevel?.replace('_', ' ') || 'Level I'} Candidate
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.questionsAnswered}</div>
            <p className="text-xs text-muted-foreground">
              {stats.accuracy}% accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studyStreak} days</div>
            <p className="text-xs text-muted-foreground">
              Keep it going! 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battle Record</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.battlesWon}/{stats.battlesPlayed}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.battlesWon / stats.battlesPlayed) * 100)}% win rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level Progress</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {stats.level}</div>
            <p className="text-xs text-muted-foreground">
              {formatXP(stats.xp)} / {formatXP(stats.nextLevelXP)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Jump right into your studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Goals</CardTitle>
              <CardDescription>
                Track your weekly study objectives
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {weeklyGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest study sessions and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    {activity.score && (
                      <Badge variant="secondary">{activity.score}%</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Level Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cfa-blue to-cfa-gold rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{stats.level}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {formatXP(stats.nextLevelXP - stats.xp)} XP to next level
                  </p>
                  <Progress 
                    value={(stats.xp / stats.nextLevelXP) * 100} 
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Tip */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Study Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                "Focus on understanding concepts rather than memorizing. The CFA exam tests your ability to apply knowledge in real-world scenarios."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
