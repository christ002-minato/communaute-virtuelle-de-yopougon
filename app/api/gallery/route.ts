import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import GalleryItem from '@/lib/models/GalleryItem'
import { verifyToken } from '@/lib/auth'

function requireAdmin(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  if (!token) return null
  const user = verifyToken(token)
  return user?.role === 'admin' ? user : null
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const data = await GalleryItem.find(admin ? {} : { is_public: true })
      .sort({ activity_date: -1, createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Gallery GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, image_url, link_url, album, activity_date, is_public } = body
    if (!title || !image_url) return NextResponse.json({ error: 'title and image_url are required' }, { status: 400 })

    await connectDB()
    const item = await GalleryItem.create({
      title,
      description,
      image_url,
      link_url,
      album,
      activity_date: activity_date ? new Date(activity_date) : null,
      is_public: is_public ?? true,
      created_by: admin.userId,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Gallery POST error:', error)
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await connectDB()
    await GalleryItem.findByIdAndDelete(id)
    return NextResponse.json({ id }, { status: 200 })
  } catch (error) {
    console.error('Gallery DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 })
  }
}
