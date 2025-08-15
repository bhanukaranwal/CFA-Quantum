'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Clock, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Trophy,
  Users,
  BookOpen
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30')
  const [selectedLevel, setSelectedLevel] = useState('LEVEL_1')

  // Mock data
  const performanceData = [
    { date: '2024-01-01', accuracy: 65, questionsAnswered: 15, studyTime: 2.5 },
    { date: '2024-01-02', accuracy: 68, questionsAnswered: 20, studyTime: 3.0 },
    { date: '2024-01-03', accuracy: 72, questionsAnswered: 18, studyTime: 2.8 },
    { date: '2024-01-04', accuracy: 75, questionsAnswered: 25, studyTime: 3.5 },
    { date: '2024-01-05', accuracy: 78, questionsAnswered: 22, studyTime: 3.2 },
    { date: '2024-01-06', accuracy: 82, questionsAnswered: 28, studyTime: 4.0 },
    { date: '2024-01-07', accuracy: 85, questionsAnswered: 30, studyTime: 4.2 }
  ]

  const topicData = [
    { topic: 'Ethics', accuracy: 88, attempted: 85, total: 120, color: '#8b5cf6' },
    { topic: 'Quantitative', accuracy: 82, attempted: 72, total: 96, color: '#06b6d4' },
    { topic: 'Economics', accuracy: 75, attempted: 45, total: 80, color: '#84cc16' },
    { topic: 'FSA', accuracy: 79, attempted: 120, total: 160, color: '#f59e0b' },
    { topic: 'Corporate', accuracy: 71, attempted: 32, total: 64, color: '#ef4444' },
    { topic: 'Equity', accuracy: 84, attempted: 65, total: 88, color: '#ec4899' }
  ]

  const timeData = [
    { hour: '6-8 AM', questions: 25, accuracy: 85 },
    { hour: '8-10 AM', questions: 45, accuracy: 82 },
    { hour: '10-12 PM', questions: 38, accuracy: 78 },
    { hour: '12-2 PM', questions: 22, accuracy: 75 },
    { hour: '2-4 PM', questions: 35, accuracy: 80 },
    { hour: '4-6 PM', questions: 42, accuracy: 83 },
    { hour: '6-8 PM', questions: 55, accuracy: 87 },
    { hour: '8-10 PM', questions: 48, accuracy: 84 }
  ]

  const difficultyData = [
    { name: 'Easy', value: 35, accuracy: 92, color: '#10b981' },
    { name: 'Intermediate', value: 45, accuracy: 78, color: '#f59e0b' },
    { name: 'Hard', value: 20, accuracy: 65, color: '#ef4444' }
  ]

  const radarData = [
    { subject: 'Ethics', A: 88, fullMark: 100 },
    { subject: 'Quantitative', A: 82, fullMark: 100 },
    { subject: 'Economics', A: 75, fullMark: 100 },
    { subject: 'FSA', A: 79, fullMark: 100 },
    { subject: 'Corporate', A: 71, fullMark: 100 },
    { subject: 'Equity', A: 84, fullMark: 100 }
  ]

  const overallStats = {
    totalQuestions: 495,
    totalStudyTime: 125, // hours
    averageAccuracy: 78,
    currentStreak: 7,
    longestStreak: 12,
    level: 12,
    xp: 2450,
    rank: 47,
    percentile: 85,
    examReadiness: 72
  }

  const insights = [
    {
      type: 'strength',
      title: 'Strong in Ethics',
      description: 'Your ethics accuracy (88%) is well above average. Keep practicing to maintain this strength.',
      action: 'Review periodically',
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      type: 'weakness',
      title: 'Economics Needs Work',
      description: 'Your economics accuracy (75%) is below your target. Focus more time on this topic.',
      action: 'Increase practice time',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      type: 'pattern',
      title: 'Morning Peak Performance',
      description: 'You perform best between 6-8 PM (87% accuracy). Schedule important practice then.',
      action: 'Optimize study schedule',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      type: 'goal',
      title: 'On Track for Level Up',
      description: 'You need 550 more XP to reach Level 13. Keep your current pace!',
      action: 'Continue current routine',
      icon: Trophy,
      color: 'text-purple-600'
    }
  ]

  const weeklyGoals = [
    { goal: 'Answer 200 questions', current: 165, target: 200, progress: 82.5 },
    { goal: 'Study 15 hours', current: 12, target: 15, progress: 80 },
    { goal: 'Achieve 80% accuracy', current: 78, target: 80, progress: 97.5 },
    { goal: 'Complete 3 mock exams', current: 2, target: 3, progress: 66.7 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and identify areas for improvement
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exam Readiness</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.examReadiness}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8% this month
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Progress value={overallStats.examReadiness} className="mt-3 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Global Rank</p>
                <p className="text-2xl font-bold text-gray-900">#{overallStats.rank}</p>
                <p className="text-xs text-blue-600">
                  {overallStats.percentile}th percentile
                </p>
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
                <p className="text-sm font-medium text-gray-600">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center">
                  {overallStats.currentStreak}
                  <span className="text-base ml-1">🔥</span>
                </p>
                <p className="text-xs text-orange-600">
                  Best: {overallStats.longestStreak} days
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Study Time</p>
                <p className="text-2xl font-bold text-gray-900">{overallStats.totalStudyTime}h</p>
                <p className="text-xs text-purple-600">
                  {overallStats.totalQuestions} questions
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Trend
              </CardTitle>
              <CardDescription>Your accuracy and study time over the past {timeRange} days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [
                        name === 'accuracy' ? `${value}%` : 
                        name === 'studyTime' ? `${value}h` : value,
                        name === 'accuracy' ? 'Accuracy' :
                        name === 'studyTime' ? 'Study Time' : 'Questions'
                      ]}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={2} name="accuracy" />
                    <Line yAxisId="right" type="monotone" dataKey="studyTime" stroke="#06b6d4" strokeWidth={2} name="studyTime" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Weekly Goals
            </CardTitle>
            <CardDescription>Track your progress toward weekly objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{goal.goal