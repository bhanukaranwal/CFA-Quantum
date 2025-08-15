// User Types
export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  password?: string | null
  role: UserRole
  cfaLevel?: CFALevel | null
  targetExamDate?: Date | null
  experienceLevel: ExperienceLevel
  studyHoursPerWeek: number
  level: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  isActive: boolean
  lastLoginAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  USER = 'USER',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum CFALevel {
  LEVEL_1 = 'LEVEL_1',
  LEVEL_2 = 'LEVEL_2',
  LEVEL_3 = 'LEVEL_3'
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

// Question Types
export interface Question {
  id: string
  questionText: string
  questionType: QuestionType
  cfaLevel: CFALevel
  topicArea: string
  difficulty: Difficulty
  options: Record<string, string>
  correctAnswer: string
  explanation: string
  timeToComplete: number
  tags: string[]
  timesAttempted: number
  correctAttempts: number
  averageTimeSpent: number
  createdBy: string
  approvalStatus: ApprovalStatus
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  ITEM_SET = 'ITEM_SET',
  CONSTRUCTED_RESPONSE = 'CONSTRUCTED_RESPONSE'
}

export enum Difficulty {
  EASY = 'EASY',
  INTERMEDIATE = 'INTERMEDIATE',
  HARD = 'HARD'
}

export enum ApprovalStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Exam Session Types
export interface ExamSession {
  id: string
  userId: string
  cfaLevel: CFALevel
  sessionType: SessionType
  title: string
  description?: string | null
  timeLimit: number
  questionCount: number
  questionIds: string[]
  topics: string[]
  difficulty?: Difficulty | null
  status: SessionStatus
  score?: number | null
  accuracy?: number | null
  timeSpent: number
  startedAt?: Date | null
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export enum SessionType {
  PRACTICE = 'PRACTICE',
  MOCK_EXAM = 'MOCK_EXAM',
  QUICK_QUIZ = 'QUICK_QUIZ',
  CUSTOM = 'CUSTOM'
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED'
}

// Answer Types
export interface Answer {
  id: string
  sessionId: string
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  timeSpent: number
  createdAt: Date
}

// Battle Types
export interface QuizBattle {
  id: string
  title: string
  description?: string | null
  cfaLevel: CFALevel
  battleType: BattleType
  status: BattleStatus
  questionCount: number
  timeLimit: number
  questionIds: string[]
  topics: string[]
  difficulty: Difficulty
  maxParticipants: number
  entryFee: number
  prizeXP: number
  winnerId?: string | null
  startedAt?: Date | null
  endedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export enum BattleType {
  ONE_VS_ONE = 'ONE_VS_ONE',
  TOURNAMENT = 'TOURNAMENT',
  QUICK_MATCH = 'QUICK_MATCH',
  CUSTOM = 'CUSTOM'
}

export enum BattleStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface BattleParticipant {
  id: string
  battleId: string
  userId: string
  score: number
  correctAnswers: number
  timeSpent: number
  rank?: number | null
  isReady: boolean
  joinedAt: Date
}

// Forum Types
export interface ForumCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
  postCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ForumPost {
  id: string
  title: string
  content: string
  authorId: string
  categoryId: string
  isPinned: boolean
  isLocked: boolean
  views: number
  upvotes: number
  downvotes: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface PostComment {
  id: string
  postId: string
  authorId: string
  content: string
  parentId?: string | null
  upvotes: number
  downvotes: number
  createdAt: Date
  updatedAt: Date
}

// Achievement Types
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: AchievementCategory
  difficulty: AchievementDifficulty
  xpReward: number
  requirements: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum AchievementCategory {
  QUESTIONS_ANSWERED = 'QUESTIONS_ANSWERED',
  STUDY_TIME = 'STUDY_TIME',
  STREAK = 'STREAK',
  ACCURACY = 'ACCURACY',
  SPEED = 'SPEED',
  SOCIAL = 'SOCIAL',
  SPECIAL = 'SPECIAL'
}

export enum AchievementDifficulty {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
  DIAMOND = 'DIAMOND'
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: Date
}

// Study Plan Types
export interface StudyPlan {
  id: string
  userId: string
  title: string
  description?: string | null
  cfaLevel: CFALevel
  targetExamDate: Date
  totalWeeks: number
  hoursPerWeek: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface StudyPlanWeek {
  id: string
  studyPlanId: string
  weekNumber: number
  title: string
  description?: string | null
  topics: string[]
  targetHours: number
  completedHours: number
  isCompleted: boolean
  createdAt: Date
  updatedAt: Date
}

// Flashcard Types
export interface FlashcardDeck {
  id: string
  userId: string
  title: string
  description?: string | null
  cfaLevel: CFALevel
  topicArea: string
  cardCount: number
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Flashcard {
  id: string
  deckId: string
  front: string
  back: string
  cardType: FlashcardType
  difficulty: Difficulty
  nextReview: Date
  easeFactor: number
  interval: number
  repetitions: number
  createdAt: Date
  updatedAt: Date
}

export enum FlashcardType {
  CONCEPT = 'CONCEPT',
  FORMULA = 'FORMULA',
  DEFINITION = 'DEFINITION',
  CALCULATION = 'CALCULATION'
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasMore: boolean
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: PaginationMeta
}

// UI Types
export interface NavigationItem {
  name: string
  href: string
  icon: any
  current?: boolean
  badge?: string
}

export interface DashboardStats {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  studyTime: number
  currentStreak: number
  level: number
  totalXP: number
  rank: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  cfaLevel?: CFALevel
  targetExamDate?: string
  experienceLevel?: ExperienceLevel
  studyHoursPerWeek?: number
}

export interface ForgotPasswordForm {
  email: string
}

export interface ResetPasswordForm {
  password: string
  confirmPassword: string
  token: string
}

// Analytics Types
export interface AnalyticsData {
  overview: {
    totalQuestions: number
    correctAnswers: number
    accuracy: number
    totalTimeSpent: number
    averageSessionLength: number
    sessionsCompleted: number
    examReadiness: number
  }
  topicAnalysis: TopicAnalysis[]
  performanceTrend: PerformanceDataPoint[]
  studyTimeDistribution: StudyTimeDataPoint[]
  weakAreas: WeakArea[]
  insights: Insight[]
  goals: WeeklyGoal[]
}

export interface TopicAnalysis {
  topic: string
  accuracy: number
  questionsAttempted: number
  averageTime: number
  improvement: number
}

export interface PerformanceDataPoint {
  date: string
  accuracy: number
  questionsAnswered: number
  studyTime: number
}

export interface StudyTimeDataPoint {
  hour: string
  questions: number
  accuracy: number
}

export interface WeakArea {
  topicArea: string
  accuracy: number
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  recommendation: string
}

export interface Insight {
  type: 'strength' | 'weakness' | 'pattern' | 'goal'
  title: string
  description: string
  action: string
  icon: string
  color: string
}

export interface WeeklyGoal {
  goal: string
  current: number
  target: number
  progress: number
}