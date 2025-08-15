'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Zap, 
  Users, 
  Trophy, 
  Play, 
  Clock, 
  Target,
  Crown,
  Flame,
  Sword,
  Shield,
  Star,
  RefreshCw,
  Plus,
  Eye,
  Timer,
  Medal,
  Gamepad2
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface Battle {
  id: string
  title: string
  description: string
  cfaLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'
  battleType: 'ONE_VS_ONE' | 'TOURNAMENT' | 'QUICK_MATCH' | 'CUSTOM'
  status: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED'
  questionCount: number
  timeLimit: number
  topics: string[]
  difficulty: 'EASY' | 'INTERMEDIATE' | 'HARD'
  maxParticipants: number
  participants: BattleParticipant[]
  winnerId?: string
  startedAt?: Date
  endedAt?: Date
  createdAt: Date
  prizeXP: number
  entryFee: number
}

interface BattleParticipant {
  id: string
  userId: string
  user: {
    name: string
    image?: string
    level: number
    totalXP: number
  }
  score: number
  correctAnswers: number
  timeSpent: number
  rank?: number
  isReady: boolean
  joinedAt: Date
}

export default function BattlesPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'live' | 'create' | 'history'>('live')
  const [selectedLevel, setSelectedLevel] = useState<string>('LEVEL_1')
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [isLoading, setIsLoading] = useState(false)

  // Mock data - in real app, this would come from WebSocket/API
  const liveBattles: Battle[] = [
    {
      id: 'battle-1',
      title: 'Ethics Showdown',
      description: 'Quick battle focusing on professional standards',
      cfaLevel: 'LEVEL_1',
      battleType: 'QUICK_MATCH',
      status: 'WAITING',
      questionCount: 10,
      timeLimit: 300, // 5 minutes
      topics: ['Ethics'],
      difficulty: 'INTERMEDIATE',
      maxParticipants: 4,
      participants: [
        {
          id: 'p1',
          userId: 'user1',
          user: { name: 'Sarah Chen', level: 15, totalXP: 3200 },
          score: 0,
          correctAnswers: 0,
          timeSpent: 0,
          isReady: true,
          joinedAt: new Date()
        },
        {
          id: 'p2',
          userId: 'user2',
          user: { name: 'Mike Rodriguez', level: 12, totalXP: 2800 },
          score: 0,
          correctAnswers: 0,
          timeSpent: 0,
          isReady: false,
          joinedAt: new Date()
        }
      ],
      createdAt: new Date(),
      prizeXP: 150,
      entryFee: 10
    },
    {
      id: 'battle-2',
      title: 'Quantitative Masters',
      description: 'Advanced math and statistics challenge',
      cfaLevel: 'LEVEL_1',
      battleType: 'ONE_VS_ONE',
      status: 'IN_PROGRESS',
      questionCount: 15,
      timeLimit: 450,
      topics: ['Quantitative Methods'],
      difficulty: 'HARD',
      maxParticipants: 2,
      participants: [
        {
          id: 'p3',
          userId: 'user3',
          user: { name: 'Alex Johnson', level: 18, totalXP: 4100 },
          score: 85,
          correctAnswers: 12,
          timeSpent: 280,
          isReady: true,
          joinedAt: new Date()
        },
        {
          id: 'p4',
          userId: 'user4',
          user: { name: 'Emma Wilson', level: 16, totalXP: 3600 },
          score: 78,
          correctAnswers: 10,
          timeSpent: 295,
          isReady: true,
          joinedAt: new Date()
        }
      ],
      startedAt: new Date(Date.now() - 8 * 60 * 1000),
      createdAt: new Date(),
      prizeXP: 200,
      entryFee: 15
    },
    {
      id: 'battle-3',
      title: 'Tournament Finals',
      description: 'Elite championship battle - invitation only',
      cfaLevel: 'LEVEL_1',
      battleType: 'TOURNAMENT',
      status: 'WAITING',
      questionCount: 25,
      timeLimit: 900,
      topics: ['Ethics', 'FSA', 'Equity'],
      difficulty: 'HARD',
      maxParticipants: 8,
      participants: [
        {
          id: 'p5',
          userId: 'user5',
          user: { name: 'David Kim', level: 22, totalXP: 5200 },
          score: 0,
          correctAnswers: 0,
          timeSpent: 0,
          isReady: true,
          joinedAt: new Date()
        }
      ],
      createdAt: new Date(),
      prizeXP: 500,
      entryFee: 50
    }
  ]

  const myStats = {
    battlesWon: 23,
    battlesLost: 8,
    winRate: 74,
    totalEarnings: 2850, // XP
    currentRank: 47,
    bestStreak: 8,
    currentStreak: 3,
    favoriteTopics: ['Ethics', 'FSA'],
    averageScore: 82
  }

  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', level: 22, wins: 45, winRate: 89, totalXP: 8500 },
    { rank: 2, name: 'Sarah Chen', level: 20, wins: 38, winRate: 86, totalXP: 7200 },
    { rank: 3, name: 'David Kim', level: 19, wins: 32, winRate: 84, totalXP: 6800 },
    { rank: 47, name: session?.user?.name || 'You', level: 12, wins: 23, winRate: 74, totalXP: 2850 }
  ]

  const joinBattle = async (battleId: string) => {
    setIsLoading(true)
    try {
      // API call to join battle
      setTimeout(() => {
        window.location.href = `/battle/${battleId}`
      }, 1000)
    } catch (error) {
      console.error('Error joining battle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createQuickBattle = () => {
    setIsLoading(true)
    // API call to create quick battle
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const getBattleStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING': return 'bg-yellow-500'
      case 'IN_PROGRESS': return 'bg-green-500'
      case 'COMPLETED': return 'bg-gray-500'
      default: return 'bg-gray-400'
    }
  }

  const getBattleTypeIcon = (type: string) => {
    switch (type) {
      case 'ONE_VS_ONE': return Sword
      case 'TOURNAMENT': return Crown
      case 'QUICK_MATCH': return Zap
      default: return Gamepad2
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Battle Arena</h1>
          <p className="text-gray-600 mt-1">
            Challenge other candidates in real-time quiz battles
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button
            onClick={createQuickBattle}
            disabled={isLoading}
            variant="cfa"
          >
            <Zap className="h-4 w-4 mr-2" />
            Quick Battle
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Battles Won</p>
                <p className="text-2xl font-bold text-green-900">{myStats.battlesWon}</p>
                <p className="text-xs text-green-700">{myStats.winRate}% win rate</p>
              </div>
              <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Current Rank</p>
                <p className="text-2xl font-bold text-blue-900">#{myStats.currentRank}</p>
                <p className="text-xs text-blue-700">Global leaderboard</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Medal className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Win Streak</p>
                <p className="text-2xl font-bold text-orange-900 flex items-center">
                  {myStats.currentStreak}
                  <Flame className="h-5 w-5 ml-1" />
                </p>
                <p className="text-xs text-orange-700">Best: {myStats.bestStreak}</p>
              </div>
              <div className="h-12 w-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">XP Earned</p>
                <p className="text-2xl font-bold text-purple-900">{myStats.totalEarnings.toLocaleString()}</p>
                <p className="text-xs text-purple-700">From battles</p>
              </div>
              <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'live', label: 'Live Battles', icon: Zap },
          { id: 'create', label: 'Create Battle', icon: Plus },
          { id: 'history', label: 'Battle History', icon: Clock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-cfa-blue shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'live' && (
            <div className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="CFA Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Levels</SelectItem>
                        <SelectItem value="LEVEL_1">Level 1</SelectItem>
                        <SelectItem value="LEVEL_2">Level 2</SelectItem>
                        <SelectItem value="LEVEL_3">Level 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Battle Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="QUICK_MATCH">Quick Match</SelectItem>
                        <SelectItem value="ONE_VS_ONE">1 vs 1</SelectItem>
                        <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full md:w-auto">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live Battles */}
              {liveBattles.map((battle) => {
                const TypeIcon = getBattleTypeIcon(battle.battleType)
                const isInBattle = battle.participants.some(p => p.userId === session?.user?.id)
                const canJoin = battle.status === 'WAITING' && 
                              battle.participants.length < battle.maxParticipants && 
                              !isInBattle

                return (
                  <Card key={battle.id} className="overflow-hidden hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getBattleStatusColor(battle.status)} mt-2`} />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <TypeIcon className="h-5 w-5 text-gray-600" />
                              <h3 className="text-lg font-semibold">{battle.title}</h3>
                              {battle.battleType === 'TOURNAMENT' && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{battle.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">{battle.cfaLevel.replace('_', ' ')}</Badge>
                              <Badge variant="outline">{battle.questionCount} questions</Badge>
                              <Badge variant="outline">{Math.floor(battle.timeLimit / 60)}m</Badge>
                              <Badge variant="outline">{battle.difficulty}</Badge>
                              <Badge variant="cfa">+{battle.prizeXP} XP</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {battle.participants.length}/{battle.maxParticipants} players
                          </p>
                          {battle.entryFee > 0 && (
                            <p className="text-xs text-orange-600">
                              Entry: {battle.entryFee} XP
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Participants</p>
                        <div className="flex flex-wrap gap-2">
                          {battle.participants.map((participant) => (
                            <div
                              key={participant.id}
                              className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={participant.user.image} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(participant.user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{participant.user.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                L{participant.user.level}
                              </Badge>
                              {battle.status === 'IN_PROGRESS' && (
                                <Badge variant={participant.score > 0 ? 'success' : 'secondary'} className="text-xs">
                                  {participant.score}%
                                </Badge>
                              )}
                              {battle.status === 'WAITING' && (
                                <div className={`w-2 h-2 rounded-full ${
                                  participant.isReady ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                              )}
                            </div>
                          ))}
                          
                          {/* Empty slots */}
                          {Array.from({ length: battle.maxParticipants - battle.participants.length }).map((_, index) => (
                            <div
                              key={`empty-${index}`}
                              className="flex items-center justify-center bg-gray-100 rounded-lg p-2 w-16 h-8 border-2 border-dashed border-gray-300"
                            >
                              <Users className="h-4 w-4 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Battle Progress (for in-progress battles) */}
                      {battle.status === 'IN_PROGRESS' && battle.startedAt && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-900">Battle in Progress</span>
                            <span className="text-sm text-blue-700">
                              {Math.floor((Date.now() - battle.startedAt.getTime()) / 60000)}m elapsed
                            </span>
                          </div>
                          <Progress 
                            value={((Date.now() - battle.startedAt.getTime()) / (battle.timeLimit * 1000)) * 100} 
                            className="h-2" 
                          />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        {canJoin && (
                          <Button
                            onClick={() => joinBattle(battle.id)}
                            disabled={isLoading}
                            variant="cfa"
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Join Battle
                          </Button>
                        )}
                        
                        {isInBattle && battle.status === 'WAITING' && (
                          <Button variant="outline" className="flex-1">
                            <Shield className="h-4 w-4 mr-2" />
                            Ready Up
                          </Button>
                        )}
                        
                        {isInBattle && battle.status === 'IN_PROGRESS' && (
                          <Button
                            onClick={() => window.location.href = `/battle/${battle.id}`}
                            variant="cfa"
                            className="flex-1"
                          >
                            <Timer className="h-4 w-4 mr-2" />
                            Continue Battle
                          </Button>
                        )}
                        
                        {battle.status === 'IN_PROGRESS' && !isInBattle && (
                          <Button variant="outline" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Spectate
                          </Button>
                        )}
                        
                        {!canJoin && !isInBattle && battle.status === 'WAITING' && (
                          <Button variant="outline" disabled className="flex-1">
                            <Users className="h-4 w-4 mr-2" />
                            Battle Full
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {activeTab === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Battle</CardTitle>
                <CardDescription>
                  Set up a private battle with your own rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Battle Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter battle title"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Battle Type
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select battle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONE_VS_ONE">1 vs 1</SelectItem>
                        <SelectItem value="QUICK_MATCH">Quick Match (4 players)</SelectItem>
                        <SelectItem value="CUSTOM">Custom (up to 8 players)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Question Count
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Number of questions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 questions</SelectItem>
                        <SelectItem value="15">15 questions</SelectItem>
                        <SelectItem value="20">20 questions</SelectItem>
                        <SelectItem value="25">25 questions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Time Limit
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Time limit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">5 minutes</SelectItem>
                        <SelectItem value="600">10 minutes</SelectItem>
                        <SelectItem value="900">15 minutes</SelectItem>
                        <SelectItem value="1200">20 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Topics
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Ethics', 'Quantitative', 'Economics', 'FSA', 'Corporate', 'Equity'].map((topic) => (
                      <label key={topic} className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <Button variant="cfa" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Battle
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Preview Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Battles</CardTitle>
                  <CardDescription>Your battle history and results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Ethics Quick Match', result: 'Won', score: 92, xp: 150, date: '2h ago' },
                      { title: 'Quantitative Duel', result: 'Lost', score: 68, xp: 25, date: '1d ago' },
                      { title: 'FSA Tournament', result: 'Won', score: 85, xp: 300, date: '2d ago' },
                    ].map((battle, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{battle.title}</h4>
                          <p className="text-sm text-gray-600">{battle.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={battle.result === 'Won' ? 'success' : 'destructive'}>
                            {battle.result}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            {battle.score}% • +{battle.xp} XP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Battle Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((player, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      player.name === session?.user?.name ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        player.rank === 1 ? 'bg-yellow-500 text-white' :
                        player.rank === 2 ? 'bg-gray-400 text-white' :
                        player.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {player.rank}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{player.name}</p>
                        <p className="text-xs text-gray-600">
                          {player.wins} wins • {player.winRate}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        L{player.level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={createQuickBattle}
                disabled={isLoading}
                className="w-full"
                variant="cfa"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Quick Battle
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Find Study Buddy
              </Button>
              <Button variant="outline" className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Practice Mode
              </Button>
            </CardContent>
          </Card>

          {/* Battle Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Battle Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Speed Matters</h4>
                  <p className="text-blue-700">Answer quickly but accurately. Time bonuses can decide close battles.</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Know Your Strengths</h4>
                  <p className="text-green-700">Join battles in topics where you have high accuracy rates.</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900">Manage Your XP</h4>
                  <p className="text-orange-700">Don't risk all your XP on high-stakes battles. Build up gradually.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}