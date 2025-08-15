import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@cfaquantum.com' },
    update: {},
    create: {
      email: 'admin@cfaquantum.com',
      name: 'CFA Quantum Admin',
      password: hashedPassword,
      role: 'ADMIN',
      cfaLevel: 'LEVEL_3',
      experienceLevel: 'ADVANCED',
      studyHoursPerWeek: 40,
      level: 50,
      totalXP: 50000,
      currentStreak: 100,
      longestStreak: 150,
      isActive: true,
    },
  })

  const testUser = await prisma.user.upsert({
    where: { email: 'test@cfaquantum.com' },
    update: {},
    create: {
      email: 'test@cfaquantum.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'USER',
      cfaLevel: 'LEVEL_1',
      experienceLevel: 'BEGINNER',
      studyHoursPerWeek: 15,
      level: 5,
      totalXP: 1250,
      currentStreak: 7,
      longestStreak: 12,
      isActive: true,
    },
  })

  // Create forum categories
  const categories = [
    {
      name: 'General Discussion',
      description: 'General CFA discussion and questions',
      color: '#0052cc',
      icon: '💬',
    },
    {
      name: 'Level I',
      description: 'CFA Level I specific discussions',
      color: '#16a34a',
      icon: '📚',
    },
    {
      name: 'Level II',
      description: 'CFA Level II specific discussions',
      color: '#ea580c',
      icon: '📖',
    },
    {
      name: 'Level III',
      description: 'CFA Level III specific discussions',
      color: '#dc2626',
      icon: '🎓',
    },
    {
      name: 'Study Groups',
      description: 'Find and create study groups',
      color: '#7c3aed',
      icon: '👥',
    },
    {
      name: 'Resources',
      description: 'Share and discover study resources',
      color: '#0891b2',
      icon: '📁',
    },
  ]

  for (const category of categories) {
    await prisma.forumCategory.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Create sample questions
  const sampleQuestions = [
    {
      questionText: "What is the primary objective of financial statement analysis?",
      questionType: 'MULTIPLE_CHOICE' as const,
      cfaLevel: 'LEVEL_1' as const,
      topicArea: 'Financial Statement Analysis',
      difficulty: 'EASY' as const,
      options: {
        A: "To determine the fair value of securities",
        B: "To evaluate the performance and financial position of a company",
        C: "To calculate tax obligations",
        D: "To prepare budget forecasts"
      },
      correctAnswer: "B",
      explanation: "Financial statement analysis aims to evaluate a company's performance, financial position, and cash flows to make informed economic decisions.",
      timeToComplete: 90,
      tags: ["financial statements", "analysis", "fundamentals"],
    },
    {
      questionText: "According to the CAPM model, what factors determine the expected return of a security?",
      questionType: 'MULTIPLE_CHOICE' as const,
      cfaLevel: 'LEVEL_1' as const,
      topicArea: 'Portfolio Management',
      difficulty: 'INTERMEDIATE' as const,
      options: {
        A: "Risk-free rate and market risk premium",
        B: "Risk-free rate, beta, and market risk premium",
        C: "Alpha and beta coefficients",
        D: "Standard deviation and correlation"
      },
      correctAnswer: "B",
      explanation: "The CAPM model states that Expected Return = Risk-free rate + Beta × (Market return - Risk-free rate), incorporating the risk-free rate, beta, and market risk premium.",
      timeToComplete: 120,
      tags: ["CAPM", "portfolio theory", "risk", "return"],
    },
    {
      questionText: "What is the primary purpose of the Global Investment Performance Standards (GIPS)?",
      questionType: 'MULTIPLE_CHOICE' as const,
      cfaLevel: 'LEVEL_3' as const,
      topicArea: 'GIPS',
      difficulty: 'HARD' as const,
      options: {
        A: "To standardize investment performance calculation and presentation",
        B: "To regulate investment advisory fees",
        C: "To establish minimum capital requirements",
        D: "To define ethical standards for investment professionals"
      },
      correctAnswer: "A",
      explanation: "GIPS standards ensure fair representation and full disclosure of investment performance results, providing standardized, industry-wide approaches for calculating and presenting performance.",
      timeToComplete: 150,
      tags: ["GIPS", "performance", "standards", "compliance"],
    },
  ]

  for (const question of sampleQuestions) {
    await prisma.question.create({
      data: question,
    })
  }

  // Create achievements
  const achievements = [
    {
      title: "First Steps",
      description: "Answer your first question correctly",
      icon: "🎯",
      category: 'QUESTIONS_ANSWERED' as const,
      difficulty: 'BRONZE' as const,
      xpReward: 50,
      requirements: { correctAnswers: 1 },
    },
    {
      title: "Quick Learner",
      description: "Answer 100 questions correctly",
      icon: "🚀",
      category: 'QUESTIONS_ANSWERED' as const,
      difficulty: 'SILVER' as const,
      xpReward: 500,
      requirements: { correctAnswers: 100 },
    },
    {
      title: "Streak Master",
      description: "Maintain a 7-day study streak",
      icon: "🔥",
      category: 'STREAK' as const,
      difficulty: 'GOLD' as const,
      xpReward: 1000,
      requirements: { studyStreak: 7 },
    },
    {
      title: "Battle Champion",
      description: "Win your first battle",
      icon: "👑",
      category: 'SOCIAL' as const,
      difficulty: 'SILVER' as const,
      xpReward: 750,
      requirements: { battlesWon: 1 },
    },
    {
      title: "Community Helper",
      description: "Create 10 forum posts",
      icon: "🤝",
      category: 'SOCIAL' as const,
      difficulty: 'BRONZE' as const,
      xpReward: 300,
      requirements: { forumPosts: 10 },
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Admin user: admin@cfaquantum.com / password123`)
  console.log(`👤 Test user: test@cfaquantum.com / password123`)
  console.log(`📝 Created ${sampleQuestions.length} sample questions`)
  console.log(`🏆 Created ${achievements.length} achievements`)
  console.log(`📂 Created ${categories.length} forum categories`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })