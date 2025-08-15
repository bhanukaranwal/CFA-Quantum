'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy,
  Target,
  Clock,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Share,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'

export default function ExamResultsPage() {
  const params = useParams()
  const sessionId = params.sessionId as string

  // Mock results data
  const results = {
    score: 78,
    totalQuestions: 90,
    correctAnswers: 70,
    incorrectAnswers: 20,
    timeSpent: 4620, // seconds
    timeLimit: 5400, // seconds
    passed: true,
    percentile: 72,
    topicBreakdown: [
      { topic: 'Ethics', correct: 15, total: 18, accuracy: 83 },
      { topic: 'Quantitative Methods', correct: 12, total: 16, accuracy: 75 },
      { topic: 'Economics', correct: 10, total: 14, accuracy: 71 },
      { topic: 'Financial Statement Analysis', correct: 18, total: 24, accuracy: 75 },
      { topic: 'Corporate Issuers', correct: 8, total: 10, accuracy: 80 },
      { topic: 'Equity Investments', correct: 7, total: 8, accuracy: 88 }
    ],
    strengths: ['Ethics & Professional Standards', 'Equity Investments'],
    weaknesses: ['Economics', 'Quantitative Methods'],
    recommendations: [
      'Focus more time on Economics fundamentals',
      'Practice more quantitative calculation problems',
      'Review time value of money concepts'
    ]
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTopicColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-green-500'
    if (accuracy >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
              results.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <Trophy className="h-10 w-10 text-green-600" />
              ) : (
                <AlertCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h1>
            <p className="text-gray-600">
              {results.passed 
                ? 'You passed the mock exam with a strong performance.' 
                : 'Review your results and focus on improvement areas.'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold mb-2 ${getScoreColor(results.score)}`}>
                {results.score}%
              </div>
              <p className="text-sm text-gray-600">Overall Score</p>
              <Badge variant={results.passed ? 'success' : 'destructive'} className="mt-2">
                {results.passed ? 'PASSED' : 'FAILED'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <p className="text-sm text-gray-600">Correct Answers</p>
              <div className="mt-2">
                <Progress value={(results.correctAnswers / results.totalQuestions) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatTime(results.timeSpent)}
              </div>
              <p className="text-sm text-gray-600">Time Used</p>
              <p className="text-xs text-gray-500 mt-1">
                of {formatTime(results.timeLimit)} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {results.percentile}th
              </div>
              <p className="text-sm text-gray-600">Percentile</p>
              <p className="text-xs text-gray-500 mt-1">
                Better than {results.percentile}% of test takers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Topic Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Topic Performance
              </CardTitle>
              <CardDescription>
                Your accuracy across different CFA topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.topicBreakdown.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{topic.topic}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {topic.correct}/{topic.total}
                        </span>
                        <Badge variant={topic.accuracy >= 80 ? 'success' : topic.accuracy >= 70 ? 'warning' : 'destructive'}>
                          {topic.accuracy}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={topic.accuracy} 
                      className="h-2"
                      indicatorClassName={getTopicColor(topic.accuracy)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Analysis & Recommendations
              </CardTitle>
              <CardDescription>
                Areas to focus on for improvement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strengths */}
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Strengths
                </h4>
                <div className="space-y-1">
                  {results.strengths.map((strength, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      {strength}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="font-medium text-red-700 mb-2 flex items-center">
                  <XCircle className="h-4 w-4 mr-2" />
                  Areas for Improvement
                </h4>
                <div className="space-y-1">
                  {results.weaknesses.map((weakness, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                      {weakness}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-blue-700 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Recommendations
                </h4>
                <div className="space-y-1">
                  {results.recommendations.map((recommendation, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0" />
                      {recommendation}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="cfa">
            <Link href="/dashboard/practice">
              <RotateCcw className="h-4 w-4 mr-2" />
              Practice More
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/dashboard/mock-exam">
              <Clock className="h-4 w-4 mr-2" />
              Retake Exam
            </Link>
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  )
}