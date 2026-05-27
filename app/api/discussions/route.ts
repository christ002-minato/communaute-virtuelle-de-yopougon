import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import Discussion from '@/lib/models/Discussion';
import Comment from '@/lib/models/Comment';
import { verifyToken } from '@/lib/auth'

function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const discussions = await Discussion.find()
      .populate('author_id', 'name avatar_url')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Discussion.countDocuments();

    return NextResponse.json(
      {
        data: discussions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch discussions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const decoded = getAuthUser(request)
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json();
    const { title, content, category, tags } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const discussion = new Discussion({
      title,
      content,
      author_id: decoded.userId,
      category,
      tags: tags || [],
    });

    await discussion.save();
    await discussion.populate('author_id', 'name avatar_url')

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const decoded = getAuthUser(request)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { discussionId, is_locked, is_pinned } = await request.json()
    if (!discussionId) {
      return NextResponse.json({ error: 'discussionId is required' }, { status: 400 })
    }

    await connectDB()

    const update: Record<string, unknown> = { updated_at: new Date() }
    if (typeof is_locked === 'boolean') update.is_locked = is_locked
    if (typeof is_pinned === 'boolean') update.is_pinned = is_pinned

    const discussion = await Discussion.findByIdAndUpdate(
      discussionId,
      update,
      { new: true }
    ).populate('author_id', 'name avatar_url')

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    return NextResponse.json(discussion, { status: 200 })
  } catch (error) {
    console.error('Error updating discussion:', error)
    return NextResponse.json({ error: 'Failed to update discussion' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const decoded = getAuthUser(request)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const discussionId = searchParams.get('discussionId')
    if (!discussionId) {
      return NextResponse.json({ error: 'discussionId is required' }, { status: 400 })
    }

    await connectDB()

    const deleted = await Discussion.findByIdAndDelete(discussionId)
    if (!deleted) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    await Comment.deleteMany({ discussion_id: discussionId })

    return NextResponse.json({ discussionId }, { status: 200 })
  } catch (error) {
    console.error('Error deleting discussion:', error)
    return NextResponse.json({ error: 'Failed to delete discussion' }, { status: 500 })
  }
}
