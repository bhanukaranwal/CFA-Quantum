'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Trophy, 
  Crown, 
  Medal, 
  Star, 
  TrendingUp, 
  Users, 
  Zap,
  Target,
  Clock,
  BookOpen,
  Award,
  Calendar
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface LeaderboardUser {
  id: string
  name: string
  avatar?: string
  level: number
  totalXP: number
  weeklyXP: number
  accuracy: number
  studyStreak: number
  battlesWon: number
  questionsAnswered: number
  cfaLevel: string
  country?: string
  rank: number
  previousRank?: number
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState('weekly')
  const [cfaLevel, setCfaLevel] = useState('all')
  const [category, setCategory] = useState('overall')

  // Mock leaderboard data
  const leaderboardData: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: '',
      level: 25,
      totalXP: 12450,
      weeklyXP: 850,
      accuracy: 92,
      studyStreak: 28,
      battlesWon: 47,
      questionsAnswered: 2340,
      cfaLevel: 'LEVEL_1',
      country: 'Singapore',
      rank: 1,
      previousRank: 3
    },
    {
      id: '2',
      name: 'You',
      avatar: '',
      level: 18,
      totalXP: 8650,
      weeklyXP: 720,
      accuracy: 85,
      studyStreak: 15,
      battlesWon: 23,
      questionsAnswered: 1567,
      cfaLevel: 'LEVEL_1',
      country: 'United States',
      rank: 2,
      previousRank: 2
    },
    {
      id: '3',
      name: 'Alex Rodriguez',
      avatar: '',
      level: 22,
      totalXP: 11200,
      weeklyXP: 680,
      accuracy: 88,
      studyStreak: 22,
      battlesWon: 35,
      questionsAnswered: 2890,
      cfaLevel: 'LEVEL_1',
      country: 'Mexico',
      rank: 3,
      previousRank: 1
    },
    {
      id: '4',
      name: 'Emily Johnson',
      avatar: '',
      level: 20,
      totalXP: 9800,
      weeklyXP: 650,
      accuracy: 90,
      studyStreak: 19,
      battlesWon: 29,
      questionsAnswered: 2100,
      cfaLevel: 'LEVEL_1',
      country: 'Canada',
      rank: 4,
      previousRank: 5
    },
    {
      id: '5',
      name: 'David Kim',
      avatar: '',
      level: 19,
      totalXP: 9200,
      weeklyXP: 590,
      accuracy: 87,
      studyStreak: 12,
      battlesWon: 31,
      questionsAnswered: 1980,
      cfaLevel: 'LEVEL_1',
      country: 'South Korea',
      rank: 5,
      previousRank: 4
    }
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />
      case 2: return <Medal className="h-6 w-6 text-gray-400" />
      case 3: return <Medal className="h-6 w-6 text-orange-600" />
      default: return <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">{rank}</div>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    if (rank <= 10) return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
    return 'bg-gray-100 text-gray-600'
  }

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return null
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (current > previous) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    return <div className="h-4 w-4" />
  }

  const currentUser = leaderboardData.find(user => user.name === 'You')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">
            See how you rank against other CFA candidates worldwide
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Join Study Group
          </Button>
          <Button variant="cfa">
            <Zap className="h-4 w-4 mr-2" />
            Challenge Top Player
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="alltime">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={cfaLevel} onValueChange={setCfaLevel}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="CFA Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="LEVEL_1">Level 1</SelectItem>
            <SelectItem value="LEVEL_2">Level 2</SelectItem>
            <SelectItem value="LEVEL_3">Level 3</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="overall">Overall</SelectItem>
            <SelectItem value="xp">XP Earned</SelectItem>
            <SelectItem value="accuracy">Accuracy</SelectItem>
            <SelectItem value="streak">Study Streak</SelectItem>
            <SelectItem value="battles">Battle Wins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Your Rank Card */}
      {currentUser && (
        <Card className="border-cfa-blue bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-cfa-blue" />
              Your Current Rank
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(currentUser.rank)}`}>
                  <span className="text-xl font-bold">#{currentUser.rank}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      Level {currentUser.level}
                    </span>
                    <span className="flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-purple-500" />
                      {currentUser.totalXP.toLocaleString()} XP
                    </span>
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1 text-green-500" />
                      {currentUser.accuracy}% accuracy
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(currentUser.rank, currentUser.previousRank)}
                  <div className="text-sm text-gray-600">
                    {currentUser.previousRank && currentUser.rank !== currentUser.previousRank && (
                      <span>
                        {currentUser.rank < currentUser.previousRank ? '+' : ''}
                        {currentUser.previousRank - currentUser.rank} from last week
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="cfa" className="mt-1">
                  {currentUser.cfaLevel.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Leaderboard */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Global Leaderboard</span>
                <Badge variant="outline">
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Rankings
                </Badge>
              </CardTitle>
              <CardDescription>
                Top performers in the CFA Quantum community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                      user.name === 'You' 
                        ? 'border-cfa-blue bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex items-center space-x-3">
                      {getRankIcon(user.rank)}
                      {getTrendIcon(user.rank, user.previousRank)}
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {user.name === 'You' && (
                          <Badge variant="cfa" className="text-xs">YOU</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {user.cfaLevel.replace('_', ' ')}
                        </Badge>
                        {user.country && (
                          <span className="text-sm text-gray-500">{user.country}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          L{user.level}
                        </span>
                        <span className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          {user.accuracy}%
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {user.questionsAnswered.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {user.battlesWon} wins
                        </span>
                      </div>
                    </div>
                    
                    {/* XP */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-cfa-blue">
                        {timeframe === 'weekly' ? user.weeklyXP : user.totalXP}
                      </div>
                      <div className="text-xs text-gray-500">
                        {timeframe === 'weekly' ? 'XP this week' : 'Total XP'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hall of Fame</CardTitle>
              <CardDescription>This month's top achievers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.slice(0, 3).map((user, index) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.totalXP.toLocaleString()} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Users</span>
                <span className="font-semibold">2,847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions Answered Today</span>
                <span className="font-semibold">45,293</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Battles Completed</span>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Average Accuracy</span>
                <span className="font-semibold">76%</span>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { user: 'Sarah Chen', achievement: 'Speed Master', time: '2h ago' },
                  { user: 'Alex Rodriguez', achievement: 'Study Streak 30', time: '4h ago' },
                  { user: 'Emily Johnson', achievement: 'Perfect Score', time: '6h ago' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.user}</p>
                      <p className="text-xs text-gray-500">{item.achievement} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Challenge Button */}
          <Card className="bg-gradient-to-r from-cfa-blue to-cfa-gold text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Climb the Ranks!</h3>
              <p className="text-sm opacity-90 mb-4">
                Challenge top players and improve your ranking
              </p>
              <Button variant="secondary" className="w-full">
                Start Challenge
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}