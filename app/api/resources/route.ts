import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import Resource from '@/lib/models/Resource'
import { verifyToken } from '@/lib/auth'

function getUser(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const query = admin ? {} : { is_public: true, status: 'approved' }

    const resources = await Resource.find(query)
      .populate('author_id', 'name avatar_url')
      .sort({ created_at: -1 })
      .limit(limit)

    const total = await Resource.countDocuments(query)

    return NextResponse.json({ data: resources, pagination: { total, limit } }, { status: 200 })
  } catch (error) {
    console.error('Resources GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, url, file_url, type, category, tags } = body
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

    await connectDB()
    const resource = await Resource.create({
      title,
      description,
      url,
      file_url,
      type: type || 'link',
      category: category || 'general',
      tags: tags || [],
      author_id: user.userId,
      status: user.role === 'admin' ? 'approved' : 'pending',
      is_public: user.role === 'admin',
    })
    await resource.populate('author_id', 'name avatar_url')

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Resources POST error:', error)
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getUser(request)
    if (user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status } = await request.json()
    if (!id || !status) return NextResponse.json({ error: 'id and status are required' }, { status: 400 })

    await connectDB()
    const resource = await Resource.findByIdAndUpdate(
      id,
      { status, is_public: status === 'approved', updated_at: new Date() },
      { new: true }
    ).populate('author_id', 'name avatar_url')

    if (!resource) return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    return NextResponse.json(resource, { status: 200 })
  } catch (error) {
    console.error('Resources PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update resource' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getUser(request)
    if (user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await connectDB()
    await Resource.findByIdAndDelete(id)
    return NextResponse.json({ id }, { status: 200 })
  } catch (error) {
    console.error('Resources DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete resource' }, { status: 500 })
  }
}
