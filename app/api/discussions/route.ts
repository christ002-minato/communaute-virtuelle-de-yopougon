import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/client';
import Discussion from '@/lib/models/Discussion';

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

    const body = await request.json();
    const { title, content, author_id, category, tags } = body;

    if (!title || !content || !author_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const discussion = new Discussion({
      title,
      content,
      author_id,
      category,
      tags: tags || [],
    });

    await discussion.save();

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error('Error creating discussion:', error);
    return NextResponse.json(
      { error: 'Failed to create discussion' },
      { status: 500 }
    );
  }
}
