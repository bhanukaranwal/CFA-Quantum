'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Clock, 
  Users, 
  Trophy,
  Zap,
  Target,
  Crown,
  Timer,
  CheckCircle2
} from 'lucide-react'
import { getInitials } from '@/lib/utils'

export default function BattlePage() {
  const params = useParams()
  const router = useRouter()
  const battleId = params.battleId as string
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [battleStatus, setBattleStatus] = useState<'waiting' | 'active' | 'finished'>('active')

  // Mock battle data
  const battleData = {
    id: battleId,
    title: 'Ethics Showdown',
    questionCount: 10,
    timeLimit: 300,
    participants: [
      { id: '1', name: 'You', score: 0, avatar: '', position: 1 },
      { id: '2', name: 'Sarah Chen', score: 0, avatar: '', position: 2 },
      { id: '3', name: 'Mike Rodriguez', score: 0, avatar: '', position: 3 },
      { id: '4', name: 'Alex Johnson', score: 0, avatar: '', position: 4 }
    ],
    questions: [
      {
        id: 'q1',
        text: 'Which of the following is a key principle of the CFA Institute Code of Ethics?',
        options: {
          A: 'Maximize profits for clients',
          B: 'Act with integrity, competence, diligence, respect, and in an ethical manner',
          C: 'Always follow majority opinion',
          D: 'Prioritize personal relationships over professional duties'
        },
        correct: 'B'
      }
      // More questions would be here
    ]
  }

  const currentQ = battleData.questions[currentQuestion]

  // Timer effect
  useEffect(() => {
    if (timeRemaining <= 0 || battleStatus !== 'active') return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setBattleStatus('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, battleStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return
    
    // Submit answer logic here
    setSelectedAnswer('')
    
    if (currentQuestion < battleData.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setBattleStatus('finished')
      router.push(`/battle/${battleId}/results`)
    }
  }

  if (battleStatus === 'finished') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-6">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Battle Complete!</h2>
            <p className="text-gray-600 mb-4">Calculating final results...</p>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl font-semibold">{battleData.title}</h1>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {battleData.questionCount}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-red-600">
                <Timer className="h-5 w-5" />
                <span className="font-mono text-lg font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-lg leading-relaxed">
                  {currentQ?.text}
                </div>
                
                <div className="space-y-3">
                  {currentQ?.options && Object.entries(currentQ.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedAnswer(key)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswer === key
                          ? 'border-cfa-blue bg-blue-50 text-cfa-blue'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          selectedAnswer === key
                            ? 'border-cfa-blue bg-cfa-blue text-white'
                            : 'border-gray-300'
                        }`}>
                          {key}
                        </div>
                        <div className="flex-1">{value}</div>
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-end pt-6 border-t">
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer}
                    variant="cfa"
                    className="min-w-32"
                  >
                    {currentQuestion === battleData.questions.length - 1 ? 'Finish' : 'Next'}
                    <Zap className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Participants Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Live Rankings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {battleData.participants.map((participant, index) => (
                    <div
                      key={participant.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${
                        participant.name === 'You' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-500 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs">
                          {getInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {participant.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {participant.score} points
                        </p>
                      </div>
                      
                      {participant.name === 'You' && (
                        <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Battle Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Questions</span>
                    <span>{currentQuestion + 1}/{battleData.questionCount}</span>
                  </div>
                  <Progress 
                    value={((currentQuestion + 1) / battleData.questionCount) * 100} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-sm">
                    <span>Time Used</span>
                    <span>{formatTime(battleData.timeLimit - timeRemaining)}</span>
                  </div>
                  <Progress 
                    value={((battleData.timeLimit - timeRemaining) / battleData.timeLimit) * 100} 
                    className="h-2"
                    indicatorClassName="bg-red-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}