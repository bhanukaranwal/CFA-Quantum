'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Clock, 
  Play, 
  Calendar, 
  BarChart3,
  Trophy,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Target,
  Timer,
  FileText,
  Download,
  Users,
  Star
} from 'lucide-react'
import Link from 'next/link'

interface MockExam {
  id: string
  title: string
  description: string
  cfaLevel: 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3'
  duration: number // minutes
  questionCount: number
  topics: string[]
  difficulty: 'MIXED' | 'EASY' | 'INTERMEDIATE' | 'HARD'
  type: 'FULL_EXAM' | 'MORNING_SESSION' | 'AFTERNOON_SESSION' | 'CUSTOM'
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  lastAttempt?: {
    date: Date
    score: number
    timeSpent: number
    accuracy: number
  }
  averageScore?: number
  attempts: number
  isPopular?: boolean
  isNew?: boolean
}

export default function MockExamPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('LEVEL_1')
  const [selectedType, setSelectedType] = useState<string>('ALL')

  const mockExams: MockExam[] = [
    {
      id: 'level1-full-1',
      title: 'CFA Level 1 - Complete Mock Exam #1',
      description: 'Full-length exam covering all Level 1 topics with realistic timing and difficulty',
      cfaLevel: 'LEVEL_1',
      duration: 270, // 4.5 hours
      questionCount: 180,
      topics: ['Ethics', 'Quantitative', 'Economics', 'FSA', 'Corporate', 'Equity', 'Fixed Income', 'Derivatives', 'Alternative', 'Portfolio'],
      difficulty: 'MIXED',
      type: 'FULL_EXAM',
      status: 'COMPLETED',
      lastAttempt: {
        date: new Date('2024-01-10'),
        score: 82,
        timeSpent: 245,
        accuracy: 78
      },
      averageScore: 75,
      attempts: 2,
      isPopular: true
    },
    {
      id: 'level1-morning-1',
      title: 'Level 1 Morning Session Practice',
      description: 'Morning session simulation with 90 questions in 2.25 hours',
      cfaLevel: 'LEVEL_1',
      duration: 135,
      questionCount: 90,
      topics: ['Ethics', 'Quantitative', 'Economics', 'FSA', 'Corporate'],
      difficulty: 'MIXED',
      type: 'MORNING_SESSION',
      status: 'IN_PROGRESS',
      lastAttempt: {
        date: new Date('2024-01-12'),
        score: 0,
        timeSpent: 45,
        accuracy: 0
      },
      averageScore: 72,
      attempts: 1
    },
    {
      id: 'level1-afternoon-1',
      title: 'Level 1 Afternoon Session Practice',
      description: 'Afternoon session with portfolio management and investments focus',
      cfaLevel: 'LEVEL_1',
      duration: 135,
      questionCount: 90,
      topics: ['Equity', 'Fixed Income', 'Derivatives', 'Alternative', 'Portfolio'],
      difficulty: 'MIXED',
      type: 'AFTERNOON_SESSION',
      status: 'NOT_STARTED',
      averageScore: 68,
      attempts: 0,
      isNew: true
    },
    {
      id: 'level1-ethics-focus',
      title: 'Ethics & Professional Standards Deep Dive',
      description: 'Concentrated practice on ethics with challenging scenarios',
      cfaLevel: 'LEVEL_1',
      duration: 90,
      questionCount: 60,
      topics: ['Ethics'],
      difficulty: 'HARD',
      type: 'CUSTOM',
      status: 'COMPLETED',
      lastAttempt: {
        date: new Date('2024-01-08'),
        score: 88,
        timeSpent: 75,
        accuracy: 85
      },
      averageScore: 82,
      attempts: 3
    },
    {
      id: 'level1-quant-practice',
      title: 'Quantitative Methods Intensive',
      description: 'Advanced quantitative problems with calculation focus',
      cfaLevel: 'LEVEL_1',
      duration: 120,
      questionCount: 80,
      topics: ['Quantitative'],
      difficulty: 'HARD',
      type: 'CUSTOM',
      status: 'NOT_STARTED',
      averageScore: 65,
      attempts: 0,
      isPopular: true
    }
  ]

  const filteredExams = mockExams.filter(exam => {
    const levelMatch = selectedLevel === 'ALL' || exam.cfaLevel === selectedLevel
    const typeMatch = selectedType === 'ALL' || exam.type === selectedType
    return levelMatch && typeMatch
  })

  const userStats = {
    totalExams: 15,
    averageScore: 76,
    bestScore: 92,
    totalStudyTime: 45, // hours
    examReadiness: 78,
    weeklyTarget: 3,
    completedThisWeek: 2
  }

  const upcomingExams = [
    { name: 'CFA Level 1', date: '2024-05-18', daysLeft: 124 },
    { name: 'CFA Level 1 (Backup)', date: '2024-08-20', daysLeft: 218 }
  ]

  const startExam = (examId: string) => {
    // Navigate to exam interface
    window.location.href = `/exam/${examId}`
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'COMPLETED': return 'success'
      case 'IN_PROGRESS': return 'warning'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'COMPLETED': return CheckCircle2
      case 'IN_PROGRESS': return Timer
      default: return Play
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mock Exams</h1>
          <p className="text-gray-600 mt-1">
            Practice with realistic CFA exam simulations
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button asChild variant="outline">
            <Link href="/dashboard/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Results
            </Link>
          </Button>
          <Button asChild variant="cfa">
            <Link href="/dashboard/practice">
              <BookOpen className="h-4 w-4 mr-2" />
              Quick Practice
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exam Readiness</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.examReadiness}%</p>
                <p className="text-xs text-green-600">Ready to pass!</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={userStats.examReadiness} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.averageScore}%</p>
                <p className="text-xs text-blue-600">Best: {userStats.bestScore}%</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exams Taken</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.totalExams}</p>
                <p className="text-xs text-purple-600">{userStats.totalStudyTime}h study time</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Progress</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.completedThisWeek}/{userStats.weeklyTarget}</p>
                <p className="text-xs text-orange-600">This week's goal</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <Progress value={(userStats.completedThisWeek / userStats.weeklyTarget) * 100} className="mt-3 h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
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
                    Exam Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="FULL_EXAM">Full Exam</SelectItem>
                      <SelectItem value="MORNING_SESSION">Morning Session</SelectItem>
                      <SelectItem value="AFTERNOON_SESSION">Afternoon Session</SelectItem>
                      <SelectItem value="CUSTOM">Custom Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mock Exams List */}
          <div className="space-y-4">
            {filteredExams.map((exam) => {
              const StatusIcon = getStatusIcon(exam.status)
              const progress = exam.lastAttempt?.timeSpent && exam.status === 'IN_PROGRESS' 
                ? (exam.lastAttempt.timeSpent / exam.duration) * 100 
                : 0

              return (
                <Card key={exam.id} className="hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                          {exam.isNew && <Badge variant="cfa" className="text-xs">NEW</Badge>}
                          {exam.isPopular && <Badge variant="warning" className="text-xs">POPULAR</Badge>}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{exam.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="outline" className="text-xs">
                            {exam.cfaLevel.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exam.questionCount} questions
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(exam.duration / 60)}h {exam.duration % 60}m
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exam.difficulty}
                          </Badge>
                        </div>

                        {exam.status === 'IN_PROGRESS' && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm text-gray-600">
                                {exam.lastAttempt?.timeSpent}m / {exam.duration}m
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}

                        {exam.lastAttempt && exam.status === 'COMPLETED' && (
                          <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Last Score</p>
                              <p className="font-semibold text-lg">{exam.lastAttempt.score}%</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Time Used</p>
                              <p className="font-semibold text-lg">{exam.lastAttempt.timeSpent}m</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Accuracy</p>
                              <p className="font-semibold text-lg">{exam.lastAttempt.accuracy}%</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span>Avg Score: {exam.averageScore}%</span>
                          <span>Attempts: {exam.attempts}</span>
                          {exam.lastAttempt && (
                            <span>Last: {exam.lastAttempt.date.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-6">
                        <Badge variant={getStatusColor(exam.status)} className="flex items-center">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {exam.status === 'NOT_STARTED' ? 'Start' : 
                           exam.status === 'IN_PROGRESS' ? 'Continue' : 'Completed'}
                        </Badge>
                        
                        <div className="flex space-x-2">
                          {exam.status === 'COMPLETED' && (
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Results
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => startExam(exam.id)}
                            size="sm"
                            variant={exam.status === 'NOT_STARTED' ? 'cfa' : 'outline'}
                          >
                            {exam.status === 'IN_PROGRESS' ? (
                              <>
                                <Timer className="h-4 w-4 mr-1" />
                                Continue
                              </>
                            ) : exam.status === 'COMPLETED' ? (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Retake
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Exams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-900">{exam.name}</p>
                    <p className="text-sm text-blue-700">{exam.date}</p>
                    <p className="text-xs text-blue-600">{exam.daysLeft} days left</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-green-900">Strong Performance</p>
                  </div>
                  <p className="text-xs text-green-700">
                    Your ethics scores are excellent. Keep practicing to maintain this level.
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-900">Needs Attention</p>
                  </div>
                  <p className="text-xs text-yellow-700">
                    Focus more on quantitative methods. Take the intensive practice exam.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-900">Time Management</p>
                  </div>
                  <p className="text-xs text-blue-700">
                    Practice more timed sessions to improve your pace.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BarChart3 className="h-5 w-5 mr-2" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-semibold">{userStats.completedThisWeek} exams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold">8 exams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Time</span>
                  <span className="font-semibold">3.2h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Improvement</span>
                  <span className="font-semibold text-green-600">+12%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Your Rank</span>
                  <span className="font-semibold">#47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Percentile</span>
                  <span className="font-semibold">85th</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Study Buddies</span>
                  <span className="font-semibold">3 active</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Users className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}