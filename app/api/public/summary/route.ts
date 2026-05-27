import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import User from '@/lib/models/User'
import Event from '@/lib/models/Event'
import Project from '@/lib/models/Project'
import GalleryItem from '@/lib/models/GalleryItem'

export async function GET() {
  try {
    await connectDB()

    const [members, events, projects, galleryItems] = await Promise.all([
      User.countDocuments({ status: 'active' }),
      Event.countDocuments({ is_public: true }),
      Project.countDocuments({ is_public: true }),
      GalleryItem.countDocuments({ is_public: true }),
    ])

    return NextResponse.json({ members, events, projects, galleryItems }, { status: 200 })
  } catch (error) {
    console.error('Public summary error:', error)
    return NextResponse.json({ error: 'Failed to fetch public summary' }, { status: 500 })
  }
}
