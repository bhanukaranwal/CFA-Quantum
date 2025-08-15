'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Clock, 
  Target,
  TrendingUp,
  RotateCcw,
  Share,
  Home
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

export default function BattleResultsPage() {
  const params = useParams()
  const battleId = params.battleId as string

  // Mock battle results data
  const battleResults = {
    id: battleId,
    title: 'Ethics Showdown',
    status: 'completed',
    totalQuestions: 10,
    timeLimit: 300, // 5 minutes
    finalRankings: [
      {
        rank: 1,
        userId: 'user1',
        name: 'Alex Johnson',
        avatar: '',
        score: 92,
        correctAnswers: 9,
        timeSpent: 245,
        xpEarned: 200
      },
      {
        rank: 2,
        userId: 'currentUser',
        name: 'You',
        avatar: '',
        score: 78,
        correctAnswers: 8,
        timeSpent: 267,
        xpEarned: 150
      },
      {
        rank: 3,
        userId: 'user2',
        name: 'Sarah Chen',
        avatar: '',
        score: 71,
        correctAnswers: 7,
        timeSpent: 289,
        xpEarned: 100
      },
      {
        rank: 4,
        userId: 'user3',
        name: 'Mike Rodriguez',
        avatar: '',
        score: 65,
        correctAnswers: 6,
        timeSpent: 298,
        xpEarned: 50
      }
    ],
    yourStats: {
      rank: 2,
      score: 78,
      correctAnswers: 8,
      incorrectAnswers: 2,
      timeSpent: 267,
      averageTimePerQuestion: 26.7,
      xpEarned: 150,
      achievements: ['Speed Demon', 'Ethics Expert']
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600'
      case 2: return 'from-gray-300 to-gray-500'
      case 3: return 'from-orange-400 to-orange-600'
      default: return 'from-gray-200 to-gray-400'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown
      case 2: return Medal
      case 3: return Medal
      default: return Star
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 bg-gradient-to-r ${
              battleResults.yourStats.rank === 1 ? 'from-yellow-400 to-yellow-600' :
              battleResults.yourStats.rank <= 3 ? 'from-blue-400 to-blue-600' :
              'from-gray-400 to-gray-600'
            }`}>
              {battleResults.yourStats.rank === 1 ? (
                <Crown className="h-10 w-10 text-white" />
              ) : (
                <Trophy className="h-10 w-10 text-white" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {battleResults.yourStats.rank === 1 ? 'Victory!' : 
               battleResults.yourStats.rank <= 3 ? 'Great Job!' : 'Good Effort!'}
            </h1>
            <p className="text-gray-600">
              {battleResults.title} - Battle Complete
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Performance */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Your Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cfa-blue mb-1">
                      #{battleResults.yourStats.rank}
                    </div>
                    <div className="text-sm text-gray-600">Final Rank</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {battleResults.yourStats.score}%
                    </div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {formatTime(battleResults.yourStats.timeSpent)}
                    </div>
                    <div className="text-sm text-gray-600">Time Used</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      +{battleResults.yourStats.xpEarned}
                    </div>
                    <div className="text-sm text-gray-600">XP Earned</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Correct Answers:</span>
                      <span className="font-medium text-green-600">
                        {battleResults.yourStats.correctAnswers}/{battleResults.totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Incorrect Answers:</span>
                      <span className="font-medium text-red-600">
                        {battleResults.yourStats.incorrectAnswers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Time/Question:</span>
                      <span className="font-medium">
                        {battleResults.yourStats.averageTimePerQuestion.toFixed(1)}s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Achievements:</span>
                      <span className="font-medium text-yellow-600">
                        {battleResults.yourStats.achievements.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                {battleResults.yourStats.achievements.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Achievements Unlocked</h4>
                    <div className="flex flex-wrap gap-2">
                      {battleResults.yourStats.achievements.map((achievement, index) => (
                        <Badge key={index} variant="gold" className="flex items-center">
                          <Star className="h-3 w-3 mr-1" />
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Final Rankings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Final Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {battleResults.finalRankings.map((participant) => {
                    const RankIcon = getRankIcon(participant.rank)
                    
                    return (
                      <div
                        key={participant.userId}
                        className={`flex items-center space-x-4 p-4 rounded-lg border-2 ${
                          participant.name === 'You' 
                            ? 'border-cfa-blue bg-blue-50' 
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-r ${getRankColor(participant.rank)}`}>
                          <RankIcon className="h-6 w-6" />
                        </div>
                        
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{participant.name}</h4>
                            {participant.name === 'You' && (
                              <Badge variant="cfa" className="text-xs">YOU</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {participant.correctAnswers}/{battleResults.totalQuestions} correct • {formatTime(participant.timeSpent)}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xl font-bold">{participant.score}%</div>
                          <div className="text-sm text-green-600">+{participant.xpEarned} XP</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" variant="cfa">
                  <Link href="/dashboard/battles">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Join Another Battle
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/practice">
                    <Target className="h-4 w-4 mr-2" />
                    Practice More
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
                
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/dashboard">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Battle Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Battle Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battle Type:</span>
                    <span className="font-medium">Quick Match</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{battleResults.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Limit:</span>
                    <span className="font-medium">{formatTime(battleResults.timeLimit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-medium">{battleResults.finalRankings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Topic:</span>
                    <span className="font-medium">Ethics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Good Accuracy</span>
                    </div>
                    <p className="text-blue-700">
                      Your {battleResults.yourStats.score}% accuracy is solid. Keep practicing to improve further.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-900">Time Management</span>
                    </div>
                    <p className="text-orange-700">
                      Try to answer faster while maintaining accuracy to gain time bonuses.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}