import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb/client'
import User from '@/lib/models/User'
import Member from '@/lib/models/Member'
import Event from '@/lib/models/Event'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('authToken')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const [students, teachers, admins, members, events] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      User.countDocuments({ role: 'admin' }),
      Member.countDocuments(),
      Event.countDocuments(),
    ])

    return NextResponse.json(
      { students, teachers, admins, members, events },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Impossible de récupérer les statistiques admin.' },
      { status: 500 }
    )
  }
}
