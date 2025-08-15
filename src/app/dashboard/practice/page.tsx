'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BookOpen, 
  Play, 
  Target, 
  Clock, 
  BarChart3,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface Topic {
  id: string
  name: string
  description: string
  totalQuestions: number
  completedQuestions: number
  accuracy: number
  averageTime: number
  difficulty: 'EASY' | 'INTERMEDIATE' | 'HARD'
  cfaLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'
  lastStudied?: Date
  estimatedTime: number // minutes
  color: string
  icon: string
}

export default function PracticePage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('LEVEL_1')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL')
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Mock topics data
  const topics: Topic[] = [
    {
      id: 'ethics',
      name: 'Ethics & Professional Standards',
      description: 'Code of Ethics, Standards of Professional Conduct, GIPS',
      totalQuestions: 120,
      completedQuestions: 85,
      accuracy: 88,
      averageTime: 95,
      difficulty: 'INTERMEDIATE',
      cfaLevel: 'LEVEL_1',
      lastStudied: new Date(Date.now() - 24 * 60 * 60 * 1000),
      estimatedTime: 45,
      color: 'bg-purple-500',
      icon: '⚖️'
    },
    {
      id: 'quant',
      name: 'Quantitative Methods',
      description: 'Time value of money, statistics, probability',
      totalQuestions: 96,
      completedQuestions: 72,
      accuracy: 82,
      averageTime: 105,
      difficulty: 'HARD',
      cfaLevel: 'LEVEL_1',
      lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedTime: 60,
      color: 'bg-blue-500',
      icon: '📊'
    },
    {
      id: 'economics',
      name: 'Economics',
      description: 'Microeconomics, macroeconomics, international trade',
      totalQuestions: 80,
      completedQuestions: 45,
      accuracy: 75,
      averageTime: 110,
      difficulty: 'INTERMEDIATE',
      cfaLevel: 'LEVEL_1',
      lastStudied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      estimatedTime: 50,
      color: 'bg-green-500',
      icon: '🏛️'
    },
    {
      id: 'fsa',
      name: 'Financial Statement Analysis',
      description: 'Financial statements, cash flow, financial analysis techniques',
      totalQuestions: 160,
      completedQuestions: 120,
      accuracy: 79,
      averageTime: 120,
      difficulty: 'HARD',
      cfaLevel: 'LEVEL_1',
      lastStudied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimatedTime: 75,
      color: 'bg-orange-500',
      icon: '📈'
    },
    {
      id: 'corporate',
      name: 'Corporate Issuers',
      description: 'Corporate governance, capital structure, working capital',
      totalQuestions: 64,
      completedQuestions: 32,
      accuracy: 71,
      averageTime: 115,
      difficulty: 'INTERMEDIATE',
      cfaLevel: 'LEVEL_1',
      lastStudied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      estimatedTime: 40,
      color: 'bg-red-500',
      icon: '🏢'
    },
    {
      id: 'equity',
      name: 'Equity Investments',
      description: 'Equity securities, industry analysis, equity valuation',
      totalQuestions: 88,
      completedQuestions: 65,
      accuracy: 84,
      averageTime: 100,
      difficulty: 'INTERMEDIATE',
      cfaLevel: 'LEVEL_1',
      lastStudied: new Date(Date.now() - 12 * 60 * 60 * 1000),
      estimatedTime: 55,
      color: 'bg-indigo-500',
      icon: '📊'
    }
  ]

  const filteredTopics = topics.filter(topic => {
    const levelMatch = selectedLevel === 'ALL' || topic.cfaLevel === selectedLevel
    const difficultyMatch = selectedDifficulty === 'ALL' || topic.difficulty === selectedDifficulty
    return levelMatch && difficultyMatch
  })

  const overallStats = {
    totalQuestions: topics.reduce((sum, topic) => sum + topic.totalQuestions, 0),
    completedQuestions: topics.reduce((sum, topic) => sum + topic.completedQuestions, 0),
    averageAccuracy: Math.round(topics.reduce((sum, topic) => sum + topic.accuracy, 0) / topics.length),
    totalStudyTime: 45, // hours
    streak: 7,
    level: 12,
    xp: 2450
  }

  const startPracticeSession = (topicId: string, difficulty?: string) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      window.location.href = `/exam/practice?topic=${topicId}&difficulty=${difficulty || 'MIXED'}`
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Practice</h1>
          <p className="text-gray-600 mt-1">
            Master CFA concepts with targeted practice sessions
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button asChild variant="outline">
            <Link href="/dashboard/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild variant="cfa">
            <Link href="/dashboard/mock-exam">
              <Clock className="h-4 w-4 mr-2" />
              Mock Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questions Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallStats.completedQuestions}
                </p>
                <p className="text-xs text-gray-500">
                  of {overallStats.totalQuestions} total
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={(overallStats.completedQuestions / overallStats.totalQuestions) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {overallStats.averageAccuracy}%
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% this week
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center">
                  {overallStats.streak}
                  <span className="text-base ml-1">🔥</span>
                </p>
                <p className="text-xs text-orange-600">
                  Keep it going!
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Level & XP</p>
                <p className="text-2xl font-bold text-gray-900">
                  Level {overallStats.level}
                </p>
                <p className="text-xs text-purple-600">
                  {overallStats.xp} XP
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                CFA Level
              </label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Levels</SelectItem>
                  <SelectItem value="LEVEL_1">Level 1</SelectItem>
                  <SelectItem value="LEVEL_2">Level 2</SelectItem>
                  <SelectItem value="LEVEL_3">Level 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Difficulty
              </label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Difficulties</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const progress = (topic.completedQuestions / topic.totalQuestions) * 100
          const isWeak = topic.accuracy < 75
          const isStrong = topic.accuracy >= 85
          
          return (
            <Card key={topic.id} className={`hover:shadow-lg transition-all duration-200 group ${
              isWeak ? 'border-l-4 border-l-red-500' : 
              isStrong ? 'border-l-4 border-l-green-500' : 
              'border-l-4 border-l-gray-300'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{topic.icon}</span>
                    <div>
                      <CardTitle className="text-lg leading-tight">{topic.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {topic.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      topic.difficulty === 'EASY' ? 'success' :
                      topic.difficulty === 'HARD' ? 'destructive' :
                      'warning'
                    }
                    className="text-xs"
                  >
                    {topic.difficulty.toLowerCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">
                      {topic.completedQuestions}/{topic.totalQuestions}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Accuracy</p>
                    <p className={`font-semibold ${
                      topic.accuracy >= 85 ? 'text-green-600' :
                      topic.accuracy >= 75 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {topic.accuracy}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Time</p>
                    <p className="font-semibold">{topic.averageTime}s</p>
                  </div>
                </div>

                {/* Recommendations */}
                {isWeak && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-700 font-medium">Needs Attention</p>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Focus on this topic to improve your overall score
                    </p>
                  </div>
                )}

                {isStrong && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-green-700 font-medium">Strong Performance</p>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Great job! Consider reviewing periodically
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    onClick={() => startPracticeSession(topic.id)}
                    disabled={isLoading}
                    className="flex-1"
                    variant="cfa"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Practice
                  </Button>
                  <Button
                    onClick={() => startPracticeSession(topic.id, 'HARD')}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                  >
                    Hard
                  </Button>
                </div>

                {/* Last Studied */}
                {topic.lastStudied && (
                  <p className="text-xs text-gray-500 text-center">
                    Last studied {Math.floor((Date.now() - topic.lastStudied.getTime()) / (24 * 60 * 60 * 1000))} days ago
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Weak Areas Focus</h3>
            <p className="text-sm text-gray-600 mb-4">
              Practice questions from your weakest topics
            </p>
            <Button 
              onClick={() => startPracticeSession('weak-areas')}
              disabled={isLoading}
              variant="cfa"
              size="sm"
            >
              Start Session
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg mb-4">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Review Mode</h3>
            <p className="text-sm text-gray-600 mb-4">
              Review previously answered questions
            </p>
            <Button 
              onClick={() => startPracticeSession('review')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              Review
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 rounded-lg mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Timed Practice</h3>
            <p className="text-sm text-gray-600 mb-4">
              Practice with exam time constraints
            </p>
            <Button 
              onClick={() => startPracticeSession('timed')}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              Start Timer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}