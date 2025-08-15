'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  Target,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Plus,
  Settings,
  TrendingUp,
  Award
} from 'lucide-react'

export default function StudyPlanPage() {
  const [selectedWeek, setSelectedWeek] = useState(1)

  // Mock study plan data
  const studyPlan = {
    title: 'CFA Level 1 - 16 Week Intensive Plan',
    targetExamDate: '2024-05-18',
    currentWeek: 8,
    totalWeeks: 16,
    completionRate: 62,
    hoursPerWeek: 15,
    totalHours: 240,
    completedHours: 148,
    topics: [
      { name: 'Ethics', progress: 85, hoursAllocated: 24, hoursCompleted: 22 },
      { name: 'Quantitative Methods', progress: 70, hoursAllocated: 30, hoursCompleted: 21 },
      { name: 'Economics', progress: 45, hoursAllocated: 32, hoursCompleted: 14 },
      { name: 'FSA', progress: 60, hoursAllocated: 48, hoursCompleted: 29 },
      { name: 'Corporate Issuers', progress: 30, hoursAllocated: 16, hoursCompleted: 5 },
      { name: 'Equity Investments', progress: 75, hoursAllocated: 24, hoursCompleted: 18 }
    ]
  }

  const weeklySchedule = {
    week8: {
      title: 'Week 8: Financial Statement Analysis Focus',
      tasks: [
        {
          id: 1,
          title: 'Read Chapter 15: Income Statements',
          type: 'reading',
          estimatedTime: '2 hours',
          completed: true,
          dueDate: 'Monday'
        },
        {
          id: 2,
          title: 'Practice Questions: Income Statement Analysis',
          type: 'practice',
          estimatedTime: '1.5 hours',
          completed: true,
          dueDate: 'Tuesday'
        },
        {
          id: 3,
          title: 'Watch Video: Cash Flow Statements',
          type: 'video',
          estimatedTime: '45 minutes',
          completed: false,
          dueDate: 'Wednesday'
        },
        {
          id: 4,
          title: 'Complete Mock Test: FSA Section',
          type: 'exam',
          estimatedTime: '2 hours',
          completed: false,
          dueDate: 'Thursday'
        },
        {
          id: 5,
          title: 'Review Weak Areas from Mock Test',
          type: 'review',
          estimatedTime: '1 hour',
          completed: false,
          dueDate: 'Friday'
        }
      ]
    }
  }

  const currentWeekTasks = weeklySchedule.week8.tasks
  const completedTasks = currentWeekTasks.filter(task => task.completed).length
  const weekProgress = (completedTasks / currentWeekTasks.length) * 100

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'reading': return BookOpen
      case 'practice': return Target
      case 'video': return Play
      case 'exam': return Clock
      case 'review': return TrendingUp
      default: return BookOpen
    }
  }

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'reading': return 'bg-blue-100 text-blue-600'
      case 'practice': return 'bg-green-100 text-green-600'
      case 'video': return 'bg-purple-100 text-purple-600'
      case 'exam': return 'bg-red-100 text-red-600'
      case 'review': return 'bg-yellow-100 text-yellow-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const daysUntilExam = Math.ceil((new Date(studyPlan.targetExamDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Plan</h1>
          <p className="text-gray-600 mt-1">
            Stay on track with your personalized CFA preparation schedule
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Customize Plan
          </Button>
          <Button variant="cfa">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Days Until Exam</p>
                <p className="text-3xl font-bold text-blue-900">{daysUntilExam}</p>
                <p className="text-sm text-blue-700">{studyPlan.targetExamDate}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Overall Progress</p>
                <p className="text-3xl font-bold text-green-900">{studyPlan.completionRate}%</p>
                <p className="text-sm text-green-700">Week {studyPlan.currentWeek} of {studyPlan.totalWeeks}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-600" />
            </div>
            <Progress value={studyPlan.completionRate} className="mt-3 h-2" indicatorClassName="bg-green-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Study Hours</p>
                <p className="text-3xl font-bold text-purple-900">{studyPlan.completedHours}</p>
                <p className="text-sm text-purple-700">of {studyPlan.totalHours} total</p>
              </div>
              <Clock className="h-12 w-12 text-purple-600" />
            </div>
            <Progress value={(studyPlan.completedHours / studyPlan.totalHours) * 100} className="mt-3 h-2" indicatorClassName="bg-purple-500" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">This Week</p>
                <p className="text-3xl font-bold text-orange-900">{Math.round(weekProgress)}%</p>
                <p className="text-sm text-orange-700">{completedTasks} of {currentWeekTasks.length} tasks</p>
              </div>
              <Award className="h-12 w-12 text-orange-600" />
            </div>
            <Progress value={weekProgress} className="mt-3 h-2" indicatorClassName="bg-orange-500" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Week Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Week Tasks</CardTitle>
                  <CardDescription>{weeklySchedule.week8.title}</CardDescription>
                </div>
                <Badge variant="outline">Week {studyPlan.currentWeek}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentWeekTasks.map((task) => {
                  const TaskIcon = getTaskIcon(task.type)
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        task.completed 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getTaskColor(task.type)}`}>
                          <TaskIcon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {task.title}
                            </h4>
                            {task.completed && (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {task.estimatedTime}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due {task.dueDate}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {task.type}
                            </Badge>
                          </div>
                        </div>
                        
                        {!task.completed && (
                          <Button size="sm" variant="outline">
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Progress */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Topic Progress</CardTitle>
              <CardDescription>Your progress across all CFA topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studyPlan.topics.map((topic, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{topic.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{topic.progress}%</div>
                        <div className="text-xs text-gray-500">
                          {topic.hoursCompleted}h / {topic.hoursAllocated}h
                        </div>
                      </div>
                    </div>
                    <Progress 
                      value={topic.progress} 
                      className="h-2"
                      indicatorClassName={
                        topic.progress >= 80 ? 'bg-green-500' :
                        topic.progress >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="cfa">
                <BookOpen className="h-4 w-4 mr-2" />
                Continue Reading
              </Button>
              <Button className="w-full" variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Practice Weak Areas
              </Button>
              <Button className="w-full" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Take Mock Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}