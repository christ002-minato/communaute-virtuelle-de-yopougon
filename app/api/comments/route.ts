import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import Comment from '@/lib/models/Comment'
import Discussion from '@/lib/models/Discussion'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const discussionId = searchParams.get('discussionId')
    if (!discussionId) {
      return NextResponse.json({ error: 'discussionId is required' }, { status: 400 })
    }

    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const skip = (page - 1) * limit

    const comments = await Comment.find({ discussion_id: discussionId })
      .populate('author_id', 'name avatar_url')
      .sort({ created_at: 1 })
      .skip(skip)
      .limit(limit)

    const total = await Comment.countDocuments({ discussion_id: discussionId })

    return NextResponse.json(
      { data: comments, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const token = request.cookies.get('authToken')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { discussionId, content, parentCommentId } = body

    if (!discussionId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const comment = new Comment({
      content,
      author_id: decoded.userId,
      discussion_id: discussionId,
      parent_comment_id: parentCommentId || null,
    })

    await comment.save()

    // increment discussion comment count
    await Discussion.findByIdAndUpdate(discussionId, { $inc: { comment_count: 1 } })

    const populated = await comment.populate('author_id', 'name avatar_url')

    return NextResponse.json(populated, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
