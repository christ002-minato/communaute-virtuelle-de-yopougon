import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import Project from '@/lib/models/Project'
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
    const data = await Project.find(admin ? {} : { is_public: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, description, image_url, project_url, category, author_name, is_public } = body
    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

    await connectDB()
    const project = await Project.create({
      title,
      description,
      image_url,
      project_url,
      category,
      author_name,
      is_public: is_public ?? true,
      created_by: admin.userId,
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    await connectDB()
    await Project.findByIdAndDelete(id)
    return NextResponse.json({ id }, { status: 200 })
  } catch (error) {
    console.error('Projects DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
