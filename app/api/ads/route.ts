import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import Advertisement from '@/lib/models/Advertisement'
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
    const placement = searchParams.get('placement')
    const query: Record<string, unknown> = admin ? {} : { is_active: true }
    if (placement) query.placement = placement

    const data = await Advertisement.find(query)
      .sort({ createdAt: -1 })
      .limit(12)
      .lean()

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Ads GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, image_url, target_url, placement, sponsor_name, is_active } = body
    if (!title || !image_url) return NextResponse.json({ error: 'title and image_url are required' }, { status: 400 })

    await connectDB()
    const ad = await Advertisement.create({
      title,
      image_url,
      target_url,
      placement,
      sponsor_name,
      is_active: is_active ?? true,
      created_by: admin.userId,
    })

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error('Ads POST error:', error)
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await connectDB()
    await Advertisement.findByIdAndDelete(id)
    return NextResponse.json({ id }, { status: 200 })
  } catch (error) {
    console.error('Ads DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete advertisement' }, { status: 500 })
  }
}
