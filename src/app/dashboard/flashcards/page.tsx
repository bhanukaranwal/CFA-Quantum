'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  RotateCcw,
  Plus,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  Brain,
  Calculator,
  FileText,
  Shuffle,
  Settings
} from 'lucide-react'

interface Flashcard {
  id: string
  front: string
  back: string
  cardType: 'CONCEPT' | 'FORMULA' | 'DEFINITION' | 'CALCULATION'
  topicArea: string
  difficulty: 'EASY' | 'INTERMEDIATE' | 'HARD'
  nextReview: Date
  easeFactor: number
  interval: number
  repetitions: number
}

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState('all')

  // Mock flashcards data
  const flashcards: Flashcard[] = [
    {
      id: '1',
      front: 'What is the formula for calculating present value?',
      back: 'PV = FV / (1 + r)^n\n\nWhere:\nPV = Present Value\nFV = Future Value\nr = discount rate\nn = number of periods',
      cardType: 'FORMULA',
      topicArea: 'Quantitative Methods',
      difficulty: 'INTERMEDIATE',
      nextReview: new Date(),
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0
    },
    {
      id: '2',
      front: 'Define the Efficient Market Hypothesis (EMH)',
      back: 'The Efficient Market Hypothesis states that financial markets are "informationally efficient," meaning that asset prices reflect all available information. There are three forms:\n\n• Weak form: Prices reflect all past market data\n• Semi-strong form: Prices reflect all publicly available information\n• Strong form: Prices reflect all information, including insider information',
      cardType: 'DEFINITION',
      topicArea: 'Equity Investments',
      difficulty: 'INTERMEDIATE',
      nextReview: new Date(),
      easeFactor: 2.3,
      interval: 2,
      repetitions: 1
    }
  ]

  const currentCard = flashcards[currentCardIndex]
  const totalCards = flashcards.length

  const cardTypeStats = {
    CONCEPT: { count: 45, color: 'bg-blue-500' },
    FORMULA: { count: 32, color: 'bg-green-500' },
    DEFINITION: { count: 28, color: 'bg-purple-500' },
    CALCULATION: { count: 19, color: 'bg-orange-500' }
  }

  const handleAnswer = (quality: 'easy' | 'good' | 'hard' | 'again') => {
    // Spaced repetition logic would go here
    setShowAnswer(false)
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1)
    } else {
      setCurrentCardIndex(0)
    }
  }

  const getCardTypeIcon = (type: string) => {
    switch (type) {
      case 'CONCEPT': return Brain
      case 'FORMULA': return Calculator
      case 'DEFINITION': return BookOpen
      case 'CALCULATION': return FileText
      default: return BookOpen
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
          <p className="text-gray-600 mt-1">
            Master CFA concepts with spaced repetition learning
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Study Settings
          </Button>
          <Button variant="cfa">
            <Plus className="h-4 w-4 mr-2" />
            Create Card
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(cardTypeStats).map(([type, stats]) => {
          const Icon = getCardTypeIcon(type)
          return (
            <Card key={type} className="text-center">
              <CardContent className="p-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stats.color} text-white mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
                <div className="text-sm text-gray-600 capitalize">{type.toLowerCase()}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Flashcard */}
        <div className="lg:col-span-3">
          <Card className="min-h-[400px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {currentCardIndex + 1} of {totalCards}
                  </Badge>
                  <Badge variant="secondary">{currentCard?.topicArea}</Badge>
                  <Badge className={getDifficultyColor(currentCard?.difficulty || 'EASY')}>
                    {currentCard?.difficulty}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {showAnswer ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Answer
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Answer
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col justify-center p-8">
              <div className="text-center space-y-6">
                {/* Card Type Icon */}
                <div className="flex justify-center">
                  {(() => {
                    const Icon = getCardTypeIcon(currentCard?.cardType || 'CONCEPT')
                    return (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                    )
                  })()}
                </div>

                {/* Question/Front */}
                <div className="text-xl font-medium text-gray-900 leading-relaxed">
                  {currentCard?.front}
                </div>

                {/* Answer/Back */}
                {showAnswer && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-left whitespace-pre-line text-gray-800">
                      {currentCard?.back}
                    </div>
                  </div>
                )}

                {/* Answer Buttons */}
                {showAnswer && (
                  <div className="flex justify-center space-x-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => handleAnswer('again')}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Again
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAnswer('hard')}
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                    >
                      Hard
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAnswer('good')}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Good
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleAnswer('easy')}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      Easy
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
                    disabled={currentCardIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentCardIndex(Math.min(totalCards - 1, currentCardIndex + 1))}
                    disabled={currentCardIndex === totalCards - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Study Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Cards Reviewed</span>
                  <span className="font-semibold">15/25</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>New Cards</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time Studied</span>
                  <span className="font-semibold">45 min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="cfa">
                <BookOpen className="h-4 w-4 mr-2" />
                Study Due Cards
              </Button>
              <Button className="w-full" variant="outline">
                <Shuffle className="h-4 w-4 mr-2" />
                Random Review
              </Button>
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New Deck
              </Button>
            </CardContent>
          </Card>

          {/* Deck Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Study Decks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'All Cards', count: 124, due: 25 },
                  { name: 'Ethics', count: 45, due: 8 },
                  { name: 'Quantitative', count: 38, due: 12 },
                  { name: 'Economics', count: 41, due: 5 }
                ].map((deck, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDeck(deck.name.toLowerCase())}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedDeck === deck.name.toLowerCase()
                        ? 'border-cfa-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{deck.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{deck.count}</div>
                        <div className="text-xs text-red-600">{deck.due} due</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}