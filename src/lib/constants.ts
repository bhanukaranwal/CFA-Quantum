// CFA Levels
export const CFA_LEVELS = {
  LEVEL_1: 'Level 1',
  LEVEL_2: 'Level 2',
  LEVEL_3: 'Level 3',
} as const

// Experience Levels
export const EXPERIENCE_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const

// User Roles
export const USER_ROLES = {
  USER: 'User',
  INSTRUCTOR: 'Instructor',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
} as const

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'Multiple Choice',
  ITEM_SET: 'Item Set',
  CONSTRUCTED_RESPONSE: 'Constructed Response',
} as const

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: 'Easy',
  INTERMEDIATE: 'Intermediate',
  HARD: 'Hard',
} as const

// Session Types
export const SESSION_TYPES = {
  PRACTICE: 'Practice',
  MOCK_EXAM: 'Mock Exam',
  QUICK_QUIZ: 'Quick Quiz',
  CUSTOM: 'Custom',
} as const

// Battle Types
export const BATTLE_TYPES = {
  ONE_VS_ONE: '1 vs 1',
  TOURNAMENT: 'Tournament',
  QUICK_MATCH: 'Quick Match',
  CUSTOM: 'Custom',
} as const

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
  QUESTIONS_ANSWERED: 'Questions Answered',
  STUDY_TIME: 'Study Time',
  STREAK: 'Streak',
  ACCURACY: 'Accuracy',
  SPEED: 'Speed',
  SOCIAL: 'Social',
  SPECIAL: 'Special',
} as const

// Achievement Difficulties
export const ACHIEVEMENT_DIFFICULTIES = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  PLATINUM: 'Platinum',
  DIAMOND: 'Diamond',
} as const

// Flashcard Types
export const FLASHCARD_TYPES = {
  CONCEPT: 'Concept',
  FORMULA: 'Formula',
  DEFINITION: 'Definition',
  CALCULATION: 'Calculation',
} as const

// CFA Topic Areas
export const CFA_TOPIC_AREAS = {
  LEVEL_1: [
    'Ethics and Professional Standards',
    'Quantitative Methods',
    'Economics',
    'Financial Statement Analysis',
    'Corporate Issuers',
    'Equity Investments',
    'Fixed Income',
    'Derivatives',
    'Alternative Investments',
    'Portfolio Management',
  ],
  LEVEL_2: [
    'Ethics and Professional Standards',
    'Quantitative Methods',
    'Economics',
    'Financial Statement Analysis',
    'Corporate Issuers',
    'Equity Investments',
    'Fixed Income',
    'Derivatives',
    'Alternative Investments',
    'Portfolio Management',
  ],
  LEVEL_3: [
    'Ethics and Professional Standards',
    'Behavioral Finance',
    'Private Wealth Management',
    'Institutional Portfolio Management',
    'Capital Market Expectations',
    'Asset Allocation',
    'Fixed Income Portfolio Management',
    'Equity Portfolio Management',
    'Alternative Investments Portfolio Management',
    'Risk Management',
    'Derivatives and Currency Management',
    'Performance Evaluation',
    'GIPS',
  ],
} as const

// XP and Level Constants
export const XP_CONSTANTS = {
  QUESTION_CORRECT: 10,
  QUESTION_INCORRECT: 2,
  EXAM_COMPLETION: 50,
  BATTLE_WIN: 100,
  BATTLE_PARTICIPATION: 25,
  FORUM_POST: 15,
  FORUM_COMMENT: 5,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 10,
} as const

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7250, 9250,
  11500, 14000, 16750, 19750, 23000, 26500, 30250, 34250, 38500,
  43000, 47750, 52750, 58000, 63500, 69250, 75250, 81500, 88000,
  94750, 101750, 109000, 116500, 124250, 132250, 140500, 149000,
  157750, 166750, 176000, 185500, 195250, 205250, 215500, 226000,
  236750, 247750, 259000, 270500, 282250, 294250, 306500, 319000,
  331750, 344750, 358000, 371500, 385250, 399250, 413500, 428000,
  442750, 457750, 473000, 488500, 504250, 520250, 536500, 553000,
  569750, 586750, 604000, 621500, 639250, 657250, 675500, 694000,
  712750, 731750, 751000, 770500, 790250, 810250, 830500, 851000,
  871750, 892750, 914000, 935500, 957250, 979250, 1001500, 1024000,
  1046750, 1069750, 1093000, 1116500, 1140250, 1164250, 1188500, 1213000,
] as const

// Time Constants (in seconds)
export const TIME_CONSTANTS = {
  QUESTION_DEFAULT: 90,
  QUESTION_MIN: 30,
  QUESTION_MAX: 600,
  EXAM_MIN: 300, // 5 minutes
  EXAM_MAX: 21600, // 6 hours
  BATTLE_MIN: 60, // 1 minute
  BATTLE_MAX: 3600, // 1 hour
} as const

// Pagination Constants
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1,
} as const

// API Rate Limits
export const RATE_LIMITS = {
  DEFAULT: 100, // requests per minute
  AUTH: 10, // auth requests per minute
  UPLOAD: 5, // upload requests per minute
} as const

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  AVATAR_SIZE: 200, // pixels
} as const

// Exam Configuration
export const EXAM_CONFIG = {
  LEVEL_1: {
    TOTAL_QUESTIONS: 180,
    SESSION_1_QUESTIONS: 90,
    SESSION_2_QUESTIONS: 90,
    TIME_PER_SESSION: 135, // minutes
    PASSING_SCORE: 70, // percentage
  },
  LEVEL_2: {
    TOTAL_QUESTIONS: 88,
    ITEM_SETS: 22,
    QUESTIONS_PER_ITEM_SET: 4,
    SESSION_1_QUESTIONS: 44,
    SESSION_2_QUESTIONS: 44,
    TIME_PER_SESSION: 135, // minutes
    PASSING_SCORE: 70, // percentage
  },
  LEVEL_3: {
    TOTAL_QUESTIONS: 44,
    ITEM_SETS: 11,
    QUESTIONS_PER_ITEM_SET: 4,
    SESSION_1_QUESTIONS: 22,
    SESSION_2_QUESTIONS: 22,
    TIME_PER_SESSION: 135, // minutes
    PASSING_SCORE: 70, // percentage
  },
} as const

// Battle Configuration
export const BATTLE_CONFIG = {
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 8,
  DEFAULT_QUESTIONS: 10,
  DEFAULT_TIME_LIMIT: 300, // 5 minutes
  QUICK_MATCH_TIME: 60, // 1 minute
} as const

// Forum Configuration
export const FORUM_CONFIG = {
  MAX_POST_LENGTH: 10000,
  MAX_COMMENT_LENGTH: 1000,
  MAX_TITLE_LENGTH: 200,
  MIN_POST_LENGTH: 20,
  MIN_COMMENT_LENGTH: 5,
  MAX_TAGS: 10,
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  BATTLE_INVITE: 'battle_invite',
  BATTLE_START: 'battle_start',
  BATTLE_END: 'battle_end',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  FORUM_REPLY: 'forum_reply',
  STUDY_REMINDER: 'study_reminder',
  EXAM_REMINDER: 'exam_reminder',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'You must be logged in to perform this action',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later',
  RATE_LIMIT: 'Too many requests. Please wait before trying again',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  WEAK_PASSWORD: 'Password must be at least 8 characters long',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  EMAIL_SENT: 'Email sent successfully',
  ACCOUNT_CREATED: 'Account created successfully',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  QUESTION_CREATED: 'Question created successfully',
  EXAM_COMPLETED: 'Exam completed successfully',
  BATTLE_JOINED: 'Successfully joined battle',
  POST_CREATED: 'Post created successfully',
} as const

// Theme Colors
export const THEME_COLORS = {
  CFA_BLUE: '#0052cc',
  CFA_GOLD: '#f4b942',
  CFA_NAVY: '#003366',
  CFA_LIGHT_BLUE: '#e6f3ff',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const

export default {
  CFA_LEVELS,
  EXPERIENCE_LEVELS,
  USER_ROLES,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  SESSION_TYPES,
  BATTLE_TYPES,
  ACHIEVEMENT_CATEGORIES,
  ACHIEVEMENT_DIFFICULTIES,
  FLASHCARD_TYPES,
  CFA_TOPIC_AREAS,
  XP_CONSTANTS,
  LEVEL_THRESHOLDS,
  TIME_CONSTANTS,
  PAGINATION,
  RATE_LIMITS,
  FILE_UPLOAD,
  EXAM_CONFIG,
  BATTLE_CONFIG,
  FORUM_CONFIG,
  NOTIFICATION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  THEME_COLORS,
}