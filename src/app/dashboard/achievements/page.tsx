'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Star, 
  Crown, 
  Zap, 
  Target, 
  Flame, 
  Shield, 
  Award,
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  Lock,
  CheckCircle2
} from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'QUESTIONS_ANSWERED' | 'STUDY_TIME' | 'STREAK' | 'ACCURACY' | 'SPEED' | 'SOCIAL' | 'SPECIAL'
  difficulty: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  xpReward: number
  progress: number
  maxProgress: number
  isCompleted: boolean
  completedAt?: Date
  requirements: string[]
  rarity: number // percentage of users who have this
}

export default function AchievementsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const achievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Answer your first 10 questions',
      icon: '👶',
      category: 'QUESTIONS_ANSWERED',
      difficulty: 'BRONZE',
      xpReward: 50,
      progress: 10,
      maxProgress: 10,
      isCompleted: true,
      completedAt: new Date('2024-01-10'),
      requirements: ['Answer 10 questions'],
      rarity: 95
    },
    {
      id: 'century-mark',
      title: 'Century Mark',
      description: 'Answer 100 questions correctly',
      icon: '💯',
      category: 'QUESTIONS_ANSWERED',
      difficulty: 'SILVER',
      xpReward: 200,
      progress: 87,
      maxProgress: 100,
      isCompleted: false,
      requirements: ['Answer 100 questions correctly'],
      rarity: 68
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Get 100% on any practice session',
      icon: '🎯',
      category: 'ACCURACY',
      difficulty: 'GOLD',
      xpReward: 300,
      progress: 1,
      maxProgress: 1,
      isCompleted: true,
      completedAt: new Date('2024-01-12'),
      requirements: ['Score 100% on a practice session'],
      rarity: 23
    },
    {
      id: 'speed-demon',
      title: 'Speed Demon',
      description: 'Average under 60 seconds per question for a week',
      icon: '⚡',
      category: 'SPEED',
      difficulty: 'GOLD',
      xpReward: 250,
      progress: 5,
      maxProgress: 7,
      isCompleted: false,
      requirements: ['Maintain <60s avg for 7 days'],
      rarity: 31
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Study for 7 consecutive days',
      icon: '🔥',
      category: 'STREAK',
      difficulty: 'SILVER',
      xpReward: 150,
      progress: 7,
      maxProgress: 7,
      isCompleted: true,
      completedAt: new Date('2024-01-14'),
      requirements: ['7-day study streak'],
      rarity: 45
    },
    {
      id: 'month-master',
      title: 'Month Master',
      description: 'Study for 30 consecutive days',
      icon: '👑',
      category: 'STREAK',
      difficulty: 'PLATINUM',
      xpReward: 500,
      progress: 15,
      maxProgress: 30,
      isCompleted: false,
      requirements: ['30-day study streak'],
      rarity: 8
    },
    {
      id: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Help 10 community members',
      icon: '🦋',
      category: 'SOCIAL',
      difficulty: 'GOLD',
      xpReward: 200,
      progress: 7,
      maxProgress: 10,
      isCompleted: false,
      requirements: ['Get 10 helpful votes in community'],
      rarity: 19
    },
    {
      id: 'battle-champion',
      title: 'Battle Champion',
      description: 'Win 25 quiz battles',
      icon: '⚔️',
      category: 'SOCIAL',
      difficulty: 'PLATINUM',
      xpReward: 400,
      progress: 23,
      maxProgress: 25,
      isCompleted: false,
      requirements: ['Win 25 quiz battles'],
      rarity: 12
    },
    {
      id: 'ethics-expert',
      title: 'Ethics Expert',
      description: 'Achieve 95% accuracy in Ethics',
      icon: '⚖️',
      category: 'ACCURACY',
      difficulty: 'PLATINUM',
      xpReward: 350,
      progress: 92,
      maxProgress: 95,
      isCompleted: false,
      requirements: ['95% accuracy in Ethics topic'],
      rarity: 15
    },
    {
      id: 'legendary-learner',
      title: 'Legendary Learner',
      description: 'Complete all Level 1 topics with 85%+ accuracy',
      icon: '🏆',
      category: 'SPECIAL',
      difficulty: 'DIAMOND',
      xpReward: 1000,
      progress: 7,
      maxProgress: 10,
      isCompleted: false,
      requirements: ['85%+ accuracy in all 10 Level 1 topics'],
      rarity: 3
    }
  ]

  const categories = [
    { id: 'all', name: 'All Achievements', icon: Trophy, count: achievements.length },
    { id: 'QUESTIONS_ANSWERED', name: 'Practice', icon: BookOpen, count: achievements.filter(a => a.category === 'QUESTIONS_ANSWERED').length },
    { id: 'ACCURACY', name: 'Accuracy', icon: Target, count: achievements.filter(a => a.category === 'ACCURACY').length },
    { id: 'STREAK', name: 'Consistency', icon: Flame, count: achievements.filter(a => a.category === 'STREAK').length },
    { id: 'SPEED', name: 'Speed', icon: Zap, count: achievements.filter(a => a.category === 'SPEED').length },
    { id: 'SOCIAL', name: 'Community', icon: Users, count: achievements.filter(a => a.category === 'SOCIAL').length },
    { id: 'SPECIAL', name: 'Special', icon: Crown, count: achievements.filter(a => a.category === 'SPECIAL').length }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BRONZE': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'SILVER': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'GOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PLATINUM': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'DIAMOND': return 'bg-blue-100 text-blue-800 border-blue-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRarityColor = (rarity: number) => {
    if (rarity >= 80) return 'text-gray-600'
    if (rarity >= 50) return 'text-green-600'
    if (rarity >= 20) return 'text-yellow-600'
    if (rarity >= 10) return 'text-orange-600'
    return 'text-red-600'
  }

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory)

  const completedCount = achievements.filter(a => a.isCompleted).length
  const totalXP = achievements.filter(a => a.isCompleted).reduce((sum, a) => sum + a.xpReward, 0)
  const completionRate = (completedCount / achievements.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and unlock rewards
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-cfa-blue">{completedCount}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalXP.toLocaleString()}</div>
              <div className="text-gray-600">XP Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{completionRate.toFixed(0)}%</div>
              <div className="text-gray-600">Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Achievement Progress</h3>
              <p className="text-sm text-gray-600">
                {completedCount} of {achievements.length} achievements unlocked
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completionRate.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
          <Progress value={completionRate} className="h-3" />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Beginner</span>
            <span>Expert</span>
            <span>Master</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              selectedCategory === category.id
                ? 'border-cfa-blue bg-blue-50 text-cfa-blue'
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <category.icon className="h-6 w-6 mx-auto mb-2" />
            <div className="text-sm font-medium">{category.name}</div>
            <div className="text-xs text-gray-500">{category.count}</div>
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              achievement.isCompleted 
                ? 'ring-2 ring-green-200 bg-green-50' 
                : achievement.progress > 0 
                  ? 'ring-2 ring-blue-200 bg-blue-50'
                  : 'hover:ring-2 hover:ring-gray-200'
            }`}
          >
            {achievement.isCompleted && (
              <div className="absolute top-4 right-4">
                <div className="bg-green-500 text-white p-1 rounded-full">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
            )}

            <CardContent className="p-6">
              {/* Achievement Icon & Title */}
              <div className="text-center mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl mb-3 ${
                  achievement.isCompleted ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {achievement.isCompleted ? '✨' : achievement.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>

              {/* Difficulty & Rarity */}
              <div className="flex justify-between items-center mb-4">
                <Badge className={`border ${getDifficultyColor(achievement.difficulty)}`}>
                  {achievement.difficulty}
                </Badge>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}% earned
                  </div>
                  <div className="text-xs text-gray-500">
                    +{achievement.xpReward} XP
                  </div>
                </div>
              </div>

              {/* Progress */}
              {!achievement.isCompleted && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.maxProgress) * 100}
                    className="h-2"
                  />
                </div>
              )}

              {/* Requirements */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {achievement.requirements.map((req, index) => (
                    <li key={index} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        achievement.isCompleted ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Completion Date */}
              {achievement.isCompleted && achievement.completedAt && (
                <div className="text-center">
                  <Badge variant="success" className="text-xs">
                    Completed {achievement.completedAt.toLocaleDateString()}
                  </Badge>
                </div>
              )}

              {/* Action Button */}
              {!achievement.isCompleted && achievement.progress > 0 && (
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {((achievement.progress / achievement.maxProgress) * 100).toFixed(0)}% Complete
                  </Button>
                </div>
              )}
            </CardContent>

            {/* Shimmer effect for completed achievements */}
            {achievement.isCompleted && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </Card>
        ))}
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Your latest unlocked achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements
              .filter(a => a.isCompleted && a.completedAt)
              .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
              .slice(0, 5)
              .map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success" className="text-xs">
                      +{achievement.xpReward} XP
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.completedAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}