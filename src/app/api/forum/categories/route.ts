import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().min(1).max(10),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeStats = searchParams.get('includeStats') === 'true'

    const categories = await prisma.forumCategory.findMany({
      where: { isActive: true },
      ...(includeStats && {
        include: {
          posts: {
            select: { id: true, createdAt: true },
            where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
          }
        }
      }),
      orderBy: { createdAt: 'asc' },
    })

    const categoriesWithStats = categories.map(category => ({
      ...category,
      ...(includeStats && {
        recentPostCount: category.posts?.length || 0,
        posts: undefined,
      })
    }))

    return NextResponse.json({ categories: categoriesWithStats })

  } catch (error) {
    console.error('Error fetching forum categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = createCategorySchema.parse(body)

    // Check if category name already exists
    const existingCategory = await prisma.forumCategory.findUnique({
      where: { name: validatedData.name }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    const category = await prisma.forumCategory.create({
      data: validatedData,
    })

    return NextResponse.json(category, { status: 201 })

  } catch (error) {
    console.error('Error creating forum category:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation failed', errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}