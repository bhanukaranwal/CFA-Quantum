'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Flag, 
  ChevronLeft, 
  ChevronRight,
  Pause,
  Play,
  RotateCcw
} from 'lucide-react'

interface Question {
  id: string
  questionText: string
  options: Record<string, string>
  correctAnswer: string
  explanation: string
  topicArea: string
  difficulty: string
  timeToComplete: number
}

export default function ExamPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(5400) // 90 minutes
  const [isPaused, setIsPaused] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock questions - in real app, fetch from API
  const questions: Question[] = [
    {
      id: 'q1',
      questionText: 'Which of the following best describes the concept of time value of money?',
      options: {
        A: 'Money received today is worth more than the same amount received in the future',
        B: 'Money received in the future is worth more than today',
        C: 'Money has the same value regardless of when it is received',
        D: 'The value of money decreases over time due to inflation only'
      },
      correctAnswer: 'A',
      explanation: 'The time value of money concept states that money available today is worth more than the same amount in the future due to its potential earning capacity.',
      topicArea: 'Quantitative Methods',
      difficulty: 'INTERMEDIATE',
      timeToComplete: 90
    }
    // Add more mock questions as needed
  ]

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Timer effect
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, timeRemaining])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }))
  }

  const handleMarkQuestion = () => {
    const newMarked = new Set(markedQuestions)
    if (newMarked.has(currentQuestionIndex)) {
      newMarked.delete(currentQuestionIndex)
    } else {
      newMarked.add(currentQuestionIndex)
    }
    setMarkedQuestions(newMarked)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitExam = async () => {
    setIsSubmitting(true)
    try {
      // Submit exam logic here
      router.push(`/exam/results/${sessionId}`)
    } catch (error) {
      console.error('Error submitting exam:', error)
    }
  }

  const getTimerColor = () => {
    if (timeRemaining > 1800) return 'text-green-600' // > 30 minutes
    if (timeRemaining > 600) return 'text-yellow-600'  // > 10 minutes
    return 'text-red-600' // < 10 minutes
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">CFA Level 1 Mock Exam</h1>
              <Badge variant="outline">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${getTimerColor()}`}>
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg font-semibold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleSubmitExam}
                disabled={isSubmitting}
              >
                Submit Exam
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="pb-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{currentQuestion?.topicArea}</Badge>
                    <Badge variant="secondary">{currentQuestion?.difficulty}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkQuestion}
                      className={markedQuestions.has(currentQuestionIndex) ? 'bg-yellow-100' : ''}
                    >
                      <Flag className="h-4 w-4" />
                      {markedQuestions.has(currentQuestionIndex) ? 'Marked' : 'Mark'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Question Text */}
                <div className="text-lg leading-relaxed">
                  {currentQuestion?.questionText}
                </div>
                
                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion?.options && Object.entries(currentQuestion.options).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handleAnswerSelect(key)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedAnswers[currentQuestionIndex] === key
                          ? 'border-cfa-blue bg-blue-50 text-cfa-blue'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                          selectedAnswers[currentQuestionIndex] === key
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
                
                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="cfa"
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Question Navigator */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => {
                    const isAnswered = selectedAnswers[index] !== undefined
                    const isMarked = markedQuestions.has(index)
                    const isCurrent = index === currentQuestionIndex
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          isCurrent
                            ? 'bg-cfa-blue text-white ring-2 ring-cfa-blue ring-offset-2'
                            : isAnswered && isMarked
                              ? 'bg-yellow-400 text-white'
                              : isAnswered
                                ? 'bg-green-500 text-white'
                                : isMarked
                                  ? 'bg-yellow-200 text-yellow-800'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  })}
                </div>
                
                {/* Legend */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                    <span>Marked & Answered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span>Marked</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span>Not Answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Answered:</span>
                  <span className="font-semibold">{Object.keys(selectedAnswers).length}/{totalQuestions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Marked:</span>
                  <span className="font-semibold">{markedQuestions.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Remaining:</span>
                  <span className="font-semibold">{totalQuestions - Object.keys(selectedAnswers).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}