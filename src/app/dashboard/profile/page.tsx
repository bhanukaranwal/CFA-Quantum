'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  User, 
  Trophy, 
  Star, 
  Calendar, 
  Clock, 
  Target, 
  Award,
  TrendingUp,
  BookOpen,
  Zap,
  Users,
  Edit,
  Settings,
  Medal,
  Crown,
  Flame
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')

  // Mock user data - in real app, fetch from API
  const userProfile = {
    name: session?.user?.name || 'John Doe',
    email: session?.user?.email || 'john@example.com',
    image: session?.user?.image,
    joinedDate: '2024-01-15',
    level: 12,
    totalXP: 2450,
    currentStreak: 7,
    longestStreak: 15,
    cfaLevel: 'LEVEL_1',
    targetExamDate: '2024-05-18',
    studyTime: {
      total: 142, // hours
      thisWeek: 12,
      thisMonth: 45
    },
    stats: {
      questionsAnswered: 1247,
      correctAnswers: 967,
      accuracy: 78,
      battlesWon: 23,
      battlesPlayed: 31,
      forumPosts: 12,
      forumReputation: 340
    },
    achievements: [
      { id: 1, name: 'First Steps', icon: '👶', rarity: 'BRONZE', unlockedAt: '2024-01-16' },
      { id: 2, name: 'Week Warrior', icon: '🔥', rarity: 'SILVER', unlockedAt: '2024-01-23' },
      { id: 3, name: 'Perfect Score', icon: '🎯', rarity: 'GOLD', unlockedAt: '2024-02-01' },
      { id: 4, name: 'Battle Champion', icon: '⚔️', rarity: 'PLATINUM', unlockedAt: '2024-02-10' },
      { id: 5, name: 'Study Master', icon: '📚', rarity: 'DIAMOND', unlockedAt: '2024-02-15' }
    ],
    recentActivity: [
      { type: 'practice', description: 'Completed Ethics practice session', timestamp: '2 hours ago' },
      { type: 'battle', description: 'Won battle against Sarah Chen', timestamp: '5 hours ago' },
      { type: 'achievement', description: 'Unlocked "Speed Demon" achievement', timestamp: '1 day ago' },
      { type: 'forum', description: 'Posted in "Study Tips" discussion', timestamp: '2 days ago' }
    ]
  }

  const progressToNextLevel = ((userProfile.totalXP % 250) / 250) * 100
  const xpForNextLevel = 250 - (userProfile.totalXP % 250)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'activity', label: 'Activity' },
    { id: 'stats', label: 'Statistics' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            View and manage your CFA Quantum profile
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button variant="ghost">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-cfa-blue to-cfa-gold h-32"></div>
        <CardContent className="relative">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white bg-white">
                <AvatarImage src={userProfile.image || ''} />
                <AvatarFallback className="text-2xl bg-gray-100">
                  {getInitials(userProfile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-cfa-blue text-white rounded-full p-2">
                <span className="text-sm font-bold">L{userProfile.level}</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 mt-4 md:mt-0 md:pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="cfa">{userProfile.cfaLevel.replace('_', ' ')}</Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(userProfile.joinedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-3xl font-bold text-cfa-blue">{userProfile.totalXP.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total XP</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {xpForNextLevel} XP to Level {userProfile.level + 1}
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Level {userProfile.level}</span>
                  <span>Level {userProfile.level + 1}</span>
                </div>
                <Progress value={progressToNextLevel} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.currentStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.stats.accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.studyTime.total}h</div>
            <div className="text-sm text-gray-600">Study Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userProfile.stats.battlesWon}</div>
            <div className="text-sm text-gray-600">Battles Won</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-cfa-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activeTab === 'overview' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'practice' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'battle' ? 'bg-purple-100 text-purple-600' :
                          activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {activity.type === 'practice' && <BookOpen className="h-4 w-4" />}
                          {activity.type === 'battle' && <Zap className="h-4 w-4" />}
                          {activity.type === 'achievement' && <Award className="h-4 w-4" />}
                          {activity.type === 'forum' && <Users className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Study Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Weekly Study Time</span>
                        <span>{userProfile.studyTime.thisWeek}/15h</span>
                      </div>
                      <Progress value={(userProfile.studyTime.thisWeek / 15) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Monthly Questions</span>
                        <span>347/500</span>
                      </div>
                      <Progress value={(347 / 500) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Exam Countdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Exam Countdown</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-cfa-blue mb-2">87</div>
                  <div className="text-sm text-gray-600">Days until {userProfile.cfaLevel.replace('_', ' ')} exam</div>
                  <div className="text-xs text-gray-500 mt-1">{userProfile.targetExamDate}</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'achievements' && (
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfile.achievements.map((achievement) => (
                <Card key={achievement.id} className="text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h3 className="font-semibold mb-1">{achievement.name}</h3>
                    <Badge 
                      variant={
                        achievement.rarity === 'DIAMOND' ? 'cfa' :
                        achievement.rarity === 'PLATINUM' ? 'gold' :
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {achievement.rarity}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-2">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions Answered</span>
                    <span className="font-semibold">{userProfile.stats.questionsAnswered.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Correct Answers</span>
                    <span className="font-semibold text-green-600">{userProfile.stats.correctAnswers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Accuracy</span>
                    <span className="font-semibold">{userProfile.stats.accuracy}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Battle Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battles Played</span>
                    <span className="font-semibold">{userProfile.stats.battlesPlayed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battles Won</span>
                    <span className="font-semibold text-green-600">{userProfile.stats.battlesWon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Win Rate</span>
                    <span className="font-semibold">{Math.round((userProfile.stats.battlesWon / userProfile.stats.battlesPlayed) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Forum Posts</span>
                    <span className="font-semibold">{userProfile.stats.forumPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reputation</span>
                    <span className="font-semibold text-purple-600">{userProfile.stats.forumReputation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Helpful Votes</span>
                    <span className="font-semibold">156</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}