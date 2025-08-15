import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  categoryId: z.string().cuid(),
  tags: z.array(z.string()).default([]),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (categoryId) where.categoryId = categoryId

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
              level: true
            }
          },
          category: {
            select: {
              name: true,
              color: true,
              icon: true
            }
          },
          comments: {
            select: { id: true }
          }
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ],
        take: limit,
        skip: offset,
      }),
      prisma.forumPost.count({ where })
    ])

    const postsWithCommentCount = posts.map(post => ({
      ...post,
      commentCount: post.comments.length,
      comments: undefined
    }))

    return NextResponse.json({
      posts: postsWithCommentCount,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Error fetching forum posts:', error)
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

    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    // Verify category exists
    const category = await prisma.forumCategory.findUnique({
      where: { id: validatedData.categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const post = await prisma.forumPost.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true
          }
        },
        category: {
          select: {
            name: true,
            color: true,
            icon: true
          }
        }
      }
    })

    // Update category post count
    await prisma.forumCategory.update({
      where: { id: validatedData.categoryId },
      data: { postCount: { increment: 1 } }
    })

    return NextResponse.json(post, { status: 201 })

  } catch (error) {
    console.error('Error creating forum post:', error)

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