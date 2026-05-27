import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import Event from '@/lib/models/Event'
import { verifyToken } from '@/lib/auth'

function getUser(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value
  if (!token) return null
  return verifyToken(token)
}

function requireAdmin(request: NextRequest) {
  const user = getUser(request)
  return user?.role === 'admin' ? user : null
}

function mapEvent(event: any) {
  return {
    id: event._id?.toString(),
    title: event.title,
    date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 10) : '',
    time: event.time || '',
    location: event.location || '',
    type: event.category || 'cours',
    description: event.description || '',
  }
}

function buildStartDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`)
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const skip = (page - 1) * limit

    const query = url.searchParams.get('admin') === 'true' ? {} : { is_public: true }

    const events = await Event.find(query)
      .sort({ start_date: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Event.countDocuments(query)

    return NextResponse.json({
      data: events.map(mapEvent),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error('Error fetching events', err)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, date, time, location, type, description } = body

    if (!title || !date || !time || !location || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const event = await Event.create({
      title,
      description: description || '',
      start_date: buildStartDate(date),
      location,
      time,
      category: type,
      organizer_id: admin.userId,
      is_public: true,
    })

    return NextResponse.json(mapEvent(event), { status: 201 })
  } catch (err) {
    console.error('Error creating event', err)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, date, time, location, type, description } = body

    if (!id || !title || !date || !time || !location || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const event = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description: description || '',
        start_date: buildStartDate(date),
        location,
        time,
        category: type,
        updated_at: new Date(),
      },
      { new: true }
    )

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(mapEvent(event), { status: 200 })
  } catch (err) {
    console.error('Error updating event', err)
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = requireAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = new URL(request.url).searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    await connectDB()

    const event = await Event.findByIdAndDelete(id)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json({ id }, { status: 200 })
  } catch (err) {
    console.error('Error deleting event', err)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}
