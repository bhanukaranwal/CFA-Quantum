import { z } from 'zod'

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  studyHoursPerWeek: z.number().min(1).max(80),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z.string(),
  token: z.string().min(1, 'Reset token is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
  email: z.string().email('Invalid email address').optional(),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']).optional(),
  experienceLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  studyHoursPerWeek: z.number().min(1).max(80).optional(),
  targetExamDate: z.date().optional(),
})

// Question validation schemas
export const questionSchema = z.object({
  questionText: z.string().min(10, 'Question text must be at least 10 characters'),
  questionType: z.enum(['MULTIPLE_CHOICE', 'ITEM_SET', 'CONSTRUCTED_RESPONSE']),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  topicArea: z.string().min(1, 'Topic area is required'),
  difficulty: z.enum(['EASY', 'INTERMEDIATE', 'HARD']),
  options: z.record(z.string()).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().min(10, 'Explanation must be at least 10 characters'),
  timeToComplete: z.number().min(30).max(600), // 30 seconds to 10 minutes
  tags: z.array(z.string()).optional(),
})

// Exam session validation schemas
export const examSessionSchema = z.object({
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  sessionType: z.enum(['PRACTICE', 'MOCK_EXAM', 'QUICK_QUIZ', 'CUSTOM']),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  timeLimit: z.number().min(300).max(21600), // 5 minutes to 6 hours
  questionCount: z.number().min(1).max(180),
})

// Battle validation schemas
export const battleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  battleType: z.enum(['ONE_VS_ONE', 'TOURNAMENT', 'QUICK_MATCH', 'CUSTOM']),
  questionCount: z.number().min(5).max(50),
  timeLimit: z.number().min(300).max(3600), // 5 minutes to 1 hour
  maxParticipants: z.number().min(2).max(100),
  entryFee: z.number().min(0).optional(),
})

// Forum validation schemas
export const forumPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
})

export const forumCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  postId: z.string().min(1, 'Post ID is required'),
  parentId: z.string().optional(),
})

// Flashcard validation schemas
export const flashcardDeckSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  topicArea: z.string().min(1, 'Topic area is required'),
  isPublic: z.boolean().optional(),
})

export const flashcardSchema = z.object({
  deckId: z.string().min(1, 'Deck ID is required'),
  front: z.string().min(1, 'Front text is required'),
  back: z.string().min(1, 'Back text is required'),
  cardType: z.enum(['CONCEPT', 'FORMULA', 'DEFINITION', 'CALCULATION']),
  difficulty: z.enum(['EASY', 'INTERMEDIATE', 'HARD']),
  order: z.number().min(0),
})

// Study plan validation schemas
export const studyPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  cfaLevel: z.enum(['LEVEL_1', 'LEVEL_2', 'LEVEL_3']),
  targetExamDate: z.date().min(new Date(), 'Target exam date must be in the future'),
  hoursPerWeek: z.number().min(1).max(80),
})

// API validation helpers
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: { field: string; message: string }[]
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      return { success: false, errors }
    }
    return { 
      success: false, 
      errors: [{ field: 'unknown', message: 'Validation failed' }] 
    }
  }
}

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type QuestionInput = z.infer<typeof questionSchema>
export type ExamSessionInput = z.infer<typeof examSessionSchema>
export type BattleInput = z.infer<typeof battleSchema>
export type ForumPostInput = z.infer<typeof forumPostSchema>
export type ForumCommentInput = z.infer<typeof forumCommentSchema>
export type FlashcardDeckInput = z.infer<typeof flashcardDeckSchema>
export type FlashcardInput = z.infer<typeof flashcardSchema>
export type StudyPlanInput = z.infer<typeof studyPlanSchema>